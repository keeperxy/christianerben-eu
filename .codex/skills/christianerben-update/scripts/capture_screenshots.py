#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path
from urllib.parse import urljoin

from project_routes import discover_routes

MODE_CONFIG = {
    "desktop": ["--viewport-size", "1440,1200"],
    "mobile": ["--device", "iPhone 13"],
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Capture full-page screenshots for every user-facing route.",
    )
    parser.add_argument(
        "--pages-dir",
        default="src/pages",
        help="Path to the Next.js pages directory relative to the current working directory.",
    )
    parser.add_argument("--base-url", required=True, help="Base URL for the running local site.")
    parser.add_argument("--output-dir", required=True, help="Directory for screenshot output.")
    parser.add_argument(
        "--modes",
        default="desktop,mobile",
        help="Comma-separated capture modes. Supported values: desktop,mobile",
    )
    parser.add_argument(
        "--wait-ms",
        type=int,
        default=1800,
        help="Additional wait after #__next appears, in milliseconds.",
    )
    parser.add_argument(
        "--timeout-ms",
        type=int,
        default=30000,
        help="Timeout for each Playwright screenshot command.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print the planned capture manifest without running Playwright.",
    )
    return parser.parse_args()


def normalize_modes(raw_modes: str) -> list[str]:
    modes = [mode.strip() for mode in raw_modes.split(",") if mode.strip()]
    invalid = [mode for mode in modes if mode not in MODE_CONFIG]
    if invalid:
        raise SystemExit(f"Unsupported capture mode(s): {', '.join(invalid)}")
    if not modes:
        raise SystemExit("At least one capture mode is required.")
    return modes


def route_slug(route: str) -> str:
    if route == "/":
        return "root"
    return route.strip("/").replace("/", "__")


def route_url(base_url: str, route: str) -> str:
    normalized_base = base_url.rstrip("/") + "/"
    return urljoin(normalized_base, route.lstrip("/"))


def build_command(url: str, destination: Path, wait_ms: int, timeout_ms: int, mode: str) -> list[str]:
    return [
        "bunx",
        "playwright",
        "screenshot",
        "--browser",
        "chromium",
        "--full-page",
        "--wait-for-selector",
        "#__next",
        "--wait-for-timeout",
        str(wait_ms),
        "--timeout",
        str(timeout_ms),
        "--color-scheme",
        "light",
        "--lang",
        "en-US",
        *MODE_CONFIG[mode],
        url,
        str(destination),
    ]


def capture(manifest: list[dict[str, str]], wait_ms: int, timeout_ms: int, dry_run: bool) -> None:
    for item in manifest:
        command = build_command(
            item["url"],
            Path(item["file"]),
            wait_ms,
            timeout_ms,
            item["mode"],
        )
        if dry_run:
            print(" ".join(command))
            continue

        completed = subprocess.run(
            command,
            check=False,
            text=True,
            capture_output=True,
        )
        if completed.returncode != 0:
            if completed.stderr:
                sys.stderr.write(completed.stderr)
            if "Executable doesn't exist" in completed.stderr:
                sys.stderr.write(
                    "\nPlaywright Chromium is missing. Run `bunx playwright install chromium` and retry.\n",
                )
            raise SystemExit(completed.returncode)


def main() -> int:
    args = parse_args()
    pages_dir = Path(args.pages_dir).resolve()
    output_dir = Path(args.output_dir).resolve()
    modes = normalize_modes(args.modes)
    routes = discover_routes(pages_dir)
    manifest: list[dict[str, str]] = []

    for mode in modes:
        mode_dir = output_dir / mode
        mode_dir.mkdir(parents=True, exist_ok=True)
        for route in routes:
            destination = mode_dir / f"{route_slug(route)}.png"
            manifest.append(
                {
                    "mode": mode,
                    "route": route,
                    "url": route_url(args.base_url, route),
                    "file": str(destination),
                },
            )

    capture(manifest, args.wait_ms, args.timeout_ms, args.dry_run)

    manifest_path = output_dir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"manifest": str(manifest_path), "captures": len(manifest)}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
