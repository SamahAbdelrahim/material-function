#!/usr/bin/env python3
"""
pre-commit hook helper: fail if any staged data/*.csv still contains forbidden headers.

Pass file paths as argv (pre-commit does this when pass_filenames is true).
"""

from __future__ import annotations

import csv
import os
import sys
from pathlib import Path

from pii_columns import header_row_has_forbidden_columns

# Allow stricter checks without editing the script.
_STRICT = os.environ.get("STRICT_DATA_CHECK", "").lower() in {"1", "true", "yes"}


def _read_header(path: Path, encoding: str = "utf-8-sig") -> list[str]:
    with path.open(newline="", encoding=encoding, errors="replace") as f:
        reader = csv.reader(f)
        return next(reader, [])


def main(argv: list[str]) -> int:
    bad_reports: list[str] = []
    for raw in argv:
        path = Path(raw)
        if not path.suffix.lower() == ".csv":
            continue
        try:
            header = _read_header(path)
        except OSError as exc:
            bad_reports.append(f"{path}: could not read ({exc})")
            continue
        forbidden = header_row_has_forbidden_columns(
            header, drop_participant_keys=_STRICT, extra_columns=None
        )
        if forbidden:
            preview = ", ".join(forbidden[:12])
            more = " ..." if len(forbidden) > 12 else ""
            bad_reports.append(f"{path}: forbidden columns: {preview}{more}")

    if not bad_reports:
        return 0

    print(
        "Staged CSVs under data/ still list columns that should not be committed.\n"
        "Identified spreadsheets should stay only in ./data_identified (gitignored).\n"
        "Regenerate sanitized copies:\n"
        "  python3 scripts/anonymize_data.py --from data_identified --to data\n"
        "Add optional --drop-participant-keys for public bundles without kidid / subject ids.\n"
        "Set STRICT_DATA_CHECK=1 during commit hooks to forbid participant-key columns.\n",
        file=sys.stderr,
    )
    for line in bad_reports:
        print(line, file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
