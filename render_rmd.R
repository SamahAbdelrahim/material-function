#!/usr/bin/env Rscript
#' Render R Markdown using environment from material-function/.env
#'
#' Usage (from anywhere):
#'   Rscript /path/to/material-function/render_rmd.R summer2025/foo.rmd
#'
#' Paths are relative to the material-function directory (this script's folder).
#' Example on how to run from anywhere uisng zsh terminal : Rscript render_rmd.R summer2025/followup_1_endorsment_cursor.rmd
#' using the following command: Rscript /Users/samahabdelrahim/git-repos/material-function/render_rmd.R summer2025/followup_1_endorsment_cursor.rmd
#' this will render the rmd file in the summer2025 folder and the output will be saved in the summer2025 folder as a html file.
#' the html file will be named followup_1_endorsment_cursor.html
#' the html file will be saved in the summer2025 folder.
#' the html file will be saved in the summer2025 folder.
args_all <- commandArgs(trailingOnly = FALSE)
f <- grep("^--file=", args_all, value = TRUE)
if (!length(f))
  stop("Could not locate script path; run via Rscript render_rmd.R ...")
proj_root <- dirname(normalizePath(sub("^--file=", "", f[[1]])))

setwd(proj_root)

load_dot_env <- function(path) {
  if (!file.exists(path)) return(invisible(NULL))
  lines <- readLines(path, warn = FALSE, encoding = "UTF-8")
  for (raw in lines) {
    line <- trimws(raw)
    if (!nzchar(line)) next
    ch1 <- substr(line, 1L, 1L)
    if (ch1 == "#") next
    eq <- regexpr("=", line, fixed = TRUE)
    if (eq < 1L) next
    key <- trimws(substr(line, 1L, eq - 1L))
    val <- trimws(substr(line, eq + 1L, nchar(line)))
    if (!nzchar(key)) next
    if (startsWith(val, "\"") && endsWith(val, "\""))
      val <- substr(val, 2L, nchar(val) - 1L)
    else if (startsWith(val, "'") && endsWith(val, "'"))
      val <- substr(val, 2L, nchar(val) - 1L)
    do.call(base::Sys.setenv, stats::setNames(list(val), key))
  }
  invisible(TRUE)
}

load_dot_env(file.path(proj_root, ".env"))

prepend <- Sys.getenv("PATH_PREPEND", "")
if (nzchar(prepend))
  Sys.setenv(PATH = paste(prepend, Sys.getenv("PATH"), sep = .Platform$path.sep))

args_trail <- commandArgs(trailingOnly = TRUE)
if (!length(args_trail))
  stop("Usage: Rscript render_rmd.R <path/to/doc.rmd> (relative to material-function/)")

rmd_rel <- args_trail[[1]]
rmd_abs <- normalizePath(file.path(proj_root, rmd_rel), mustWork = TRUE)

if (!requireNamespace("rmarkdown", quietly = TRUE))
  stop('Install packages: install.packages("rmarkdown")')

rmarkdown::render(rmd_abs, encoding = "UTF-8")
