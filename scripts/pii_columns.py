from __future__ import annotations

"""
Shared rules for dropping or flagging CSV columns before public / git sharing.

Keeps behavioral columns (trial, condition, responses) by default. Participant keys
such as kidid stay unless callers ask to strip them explicitly.
"""


def normalize_column_name(name: str) -> str:
    """Stable comparison key for headings (handles spacing / case quirks)."""
    if name is None:
        return ""
    return " ".join(str(name).strip().lower().split())


# Typical Qualtrics / recruitment exports (adapted from psych251 replication_template)
_QUALTRICS_PII_COLUMNS = """
RecipientLastName
RecipientFirstName
RecipientEmail
ExternalDataReference
IPAddress
LocationLatitude
LocationLongitude
PROLIFIC_PID
ResponseId
PanelistID
"""


# Behavioral lab spreadsheets in this repo (see data/*.csv headers)
_LAB_COLUMNS = """
birthday
dob
date of birth
gender
race
ethnicity
bilingual
2ndlang
age (months)
age (years)
age_mo
age_yr
ageyear
years
experimenter
coder
coder1
coder2
notes
test_objects comments
"""


def _exact_forbidden_set() -> frozenset[str]:
    raw = (_QUALTRICS_PII_COLUMNS + "\n" + _LAB_COLUMNS).splitlines()
    return frozenset(normalize_column_name(line) for line in raw if line.strip())


EXACT_FORBIDDEN_NORMALIZED = _exact_forbidden_set()

# Column names that include these substrings are treated as free-text / staff notes
# derived from multiple coders (e.g. "material comment-coder2").
_SUBSTRING_FORBIDDEN = ("material comment",)


def should_drop_column(
    name: str,
    *,
    drop_participant_keys: bool = False,
    extra_columns: frozenset[str] | None = None,
) -> bool:
    """
    Return True if this column should be removed in anonymized exports.
    """
    n = normalize_column_name(name)
    if not n:
        return False
    if extra_columns:
        if n in extra_columns:
            return True
    if n in EXACT_FORBIDDEN_NORMALIZED:
        return True
    for frag in _SUBSTRING_FORBIDDEN:
        if frag in n:
            return True
    if drop_participant_keys:
        if n in frozenset({"kidid", "participant_id", "subject_id", "prolific id"}):
            return True
    return False


def header_row_has_forbidden_columns(
    header: list[str],
    *,
    drop_participant_keys: bool = False,
    extra_columns: frozenset[str] | None = None,
) -> list[str]:
    """
    Return the list of original column names that must not appear in shared files.
    """
    bad: list[str] = []
    for col in header:
        if should_drop_column(
            col,
            drop_participant_keys=drop_participant_keys,
            extra_columns=extra_columns,
        ):
            bad.append(col)
    return bad
