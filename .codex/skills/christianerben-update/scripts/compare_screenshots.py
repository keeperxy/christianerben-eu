#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
from dataclasses import asdict, dataclass
from pathlib import Path

from PIL import Image, ImageChops


@dataclass
class ComparisonResult:
    path: str
    changed_pixels: int
    total_pixels: int
    diff_ratio: float
    dimensions_changed: bool
    diff_image: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Compare two screenshot directories and emit diff overlays.",
    )
    parser.add_argument("before_dir", help="Baseline screenshot directory.")
    parser.add_argument("after_dir", help="Updated screenshot directory.")
    parser.add_argument(
        "--diff-dir",
        required=True,
        help="Output directory for diff overlays and summary JSON.",
    )
    parser.add_argument(
        "--pixel-threshold",
        type=int,
        default=16,
        help="Minimum channel delta that counts as a changed pixel.",
    )
    parser.add_argument(
        "--warn-ratio",
        type=float,
        default=0.0025,
        help="Ratio that marks a screenshot as worth reviewing.",
    )
    parser.add_argument(
        "--fail-ratio",
        type=float,
        default=0.01,
        help="Ratio that causes the command to exit non-zero.",
    )
    return parser.parse_args()


def list_images(root: Path) -> dict[str, Path]:
    return {
        str(path.relative_to(root)): path
        for path in sorted(root.rglob("*.png"))
        if path.is_file()
    }


def normalize_size(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    if image.size == size:
        return image.convert("RGBA")
    canvas = Image.new("RGBA", size, (255, 255, 255, 255))
    canvas.paste(image.convert("RGBA"), (0, 0))
    return canvas


def compare_images(
    relative_path: str,
    before_path: Path,
    after_path: Path,
    diff_path: Path,
    pixel_threshold: int,
) -> ComparisonResult:
    before_raw = Image.open(before_path)
    after_raw = Image.open(after_path)
    target_size = (
        max(before_raw.width, after_raw.width),
        max(before_raw.height, after_raw.height),
    )
    before = normalize_size(before_raw, target_size)
    after = normalize_size(after_raw, target_size)
    difference = ImageChops.difference(before, after)

    changed_mask: list[int] = []
    changed_pixels = 0
    difference_pixels = difference.load()
    for y in range(target_size[1]):
        for x in range(target_size[0]):
            channel_delta = max(difference_pixels[x, y][:3])
            if channel_delta > pixel_threshold:
                changed_mask.append(160)
                changed_pixels += 1
            else:
                changed_mask.append(0)

    mask = Image.new("L", target_size)
    mask.putdata(changed_mask)

    overlay = Image.new("RGBA", target_size, (255, 0, 0, 0))
    overlay.putalpha(mask)
    highlighted = Image.alpha_composite(after, overlay)
    diff_path.parent.mkdir(parents=True, exist_ok=True)
    highlighted.save(diff_path)

    total_pixels = target_size[0] * target_size[1]
    return ComparisonResult(
        path=relative_path,
        changed_pixels=changed_pixels,
        total_pixels=total_pixels,
        diff_ratio=changed_pixels / total_pixels if total_pixels else 0.0,
        dimensions_changed=before_raw.size != after_raw.size,
        diff_image=str(diff_path),
    )


def main() -> int:
    args = parse_args()
    before_dir = Path(args.before_dir).resolve()
    after_dir = Path(args.after_dir).resolve()
    diff_dir = Path(args.diff_dir).resolve()

    before_images = list_images(before_dir)
    after_images = list_images(after_dir)
    missing_from_after = sorted(set(before_images) - set(after_images))
    added_in_after = sorted(set(after_images) - set(before_images))

    results = []
    for relative_path in sorted(set(before_images) & set(after_images)):
        result = compare_images(
            relative_path,
            before_images[relative_path],
            after_images[relative_path],
            diff_dir / relative_path,
            args.pixel_threshold,
        )
        results.append(result)

    summary = {
        "before_dir": str(before_dir),
        "after_dir": str(after_dir),
        "diff_dir": str(diff_dir),
        "warn_ratio": args.warn_ratio,
        "fail_ratio": args.fail_ratio,
        "missing_from_after": missing_from_after,
        "added_in_after": added_in_after,
        "results": [asdict(result) for result in results],
    }
    diff_dir.mkdir(parents=True, exist_ok=True)
    summary_path = diff_dir / "summary.json"
    summary_path.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")

    failures = 0
    for result in results:
        status = "ok"
        if result.diff_ratio >= args.fail_ratio or result.dimensions_changed:
            status = "fail"
            failures += 1
        elif result.diff_ratio >= args.warn_ratio:
            status = "warn"
        print(
            f"{status:4} {result.diff_ratio:.4%} {result.path} -> {result.diff_image}",
        )

    if missing_from_after:
        failures += len(missing_from_after)
        print(f"fail missing screenshots in after set: {', '.join(missing_from_after)}")
    if added_in_after:
        failures += len(added_in_after)
        print(f"fail unexpected screenshots in after set: {', '.join(added_in_after)}")

    print(json.dumps({"summary": str(summary_path), "failures": failures}, indent=2))
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
