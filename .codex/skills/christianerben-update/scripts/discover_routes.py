#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
from pathlib import Path

from project_routes import discover_routes


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Discover screenshotable routes from the Next.js pages directory.",
    )
    parser.add_argument(
        "--pages-dir",
        default="src/pages",
        help="Path to the Next.js pages directory relative to the project root.",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit the route inventory as JSON instead of one route per line.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    pages_dir = Path(args.pages_dir).resolve()
    routes = discover_routes(pages_dir)

    if args.json:
        print(json.dumps(routes, indent=2))
    else:
        for route in routes:
            print(route)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
