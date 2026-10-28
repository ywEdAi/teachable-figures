# Sources, licenses and fusion decisions

The canonical entrypoint is `../SKILL.md`. This is one teaching skill with rendering modes, not three independently triggered skills.

## Provenance

| Source | Contribution | Bundled material |
|---|---|---|
| Existing project teachable-figures | Claim/anchor, misconception, predict → try → explain, reusable config, language frame, AI English Shift adapter | Reworked entrypoint; existing app/journey references and screenshots retained |
| [wheresryan22/anatomy](https://github.com/wheresryan22/anatomy) | Solid mechanical primitives, supports/joints/pipes, cutaways/explosion, adjustable camera, moving groups, true 3D and WebGL, geometric/browser checks | `assets/anatomy/kit`, eight example source directories, eight technical reference notes, local helper scripts and MIT license |
| [MrBongoC/ai-iso-skill](https://github.com/MrBongoC/ai-iso-skill), skill name `iso-figure` | Face-local SVG matrices, functional keys/switches/displays, one state/render flow, portable HTML | `references/simple-iso.md`, two example HTML files and MIT license |

Exact commits and retrieval date are recorded in [source-manifest.json](source-manifest.json). Operation uses the bundled relative assets and does not depend on a maintainer's local checkout.

Anatomy means crafted explanatory objects here, not an anatomical atlas or a medical visualization package.

## What changes in the fusion

- Interaction is the default for teaching requests. Static figures remain valid when specifically requested. Upstream Anatomy's requirement to write “interactive” does not apply here.
- The teaching loop and scenario remain primary. A machine metaphor must visibly model the rule and disclose its limits.
- No fixed minimum of forty parts. Detail scales with the concept and learner; optional close-ups can reveal more without crowding the first view.
- No prohibition on all labels or semantic colors. Keep the drawing readable, and use compact labels/legends when they improve understanding.
- No automatic idle tour before prediction. User-triggered demos and post-prediction tours may be useful.
- Simple box depth ordering is a limited heuristic. Dense assemblies and true 3D use actual geometric order and suitable audits.
- Framework-free single-file delivery applies to standalone artifacts. Existing apps use reusable config/components and their own lesson frame, theme and language contracts.
- Reduced motion preserves state changes and stepping; accessible controls and summaries accompany the stage.
- Publishing and gallery submissions are outside this skill's default task. Upstream publishing scripts/references were not bundled.

## License handling

Anatomy is MIT © 2026 Ryan; iso-figure is MIT © 2026 Tolga Cohce. Their complete license notices are at [anatomy/LICENSE](../assets/anatomy/LICENSE) and [iso-figure/LICENSE](../assets/iso-figure/LICENSE). Keep those notices with copied code or substantial adaptations, including a license comment in standalone HTML when source code is inlined.

These licenses cover the corresponding upstream contributions. They do not assert a new license for the user's original lesson material, app references or screenshots. No third-party trademarks, publishing rights or extra external actions are implied by this fusion.

## Resource layout

Generated Anatomy example HTML, upstream tests, stress scene, publishing helpers and repository metadata were omitted. Build example pages from their source in a work copy. Iso example CDN font links were removed for offline font fallback and their full MIT notices embedded. The bundled iso copies additionally use scoped shortcuts, native controls and live readouts; the synth adds reset, mute, input ownership and motion/visibility gating. Technical notes retain their upstream relative path conventions; paths such as `kit/` mean the root of the bundled Anatomy tree, and app/server conventions must be adapted to the host.

Examples demonstrate rendering techniques, not the fused lesson contract. In the upstream turning-dial example the long interaction hint can truncate at 360px; recompose it with wrapping host controls/captions when integrating, as the teaching workflow requires. Do not treat an unchanged example as a completed accessible, localized lesson.

Anatomy reference demos retain upstream automatic tours, including tours that resume after inactivity. Disable both startup and idle-resume touring before lesson integration. A learner's pause to think must not restart a demo. The four v0.1.0 turning-dial crowding findings are repaired in v0.2.0 by adjusting terminal and junction placement and adding real socket covers. Its full configured orbit audit passes without changing the kit, thresholds, or exclusions. A successful HTML build alone is still not an audit pass. See the repository review for the precise checks run.

Source updates should compare the pinned revisions, preserve licenses, verify the helper import closure and rerun representative standalone/3D builds before replacing bundled resources. Updating this skill does not automatically update an app's registry or lesson content.
