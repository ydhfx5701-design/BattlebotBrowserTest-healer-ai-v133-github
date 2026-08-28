from __future__ import annotations

import io
import json
import struct
import sys
from pathlib import Path

from PIL import Image


JSON_CHUNK = 0x4E4F534A
BIN_CHUNK = 0x004E4942


def pad4(data: bytes, fill: bytes = b"\x00") -> bytes:
    return data + fill * ((-len(data)) % 4)


def optimize_glb(path: Path, max_texture_size: int = 1024) -> tuple[int, int, int]:
    source = path.read_bytes()
    magic, version, _ = struct.unpack_from("<4sII", source, 0)
    if magic != b"glTF" or version != 2:
        raise ValueError(f"Not a GLB 2.0 file: {path}")

    json_length, json_type = struct.unpack_from("<II", source, 12)
    if json_type != JSON_CHUNK:
        raise ValueError(f"Missing JSON chunk: {path}")
    json_start = 20
    document = json.loads(source[json_start : json_start + json_length].decode("utf-8").rstrip(" \x00"))
    bin_header = json_start + json_length
    bin_length, bin_type = struct.unpack_from("<II", source, bin_header)
    if bin_type != BIN_CHUNK:
        raise ValueError(f"Missing BIN chunk: {path}")
    binary = source[bin_header + 8 : bin_header + 8 + bin_length]

    image_views = {image.get("bufferView"): image for image in document.get("images", []) if "bufferView" in image}
    rebuilt = bytearray()
    resized = 0
    for index, view in enumerate(document.get("bufferViews", [])):
        start = int(view.get("byteOffset", 0))
        end = start + int(view["byteLength"])
        payload = bytes(binary[start:end])
        image = image_views.get(index)
        if image and image.get("mimeType") in {"image/png", "image/jpeg"}:
            with Image.open(io.BytesIO(payload)) as bitmap:
                bitmap.load()
                if max(bitmap.size) > max_texture_size:
                    bitmap.thumbnail((max_texture_size, max_texture_size), Image.Resampling.LANCZOS)
                    resized += 1
                output = io.BytesIO()
                if image["mimeType"] == "image/jpeg":
                    bitmap.convert("RGB").save(output, format="JPEG", quality=84, optimize=True, progressive=True)
                else:
                    bitmap.save(output, format="PNG", optimize=True, compress_level=9)
                payload = output.getvalue()
        while len(rebuilt) % 4:
            rebuilt.append(0)
        view["byteOffset"] = len(rebuilt)
        view["byteLength"] = len(payload)
        rebuilt.extend(payload)

    document["buffers"][0]["byteLength"] = len(rebuilt)
    json_bytes = pad4(json.dumps(document, ensure_ascii=False, separators=(",", ":")).encode("utf-8"), b" ")
    bin_bytes = pad4(bytes(rebuilt), b"\x00")
    total_length = 12 + 8 + len(json_bytes) + 8 + len(bin_bytes)
    result = bytearray(struct.pack("<4sII", b"glTF", 2, total_length))
    result.extend(struct.pack("<II", len(json_bytes), JSON_CHUNK))
    result.extend(json_bytes)
    result.extend(struct.pack("<II", len(bin_bytes), BIN_CHUNK))
    result.extend(bin_bytes)
    path.write_bytes(result)
    return len(source), len(result), resized


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("usage: optimize_glb_textures.py <directory> [max-size]")
    target = Path(sys.argv[1])
    max_size = int(sys.argv[2]) if len(sys.argv) > 2 else 1024
    paths = [target] if target.is_file() else sorted(target.glob("*.glb"))
    for path in paths:
        before, after, resized = optimize_glb(path, max_size)
        print(f"{path.name}: {before:,} -> {after:,} bytes; resized textures={resized}")


if __name__ == "__main__":
    main()
