# Nyāya-sūtra explainer

Single-file animated explainer, published at https://brijs.github.io/learn-nyaya/ (Pages from `main` + `/docs`).

- `python3 gen_sutras.py` → `data/sutras.json` (44 curated sūtras: word glosses, builds, explanations), `data/roots.json` (dhātus verified against `data/dhatupatha.tsv`) and `data/corpus.json` (all 533) from `data/nyayasutra.gretil.json`. Edit glosses and builds here; mark roots in builds as `√token` and add the token to `ROOTS` with its dhātupāṭha code.
- `~/.cache/edge-tts-venv/bin/python tts.py` → `audio/` (narration `n_sXX`, sūtras `s_1_1_4`), cached by hash. Needs network.
- `python3 build.py` → `dist/learn-nyaya.html` and `docs/index.html` (inlines parts/*, data, base64 audio).
- `tests/walk.py` (Playwright, system Chrome; run with `~/.cache/kokoro/venv/bin/python`) exercises every scene and the quiz.
- Scenes live in `parts/scenes1-3.js`, shared engine in `parts/engine.js` (sorter, orderer, quiz, sūtra cards, sūtra browser). Scene DOM ids are prefixed `nNN-`.
- Every sūtra claim must trace to the corpus; glosses are paraphrases and say so on screen.
