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
| `Manuscript/` | Main paper: `MS.rmd` (papaja / APA-style PDF output), bibliographies `r-references.bib`, `r-library.bib` |
| `data/` | CSV tables read by the R Markdown (see `read_csv(here(...))` in `MS.rmd`; filenames and variables reflect the experiments in the text) |
| `online_experiments/` | Code for supplementary web-based tasks (e.g. ratings paradigms): HTML, JavaScript, a small Node server, vendored jsPsych assets. Stimulus movies are not currently in the repo. |
| `material_function.Rproj` | RStudio project file; opening it sets the project root so paths in `MS.rmd` resolve correctly with `here`. |

## Reproducing the analyses and figures in the manuscript

The expected workflow:

1. Clone the repository and open `material_function.Rproj` in RStudio (or set the working directory to the repository root).
2. Install the R packages called in `Manuscript/MS.rmd` (see the `library(...)` calls in the setup chunk; they include tools for tidying, plotting, mixed models, and papaja rendering).
3. Confirm the CSV paths under `data/` match those in `MS.rmd` (the document uses `here::i_am("Manuscript/MS.rmd")` so those paths stay anchored to the repo root).
4. Knit `Manuscript/MS.rmd`. papaja will regenerate the PDF/LaTeX and figures as configured in the YAML; build artifacts such as `Manuscript/figs/` may be regenerated locally and are not required to be committed.

Minor numerical differences can still arise from R/package versions or random seeds where relevant; pinning versions (e.g. with renv) improves bit-for-bit stability but is not required to verify the structure of the analysis.

## Online task code (for transparency, not standalone reuse)

The folder `online_experiments/ratings_experiment/` documents the stimuli used in the experiment and to obtain norming scores on them. To run the task locally you would need the same `.mp4` stimuli arranged as on our lab machines (see `video_list.json` and trial scripts), then:

```bash
cd online_experiments/ratings_experiment
npm install
npm start
```

## Data and ethics

Shared tables should contain only what our IRB and de-identification plan allow for public release. If you reuse materials or design a replication, obtain appropriate ethics approval and consent for your context; constraints may differ from ours.
