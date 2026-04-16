#!/usr/bin/env python3

from __future__ import annotations

from pathlib import Path

PAGE_SUFFIXES = {".tsx", ".ts", ".jsx", ".js"}
EXCLUDED_STEMS = {"_app", "_document"}
EXCLUDED_SEGMENTS = {"api"}


def route_sort_key(route: str) -> tuple[int, str]:
    return (0, "") if route == "/" else (1, route)


def path_to_route(path: Path, pages_dir: Path) -> str | None:
    relative = path.relative_to(pages_dir)
    parts = relative.parts

    if not parts:
        return None
    if parts[0] in EXCLUDED_SEGMENTS:
        return None
    if path.suffix not in PAGE_SUFFIXES:
        return None

    stem = path.stem
    if stem in EXCLUDED_STEMS or stem.startswith("_"):
        return None
    if ".test." in path.name or ".spec." in path.name:
        return None

    route_parts = list(parts[:-1])
    if stem != "index":
        route_parts.append(stem)

    if not route_parts:
        return "/"
    return "/" + "/".join(route_parts)


def discover_routes(pages_dir: Path) -> list[str]:
    routes = set()
    for path in pages_dir.rglob("*"):
        if not path.is_file():
            continue
        route = path_to_route(path, pages_dir)
        if route:
            routes.add(route)
    return sorted(routes, key=route_sort_key)
