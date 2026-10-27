<p align="center">
  <img src="assets/readme/hero.svg" width="100%" alt="Teachable figures. An agent skill for interactive learning through predict, try, and explain.">
</p>

# Teachable figures

Turn a lesson's claim into an experiment a learner can operate. Predict a result, change a cause, read the effect, and explain a new case.

This is an **agent skill**, with rendering examples and verification tools. It works with a host application's lesson schema or a standalone HTML figure.

## See the teaching loop

The [gear-ratio lesson](examples/gear-ratio.html) asks whether an extra idler gear makes the output slower. One input turn produces half an output turn with a 12-tooth driver and 24-tooth output. The idler changes direction while preserving that magnitude.

![Gear-ratio experiment after both trials. Both outputs make half a turn; the idler changes direction. Native controls and turn counters make the result inspectable.](assets/readme/gear-ratio.png)

Open the HTML file locally. It runs without a server, framework, or remote assets. The gears are a schematic of an ideal model, not a physical tooth-contact simulation.

## Use the skill

Clone the repository into your agent's skill directory. For a local Codex installation:

```sh
git clone https://github.com/ywEdAi/teachable-figures.git ~/.codex/skills/teachable-figures
```

You can also download the portable [`.skill` archive from the latest release](https://github.com/ywEdAi/teachable-figures/releases/latest).

Then ask:

```text
Use $teachable-figures to explain why adding an idler gear does not
change the final speed-ratio magnitude. I think an extra gear always
makes the output slower. Make a standalone figure with prediction,
one-turn counters, native controls, reset, and an explanation prompt.
```

For another agent, point it at [SKILL.md](SKILL.md) and provide the lesson text, intended learner, and host project. The skill inspects existing contracts before adding fields or widgets.

## Start with the mechanism

The teaching spec names a claim, misconception, cause, observable effect, and truth model before geometry. One model drives motion, readouts, accessible summaries, and explanations.

Choose the simplest renderer that exposes the cause:

| Mode | Use it for |
| --- | --- |
| 2D SVG | Distributions, curves, state traces, and small processes. |
| Lightweight isometric SVG | Working keys, switches, drawers, and screens. |
| Mechanical SVG | Supports, joints, pipes, cutaways, and exploded assemblies. |
| Turning 3D | Rotation or changing occlusion that explains the concept. |
| Optional WebGL | Fields such as waves, heat, or light that need it. |

Renderer and mechanism are separate choices. A gear ratio does not need a 3D renderer to teach the ratio.

## Review and iteration

The October 27 review includes independent [UI/UX feedback](reviews/uiux.md), [pedagogical feedback](reviews/pedagogy.md), and a consolidated [review with results and open work](reviews/REVIEW.md).

The reviewed revision fixes writing-field shortcut interception in both lightweight examples. It adds native controls and live readouts. The synth also gains reset, mute, input ownership, and a scope that stops when idle, hidden, offscreen, or under reduced motion.

The teaching guidance now distinguishes expected probabilities from random samples, defines the meaningful observation, and asks for a causal explanation plus a transfer case. The pedagogy report contains worked temperature-sampling and idler-gear specs.

## Run the checks

The skill and standalone pages have no package runtime dependencies. Node.js is needed for Anatomy builders. Playwright is a development dependency for the browser checks.

```sh
npm ci
npm test
npm run test:browser
```

The browser suite uses an installed Google Chrome. Set `BROWSER_CHANNEL=chromium` to use a Playwright Chromium installation. Builds run in a temporary copy and leave the bundled source unchanged.

Model tests check the ripple solver and interference behavior. Build tests generate six Anatomy examples in both themes. Browser cases check input isolation, native control behavior, reset, held-note ownership, layout at 360px and desktop widths, both color schemes, and reduced motion. See the [review report](reviews/REVIEW.md) for the exact scope and remaining gaps.

## Know the limits

- Upstream Anatomy examples are rendering demonstrations. Their automatic tours must be disabled before lesson integration. The turning-dial geometry audit has known crowding findings.
- The AI English Shift adapter describes a particular host. Inspect its current source before relying on paths, registry shape, or language requirements.
- Passing model and browser checks does not establish learning effectiveness. These figures have not been evaluated with novice learners or a screen reader in this review.
- True 3D orbit coverage and physical accuracy require their own checks. A successful build is insufficient evidence.

## Sources and licenses

The rendering materials come from [Anatomy](https://github.com/wheresryan22/anatomy) and [iso-figure](https://github.com/MrBongoC/ai-iso-skill). Their pinned revisions and local adaptations are recorded in the [source manifest](references/source-manifest.json).

Both upstream contributions retain their MIT notices in [Anatomy's license](assets/anatomy/LICENSE) and [iso-figure's license](assets/iso-figure/LICENSE). Those licenses cover the corresponding contributions. No additional license is granted here for the original lesson material, app references, or screenshots.
