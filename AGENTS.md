# Agent Instructions

This directory contains the local `textlint-rule-ja-ten-maru` package.

## Overview

A [textlint](https://textlint.org/) rule that normalizes misused Japanese
punctuation to the canonical ideographic forms: `，`/`､` → `、` (U+3001) and
`．`/`｡` → `。` (U+3002). It is auto-fixable (`--fix`) and exposes `ten` /
`maru` options to toggle comma / full-stop normalization independently. See
`README.md` for the full conversion table and usage.

## Package Layout

- `src/index.ts`: Entry point. Default-exports a `TextlintRuleModule` whose
  `linter` and `fixer` share one reporter. Make code changes here.
- `src/index.test.ts`: `textlint-tester` + Vitest cases (valid/invalid
  fixtures).
- `lib/`: Build output. Do not edit this directory directly unless explicitly
  asked.

## Testing

- This package uses Vitest for tests.
- For package-local changes, verify with `pnpm test` when test execution is
  needed.

## Type Checking

- Rely on Oxlint's type-aware checks because `typeCheck` is enabled in
  `.oxlintrc.json`.
- Use `pnpm lint` for standalone type checking. Do **NOT** run `tsc --noEmit` as
  a separate type-check command.
