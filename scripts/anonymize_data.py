#!/usr/bin/env python3
"""
Read identified CSV tables from ./data_identified (default), drop sensitive columns per
scripts/pii_columns.py, then write sanitized files to ./data/ with the same basenames.

Uses only the standard library. Rows are rewritten with csv.writer so commas inside
cells are preserved.
"""

from __future__ import annotations

import argparse
import csv
import os
import sys
from pathlib import Path

from pii_columns import should_drop_column


def get_source_csv_paths(root_dir: Path) -> list[Path]:
    paths: list[Path] = []
    for dirpath, _dirnames, filenames in os.walk(root_dir):
        for fname in filenames:
            if not fname.endswith(".csv"):
                continue
            paths.append(Path(dirpath) / fname)
    return sorted(paths)


def anonymize_csv(
    src: Path,
    dst: Path,
    *,
    drop_participant_keys: bool,
    encoding: str = "utf-8-sig",
) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)

    with src.open(newline="", encoding=encoding, errors="replace") as f_in:
        reader = csv.reader(f_in)
        try:
            header = next(reader)
        except StopIteration:
            raise ValueError(f"empty file: {src}") from None

        keep_idx = [
            i
            for i, name in enumerate(header)
            if not should_drop_column(
                name,
                drop_participant_keys=drop_participant_keys,
                extra_columns=None,
            )
        ]

        with dst.open("w", newline="", encoding="utf-8") as f_out:
            writer = csv.writer(f_out, lineterminator="\n")
            writer.writerow([header[i] for i in keep_idx])
            for row in reader:
                padded = row + [""] * max(0, len(header) - len(row))
                writer.writerow([padded[i] for i in keep_idx])


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Write de-identified CSVs from data_identified into data/ "
            "(same basename, columns filtered)."
        )
    )
    parser.add_argument(
        "--from",
        dest="source_root",
        type=Path,
        default=Path("data_identified"),
        help="Tree with identified exports (default: ./data_identified)",
    )
    parser.add_argument(
        "--to",
        dest="output_root",
        type=Path,
        default=Path("data"),
        help="Destination tree for sanitized files (default: ./data)",
    )
    parser.add_argument(
        "--drop-participant-keys",
        action="store_true",
        help="Also remove kidid / subject_id style columns (off by default).",
    )
    parser.add_argument(
        "--encoding",
        default="utf-8-sig",
        help="Input encoding (default utf-8-sig for Excel / Qualtrics exports).",
    )
    parser.add_argument(
        "--only",
        action="append",
        default=[],
        metavar="FILENAME.csv",
        help=(
            "Limit to this basename (repeatable). When omitted, every .csv under "
            "the source tree is converted."
        ),
    )
    args = parser.parse_args(argv)

    source = args.source_root.resolve()
    output = args.output_root.resolve()
    if not source.is_dir():
        print(f"source dir not found: {source}", file=sys.stderr)
        return 1

    targets = get_source_csv_paths(source)
    allow = {name.lower() for name in args.only}
    if allow:
        targets = [p for p in targets if p.name.lower() in allow]
        missing = sorted(allow - {p.name.lower() for p in targets})
        for name in missing:
            print(f"warning: --only {name!r} has no matching csv under {source}", file=sys.stderr)
    if not targets:
        print(f"no .csv files under {source}", file=sys.stderr)
        return 0

    for path in targets:
        rel = path.relative_to(source)
        dest = output / rel
        print(f"{path} -> {dest}")
        anonymize_csv(
            path,
            dest,
            drop_participant_keys=args.drop_participant_keys,
            encoding=args.encoding,
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
