# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

An **agent skill** (`SKILL.md` is the entrypoint other agents load), not an app. It turns a lesson's claim into an interactive "predict → try → explain" figure. The repo bundles the skill's guidance (`references/`), two vendored upstream rendering toolkits (`assets/anatomy/`, `assets/iso-figure/`), six complete offline example lessons (`examples/`), and tests. There is no runtime package dependency; Node ≥20 runs builders and tests, Playwright is dev-only.

## Commands

```sh
npm ci
npm test                 # node --test tests/*.test.mjs  — models, teaching specs, Anatomy builds (6 examples × light/dark)
npm run test:browser     # node --test tests/*.test.cjs  — Playwright against examples/ and assets/iso-figure/examples/
npm run audit:3d         # slow full turning-dial geometry audit (runs in a temp copy)
```

- Single test: `node --test --test-name-pattern="rocket" tests/examples.test.cjs` (or pass one file).
- Browser tests use installed Google Chrome by default; set `BROWSER_CHANNEL=chromium` for Playwright's Chromium. `PLAYWRIGHT_MODULE` overrides the module path.
- Build tests and the 3D audit copy `assets/anatomy/` to a temp dir and build there — bundled sources stay unchanged. Don't run `build.mjs` in place (outputs `assets/anatomy/examples/*/*.html` are gitignored).

## Generated content embedded in examples

Two examples contain generated regions; edit the generator, then regenerate, rather than hand-editing those regions:

- `scripts/build-rocket-visual.mjs` → rewrites the `ROCKET_STRUCTURE_*` and `ROCKET_ENGINE_*` comment-delimited blocks in `examples/rocket-launch.html`, using the Anatomy kit (`assets/anatomy/kit/`).
- `scripts/capture-previews.mjs` → screenshots each lesson's stage into `examples/previews/*-{light,dark}.jpg` for the cards in `examples/index.html`. Rerun after changing an example's visuals; adding a lesson means adding its stage selector there and a card (one `<a>` per `article`, which the browser test counts).
- `scripts/prepare-anatomy.mjs .audit/hra` → regenerates `assets/hra/chest-meshes.json`, `provenance.json`, and the embedded JSON in `examples/human-anatomy.html` from pinned HRA GLB files (hash-checked). Download steps are in `assets/hra/README.md`.

## Architecture and conventions

- **SKILL.md workflow:** Scope (what to decline) → section 0 interaction mode (guided interview by default, direct mode on request) → mechanism → renderer → spec → build → operability → verification. Keep the README "Quick install / Two ways to use it / What it is for" sections consistent with SKILL.md's Scope and section 0.
- **Teaching model drives everything.** Each figure has one pure model (state, readouts, prediction result, accessible summary); geometry/UI only observe it. Tests assert model behavior through real interaction, not displayed wording.
- **Mechanism (`kind`) and renderer are separate choices.** `references/rendering-selection.md` routes subjects: iso-figure for box-like working devices, Anatomy kit for crafted rigid mechanisms, source meshes/custom illustration for organic anatomy and textiles. "Anatomy" is the upstream toolkit name, not a medical atlas.
- **Examples are standalone, offline HTML** — no remote scripts/assets (tests check for network requests), native controls, reset, no autoplay before prediction, scoped keyboard shortcuts, reduced-motion support, 360px mobile + both color schemes. `examples/` is published to GitHub Pages via `git subtree push --prefix examples origin gh-pages`.
- **Upstream provenance matters.** `references/source-manifest.json` pins upstream revisions and lists local adaptations; `references/sources-and-fusion.md` explains contribution boundaries. Keep MIT notices in `assets/*/LICENSE` and HRA CC BY 4.0 attribution. Record local changes to vendored code there.
- `references/ai-english-shift.md` is an adapter for one specific host app; its contracts apply only there.
- `reviews/` holds dated review reports and raw audit output. Only claim checks that were actually run; a quick audit is not a full audit.
- `README.md` and `README.zh-CN.md` are parallel — keep them in sync when changing user-facing docs. `dist/` (the `.skill` archive) is gitignored and attached to releases.
