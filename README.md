<p align="center">
  <img src="assets/readme/hero.svg" width="100%" alt="Teachable figures. An agent skill for interactive learning through predict, try, and explain.">
</p>

# Teachable figures

Turn a lesson's claim into an experiment a learner can operate. Predict a result, change a cause, read the effect, and explain a new case.

This is an **agent skill**, with rendering examples and verification tools. It works with a host application's lesson schema or a standalone HTML figure.

## Explore six complete examples

![Actual screenshots of a cone section, a schematic chest, a rocket launch, Transformer data flow, a Ming robe, and a gear-ratio experiment](assets/readme/examples.png)

Open [the example directory](examples/index.html) locally, or choose a lesson below. Every page runs offline with native controls, reset, an explanation, and a transfer question.

| Example | What the learner can inspect |
| --- | --- |
| [Cone sections in 3D](examples/geometry-slices.html) | Rotate a cut cone. Compare linear radius growth with quadratic area growth. |
| [Human chest in 3D](examples/human-anatomy.html) | Open a schematic torso and inspect lungs, heart, and diaphragm from different viewpoints. |
| [Rocket launch](examples/rocket-launch.html) | Change thrust and payload. Compare pad support, delayed liftoff, burnout, and coasting. |
| [Transformer data flow](examples/transformer-flow.html) | Trace toy vectors through Q/K/V, masking, attention, residual normalization, and FFN stages. |
| [A Ming robe](examples/chinese-clothing.html) | Inspect overlapping fronts and the pleated construction of a specifically sourced museum garment. |
| [Gear ratios](examples/gear-ratio.html) | Add an idler and distinguish output-turn magnitude from rotation direction. |

The two spatial examples rotate world-coordinate geometry with depth ordering. The chest is an educational schematic. The rocket is a one-dimensional ideal model, the Transformer uses disclosed toy parameters, and the clothing drawing distinguishes documented facts from reconstruction.

<details>
<summary>See the original gear-ratio teaching loop</summary>

The [gear-ratio lesson](examples/gear-ratio.html) asks whether an extra idler gear makes the output slower. One input turn produces half an output turn with a 12-tooth driver and 24-tooth output. The idler changes direction while preserving that magnitude.

![Gear-ratio experiment after both trials. Both outputs make half a turn; the idler changes direction. Native controls and turn counters make the result inspectable.](assets/readme/gear-ratio.png)

Open the HTML file locally. It runs without a server, framework, or remote assets. The gears are a schematic of an ideal model, not a physical tooth-contact simulation.

</details>

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

The [v0.2.0 iteration report](reviews/v0.2.0.md) records the geometry fix, five new examples, independent review, and current checks. The historical October 27 review includes independent [UI/UX feedback](reviews/uiux.md) and [pedagogical feedback](reviews/pedagogy.md).

The reviewed revision fixes writing-field shortcut interception in both lightweight examples. It adds native controls and live readouts. The synth also gains reset, mute, input ownership, and a scope that stops when idle, hidden, offscreen, or under reduced motion.

The teaching guidance now distinguishes expected probabilities from random samples, defines the meaningful observation, and asks for a causal explanation plus a transfer case. The pedagogy report contains worked temperature-sampling and idler-gear specs.

The four turning-dial crowding defects are repaired through actual socket and terminal geometry. The full configured 3D audit passes with every failure category at zero. Audit thresholds, exclusions, and the rendering engine remain unchanged. [Read the raw full-audit output](reviews/turning-dial-full-audit-v0.2.0.txt).

## Run the checks

The skill and standalone pages have no package runtime dependencies. Node.js is needed for Anatomy builders. Playwright is a development dependency for the browser checks.

```sh
npm ci
npm test
npm run test:browser
```

All 16 model/build checks and 19 browser cases pass. To run the slower full turning-dial geometry audit in a temporary copy:

```sh
npm run audit:3d
```

The browser suite uses an installed Google Chrome. Set `BROWSER_CHANNEL=chromium` to use a Playwright Chromium installation. Builds run in a temporary copy and leave the bundled source unchanged.

Model tests check the ripple solver and interference behavior. Build tests generate six Anatomy examples in both themes. Browser cases check input isolation, native controls, reset, held-note ownership, the five new lessons, layout at 360px and desktop widths, both color schemes, and reduced motion. See the [current review](reviews/v0.2.0.md) for the exact scope and remaining gaps.

## Know the limits

- Upstream Anatomy examples are rendering demonstrations. Their automatic tours must be disabled before lesson integration. The six complete lessons do not autoplay.
- The AI English Shift adapter describes a particular host. Inspect its current source before relying on paths, registry shape, or language requirements.
- Passing model and browser checks does not establish learning effectiveness. These figures have not been evaluated with novice learners or a screen reader in this review.
- The full mechanical audit covers the configured turning-dial fixture. The custom cone and chest meshes have their own checks and selected-view inspection, not an exhaustive mesh-intersection proof. A successful build is insufficient evidence of physical accuracy.

## Sources and licenses

The rendering materials come from [Anatomy](https://github.com/wheresryan22/anatomy) and [iso-figure](https://github.com/MrBongoC/ai-iso-skill). Their pinned revisions and local adaptations are recorded in the [source manifest](references/source-manifest.json).

Both upstream contributions retain their MIT notices in [Anatomy's license](assets/anatomy/LICENSE) and [iso-figure's license](assets/iso-figure/LICENSE). Those licenses cover the corresponding contributions. No additional license is granted here for the original lesson material, app references, or screenshots.
