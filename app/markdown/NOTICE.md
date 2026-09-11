# Third-Party Notices

Ugle (`ai.ugle.app`) is proprietary software (see LICENSE and [EULA](/eula)). It
bundles or downloads the third-party components below. Versions are pinned in
`scripts/prepare-sidecars.sh` / `scripts/prepare-sidecars.ps1`; this file must
be updated whenever those pins change.

## Bundled binaries (sidecars)

| Component | Version | License | Source | Distribution |
|---|---|---|---|---|
| whisper.cpp (`whisper-cli`) | v1.9.1 | MIT | https://github.com/ggml-org/whisper.cpp | built from source, bundled |
| llama.cpp (`llama-embedding`, `llama-server`) | b10151 | MIT | https://github.com/ggml-org/llama.cpp | built from source, bundled |
| sherpa-onnx (via `sherpa-rs` 0.6, diarization server) | 0.6.x | Apache-2.0 | https://github.com/k2-fsa/sherpa-onnx | linked into our binary, bundled |
| FFmpeg / FFprobe (macOS) | 7.x snapshot | **GPL-3.0** build | https://evermeet.cx/ffmpeg/ (sources: https://ffmpeg.org) | prebuilt, bundled |
| FFmpeg / FFprobe (Windows) | n7.1 (BtbN `win64-gpl`) | **GPL-3.0** build | https://github.com/BtbN/FFmpeg-Builds (sources: https://ffmpeg.org) | prebuilt, bundled |

### FFmpeg licensing note (known issue, tracked)

Both bundled FFmpeg builds are **GPL-configured** (they include GPL-only
components such as x264). They run as separate executables invoked by the app
(mere aggregation), and complete corresponding sources are available at the
links above and from ffmpeg.org. To simplify obligations, the plan of record
is to swap to **LGPL-configured** builds (no GPL-only components) for Windows
at the T-win distribution cut, and evaluate the same for macOS. Until then: no
distribution cut may add a GPL artifact that is not listed in this file.

### FFmpeg update path (security)

FFmpeg parses untrusted media files — it is the app's largest attack surface.
Version pins live in `scripts/prepare-sidecars.{sh,ps1}`;
`scripts/check-sidecar-versions.mjs` reports stale pins. Bump promptly on
upstream security releases; a NOTICE row update must accompany every bump.

## Model weights (bundled in the app, SHA256-pinned)

These ship **inside** the `.app` / MSI and are copied into the app data dir on first run —
they are not fetched from the network on a normal install. A download path survives only as a
fallback for a missing file. Bundling means we redistribute these weights, so their licences
below are distribution obligations, not merely references.

| Model | License | Source |
|---|---|---|
| Whisper large-v3-turbo (ggml q5_0) | MIT (OpenAI Whisper) | https://huggingface.co/ggerganov/whisper.cpp |
| BGE-M3 (gguf) | MIT (BAAI) | https://huggingface.co/lm-kit/bge-m3-gguf |
| Silero VAD v5.1.2 (ggml) | MIT | https://github.com/snakers4/silero-vad |
| pyannote segmentation-3.0 (onnx) | MIT | https://huggingface.co/pyannote/segmentation-3.0 (via k2-fsa/sherpa-onnx releases) |
| 3D-Speaker ERes2Net base (onnx) | Apache-2.0 | https://github.com/modelscope/3D-Speaker (via k2-fsa/sherpa-onnx releases) |

## Library dependencies

- **Rust crates**: licenses are enforced by `cargo deny check licenses`
  (`deny.toml`), which checks the two shipping targets with dev-dependencies
  excluded. Ugle is proprietary, so GPL/AGPL/LGPL are absent from the
  allowlist by design — no strong-copyleft crate may enter the shipped binary.
  The full dependency graph and licenses are available via `cargo license` or
  crates.io metadata for the pinned `Cargo.lock`.
- **MPL-2.0 crates in the shipped binary**: `cssparser`, `cssparser-macros`,
  `dtoa-short`, `option-ext`, `selectors` (pulled in via Tauri's webview
  stack). MPL-2.0 is file-level copyleft: we use them unmodified, so no source
  obligation attaches to our code. Source for each is available from
  https://crates.io. **If any of these crates is ever patched, the modified
  files must be published** — that is the whole obligation, and it is why they
  are listed by name here.
- **Frontend (npm)**: React, Vite, Tailwind and the rest of
  `crates/app_tauri/package.json` are MIT/ISC/BSD-family; the exact set is
  recorded in `pnpm-lock.yaml`.

## Test fixtures

`test-fixtures/asr_eval/` bundles two LibriVox Public-Domain recordings and
one self-recorded clip — provenance and hashes in that directory's README.
