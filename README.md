# Nyāya-sūtra, methodically

[![Live explainer](https://img.shields.io/badge/live-explainer-b5481e)](https://brijs.github.io/learn-nyaya/)

An animated, narrated, interactive walk through Gautama's **Nyāya-sūtra**, adhyāya by adhyāya, with a **logic lab** and a **debate arena (Sabhā)**.

**Live explainer: https://brijs.github.io/learn-nyaya/** (the link works once GitHub Pages is enabled for this repo)

## What it covers (17 scenes)

| Part | Scenes |
|---|---|
| Orientation | map of the 10 āhnikas; the chain from false cognition to release (1.1.1-2); the 16 padārthas |
| Knowing | 4 pramāṇas; 3 kinds of anumāna; the 12 prameyas |
| Logic lab | stages of an inquiry; the five-limbed argument; vyāpti as containment (with Dignāga's three marks); the five hetvābhāsas |
| Sabhā (debate) | vāda, jalpa, vitaṇḍā; chala; the pramāṇas on trial (adhyāya 2); jāti and nigrahasthāna |
| The middle books | the self, the mind, and the way out (adhyāyas 3 and 4, incl. the thorn fence of 4.2.50) |
| Beyond | Navya-Nyāya orientation, comparison with Aristotle, abhāva; a free-play inference workbench; final quiz and cheat sheet |

44 key sūtras are decoded word by word with Devanagari, IAST and audio. A built-in browser lets you read and search all 533 sūtras of the edition used.

## Rebuild

```bash
python3 gen_sutras.py                                  # data/sutras.json + data/corpus.json
~/.cache/edge-tts-venv/bin/python tts.py               # Microsoft neural voices via edge-tts (pip install edge-tts); cached by hash
python3 build.py                                       # dist/learn-nyaya.html and docs/index.html
~/.cache/kokoro/venv/bin/python tests/walk.py          # Playwright walkthrough (uses system Chrome)
```

Narration: `en-IN-PrabhatNeural`. Sūtras: `hi-IN-MadhurNeural` reading the Devanagari, so Sanskrit sounds (ṛ, ś, ṣ, vowel length) are approximate. The on-screen text is the authority.

## Sources and caveats

- Sūtra text: [GRETIL](http://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/html/sa_gautama-nyAyasUtra.htm), "Gautama: Nyāyasūtra" (Sansknet input, **not proof-read**; word boundaries are ours where marked). Licence of that text: CC BY-NC-SA 4.0. `data/nyayasutra.gretil.*` carry it.
- Word glosses and paraphrases are ours; verify against a critical edition or translation. Vātsyāyana's examples for the three kinds of inference and for chala are the standard textbook illustrations; the sūtras themselves give only definitions.
- Dates are scholarly estimates: [Wikipedia, Nyaya Sutras](https://en.wikipedia.org/wiki/Nyaya_Sutras); [IEP, Nyāya](https://iep.utm.edu/nyaya/). Sūtra count: 533 in this edition (Wikipedia gives 528).
- Objection/reply roles in adhyāyas 2 and 3 follow the traditional commentary (Vātsyāyana's reading); the GRETIL markup labels some of them differently.
- Hetvābhāsa: the sūtra's five (1.2.4) differ from the later textbook five; the app shows both and notes that the pairing is debated.
- Navya-Nyāya: Ingalls (*Materials for the Study of Navya-Nyāya Logic*) and Matilal (*The Navya-Nyāya Doctrine of Negation*) are the starting points; the comparison with Western logic is orientation, not equivalence.
- Vyāpti, tarka, vāda/jalpa/vitaṇḍā definitions follow the sūtras; the world used in the logic lab is a toy.
- Dignāga's three marks (trairūpya) are attributed to the Buddhist logician Dignāga (c. 5th to 6th century CE).

Companion explainers by the same author: [Aṣṭādhyāyī Explorer](https://brijs.github.io/ashtadhyayi-explorer/), [Panchang with Chandra](https://brijs.github.io/learn-panchang/), [Why Shastras in the Age of AI](https://brijs.github.io/shastra-ai-explainer/).
