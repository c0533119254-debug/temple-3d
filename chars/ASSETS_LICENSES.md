# Asset licenses — Beit HaMikdash 3D (גרסה 105)

All third-party 3D assets bundled with this build are recorded here. Clothing
(ketonet, avnet sash, migbaat wrap), carried props, and the procedural
animation clips (Idle, Walk, WalkCarry, Reach, Carry, HandsUp, Bow) in the
tours were added in this project and are not part of the upstream packs.

## Character and rig — `src/chars/kohen.glb`

- **Model:** Quaternius, “Superhero Male” full-body base from the
  **Universal Base Characters** kit (August 2025), Regular-compatible
  humanoid proportions with a Humanoid / Unreal-style rig (pelvis, spine_01…,
  upperarm_l/r, finger bones). Average ~13k triangles. Game-ready topology.
- **Upstream pack:** [Universal Base Characters](https://quaternius.com/packs/universalbasecharacters.html)
  (free Standard zip via [itch.io](https://quaternius.itch.io/universal-base-characters)).
- **File used here:** a glTF 2.0 packing of `Superhero_Male_FullBody.gltf` +
  `.bin` from `Base Characters/Godot - UE/` in that Standard zip. Texture
  image entries were already removed in the CC0 vendor copy we used
  (the figure is tinted in the app: skin on face, hands and feet; linen on
  the garment).
- **Vendor copy / evidence:** the Standard-zip license file is kept beside
  the model as `src/chars/License_UBC_Standard.txt` (CC0 1.0, pack date
  2025-08-18). Courtesy also to the strch.ing CC0 vendor unpacking of the
  same mesh.
- **Modifications in this project:** packed as a single GLB; a vertex-color
  mask is painted at load time (R = exposed skin on head/hands/feet, G =
  covered body) so a long white ketonet can be shown without modern printed
  clothes. A long robe, a sash wound around the waist with hanging ends
  (avnet, not a ring), a wound head wrap (migbaat / mitznefet), the tzitz
  where relevant, and carried props are local geometry.
- **License:** [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/).
  No attribution is legally required. Courtesy credit: **Quaternius**
  (https://quaternius.com).
- **Note:** Quaternius later published a “Quaternius Asset License (QAL)
  v1.0” (2026-08-28) for some *future* releases. That license is not
  retroactive to this August 2025 Standard pack, whose pack page and the
  bundled `License_Standard.txt` mark it as CC0. CC0 cannot be withdrawn.

## Animations

The clips Idle, Walk, WalkCarry, Reach, Carry, HandsUp and Bow are
procedural (written for this project on the Universal Base Characters
rig). They are not taken from the Universal Animation Library. HandsUp
follows Mishnah Tamid 7:2 and Sotah 7:6 (“נשאו כפיהם”, hands raised);
the later synagogue custom of splitting the fingers into a shin is not
posed here, because it is not stated in those mishnayot.

## Not bundled (evaluated, left out)

- The earlier **Ultimate Animated Character Pack** human (`kohen_v104.glb`,
  CC0 Quaternius / UMRAM-Bilkent glTF) is kept only as a local rollback
  and is not shipped in the 105 zip. It was too blocky in close tour
  shots, and its “Working” clip read as a crouch.
- **Kenney “Blocky Characters” 2.0** (CC0): still too blocky for close-ups.
- **Papyszoo `animated_human.glb`**: static mesh, no skin or clips.
