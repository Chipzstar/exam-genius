# Exam Genius

Exam Genius helps UK students practise A-level and AS-level exams by subject and exam board. This glossary keeps product and domain language consistent across the monorepo.

## Language

**Exam board**:
The awarding organisation for a qualification (e.g. AQA, OCR, Edexcel, WJEC).
_Avoid_: Provider, syllabus brand (unless Eduqas is explicitly in scope).

**WJEC (Wales)**:
WJEC qualifications delivered for Wales (`wjec` in code). Distinct from Eduqas-branded specifications used in England. v1 uses English-medium entry codes only (`*U*`, not `*N*` Welsh-medium).
_Avoid_: Treating WJEC and Eduqas as one board in catalog or checkout; duplicating units for Welsh-medium in the initial catalog.

**Eduqas**:
England-facing brand under the WJEC group; not part of the initial `wjec` rollout.
_Avoid_: `wjec` as a catch-all for both Wales WJEC and Eduqas.

**Unit**:
WJEC's name for an assessed component (what other boards often call a paper). Catalog and route slugs use `unit-1` … `unit-4` (AS catalog: 1–2; A-level catalog: 3–4).
_Avoid_: Descriptive slug variants per subject; calling WJEC components "Paper 1" in user-facing copy when the spec title is "Unit 1".

**Practical unit (Unit 5)**:
WJEC A-level science component assessed as a live practical examination (`1400U5`, `1410U5`, `1420U5`), not a written past paper.
_Avoid_: Listing Unit 5 in the Exam Genius paper catalog or generating mock papers for it.

**Course**:
A purchased entitlement for one subject + exam board + exam level (e.g. WJEC AS Biology).
_Avoid_: Confusing with a WJEC "qualification cash-in" entry code.

**Unit entry code**:
Stable WJEC component identifier used in the paper catalog `code` field (e.g. `2300U1`, `1400U3`).
_Avoid_: Session paper codes with series suffixes (e.g. `2300U10-1`) as the canonical catalog `code`.

**Exam level**:
Either `as_level` or `a_level`; determines which catalog slice and prompts apply.
_Avoid_: "AS" / "A2" as stored enum values (use `as_level` / `a_level`; A2 content lives under `a_level`).

## Relationships

- A **Course** belongs to exactly one **Exam board**, one subject, and one **Exam level**.
- At **AS level**, WJEC courses expose AS **Units** only (typically Units 1–2).
- At **A level**, WJEC courses expose A2 **Units** only (typically Units 3–4 for written exams), matching how other boards split AS vs A-level inventory.
- **Practical unit (Unit 5)** is out of scope for biology, chemistry, and physics catalogs (written mocks only).
- Initial **WJEC** rollout covers the same six subjects as other boards: maths, biology, chemistry, physics, economics, psychology.
- **Options** within a single WJEC written unit (e.g. Biology Unit 4) are not split into separate catalog papers; one unit → one mock paper.
- Each catalog unit maps to one generatable mock; the unit slug is `unit-N`, the paper route segment is `paper-1` (not duplicated `unit-N/unit-N`).

## Example dialogue

> **Dev:** "We're adding WJEC — do we bundle Eduqas specs too?"
> **Domain expert:** "No. Ship `wjec` as Wales-only first; `eduqas` is a separate board later."

## Flagged ambiguities

- Perplexity listed four AS maths units; the current WJEC spec has **two** AS units (2300U1, 2300U2) and **two** A2 units (1300U3, 1300U4). Resolved: follow the official unitised spec, not the draft list.
