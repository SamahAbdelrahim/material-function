# Research materials: children’s novel word extension and the shape bias

This repository holds project-specific materials for a longitudinal program of behavioral studies with children (from summer 2024 onward) on novel word extension and the shape bias: how children generalize newly taught object labels when test objects differ in shape, material, function, and related dimensions.

This is a working archive we share alongside the manuscript so that reviewers, readers, and other researchers can:

- see how the research questions connect to the data layout and analytic choices described in the paper;
- re-run the documented analyses and recreate the reported results from the deposited tables; and, if they obtain comparable data and ethics approval, attempt an independent replication using the same logic (not necessarily identical stimuli or populations).

## Experiments (overview)

The paper is built as a **linked series of four studies** with the same object sets: **Experiments 1–3** are the main empirical arc in the manuscript; **Experiment 4** is the next step (pragmatic framing of the question). In order: (1) a **baseline** forced-choice task pitting shape against material to validate stimuli and get a developmental signal; (2) a **larger within-subject** study adding **function** competitors and tighter tests of age and condition; (3) a **replication** with stimulus fixes plus **graded endorsement** after the first choice, to separate initial preference from flexible acceptance of other dimensions; (4) **label vs. function wording**, to test whether how the adult asks shifts shape–function weighting. 

## What is in this repository

| Path | Contents |
|------|----------|
| `Manuscript/` | Main paper: `MS.rmd` (papaja / APA-style PDF output), bibliographies `r-references.bib`, `r-library.bib`; `figs/`, working notes under `interpret/`, drafts like `theoretical-skeleton.md` |
| `data/` | De-identified CSV inputs referenced by the manuscripts and notebooks (`MS.rmd`, `summer2025/…`). Columns are checked on commit via `scripts/check_staged_csvs.py`. |
| `data_identified/` | Identified lab exports (never committed; see `.gitignore`). Keep full spreadsheets here locally, regenerate `data/` with `scripts/anonymize_data.py`. |
| `summer2025/` | Latest endorsement-analysis notebook (`followup_1_endorsment_cursor.rmd`); superseded exploratory work lives under `archive/summer2025/` |
| `figures/` | Plots exported from notebooks when written with `here::here("figures", ...)` |
| `render_rmd.R` | Optional headless knitting helper: loads `./.env` (see `.env.example`) then calls `rmarkdown::render(...)` relative to repo root |
| `MEMORY.md` | Project decision log (not part of reproducibility artifacts) |
| `archive/` | Legacy CogSci and 2024 analysis trees, miscellaneous notes, superseded manuscripts and data snapshots, bundled online-task assets; see `archive/README.md` |
| `material_function.Rproj` | RStudio project file; opening it sets the project root so `here()` paths resolve. |

Older paths such as **`online_experiments/`**, **`misc/`**, and **`analysis-2024/`** were moved intact into **`archive/`** (see inventory there). Anything still needed locally can be dragged back beside `Manuscript/`.

## Reproducing the analyses and figures in the manuscript

The expected workflow:

1. Clone the repository and open `material_function.Rproj` in RStudio (or set the working directory to the repository root).
2. Install the R packages called in `Manuscript/MS.rmd` (see the `library(...)` calls in the setup chunk; they include tools for tidying, plotting, mixed models, and papaja rendering).
3. Confirm the CSV paths under `data/` match those in `MS.rmd` (the document uses `here::i_am("Manuscript/MS.rmd")` so those paths stay anchored to the repo root).
4. Knit `Manuscript/MS.rmd`. papaja will regenerate the PDF/LaTeX and figures as configured in the YAML; build artifacts such as `Manuscript/figs/` may be regenerated locally and are not required to be committed.

Minor numerical differences can still arise from R/package versions or random seeds where relevant; pinning versions (e.g. with renv) improves bit-for-bit stability but is not required to verify the structure of the analysis.

## Online task code (for transparency, not standalone reuse)

The archived folder **`archive/online_experiments/ratings_experiment/`** documents the stimuli and code used to collect norming scores. To run the task locally you would need the same `.mp4` stimuli arranged as on our lab machines (see `video_list.json` and trial scripts), then:

```bash
cd archive/online_experiments/ratings_experiment
npm install
npm start
```

## Data and ethics

Shared tables should contain only what our IRB and de-identification plan allow for public release. If you reuse materials or design a replication, obtain appropriate ethics approval and consent for your context; constraints may differ from ours.

### De-identifying CSVs before git

1. Editing happens against **`data_identified/`** locally (ignored by Git). Populate it with raw exports keyed by basename (for example copy from your lab spreadsheets). When syncing from collaborators, overwrite the matching basename there—not under `data/`.

2. Regenerate sanitized tables into **`data/`** (overwrite same basenames):

   ```bash
   python3 scripts/anonymize_data.py
   ```

   Paths default to `--from data_identified --to data`. Columns removed are centralized in `scripts/pii_columns.py`.

   Optional: regenerate only manuscripts you intend to publish, so older waves stay archived strictly under `data_identified/`:

   ```bash
   python3 scripts/anonymize_data.py \
     --only Bing3.0Fall25.csv --only JMZSummer24.csv
   ```

   Add `--drop-participant-keys` if you must strip `kidid` / similar keys for sharing outside the lab.

3. Optional but recommended: install [pre-commit](https://pre-commit.com/), then inside this repo run `pre-commit install`. Staged `data/*.csv` files are screened for forbidden headers before commit.

4. If `pre-commit` is not on your `PATH`, call the shim that lives next to Python, e.g. `/path/to/.venv/bin/pre-commit install`, or activate the virtualenv before installing hooks.

Editable column logic lives in `scripts/pii_columns.py` shared by both the exporter and the hook.

#### Bootstrapping `data_identified/` from Git history

If you already pushed identified tables before switching layouts, blobs still exist on **`origin/main`**. Populate (or refresh) `./data_identified` from Git, then overwrite with anything newer that only exists in `git`:

```bash
python3 - <<'PY'
import subprocess
from pathlib import Path

out = Path("data_identified")
out.mkdir(exist_ok=True)
for path in subprocess.check_output(
    ["git", "ls-tree", "-r", "--name-only", "origin/main", "--", "data"]
).decode().splitlines():
    name = Path(path).name
    blob = subprocess.check_output(["git", "show", f"origin/main:{path}"])
    (out / name).write_bytes(blob)
for path in subprocess.check_output(["git", "ls-files", "-z", "--", "data"]).decode("utf-8").split("\0"):
    if not path.endswith(".csv"):
        continue
    name = Path(path).name
    try:
        blob = subprocess.check_output(["git", "show", f":{path}"])
    except subprocess.CalledProcessError:
        continue
    (out / name).write_bytes(blob)
    print("overlay", name)
PY
```

Run `python3 scripts/anonymize_data.py` afterward so `data/` matches the public layout.
