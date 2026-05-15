# LLM / OpenAI prompts registry

This file is the **canonical inventory** of model prompts used in **Exam Genius**. It records what each prompt is for, where it lives in code, and how outputs are consumed. When you add or substantially change a production prompt, **extend this document** so reviewers and future work can see the full picture without spelunking the repo.

**How to extend:** add a new `###` subsection under the right repo, with: purpose, source path(s), model / env overrides, prompt text (or template), and output shape if applicable.

---

## exam-genius-backend (`exam-genius-backend`)

Runtime client: `src/app/utils/gpt.ts` (`OpenAI`). Calls use `openai.chat.completions.create` or `.parse` unless noted.

### Paper generation (structured JSON exam)

| | |
| --- | --- |
| **Purpose** | Generate a new A-level practice paper as structured JSON (questions with nested blocks: text, math, table, image placeholder). |
| **Code** | `src/app/modules/paper/paper.controller.ts` → `src/app/prompts/paper-generate.ts` |
| **Version constant** | `PAPER_GENERATE_PROMPT_VERSION` → `paper_generate_v1` |
| **Model** | `OPENAI_PAPER_MODEL` (default `gpt-5-mini`) |
| **Response** | `json_object`; validated with `paperGenerationResultSchema` |

**System prompt** (`buildPaperGenerateSystemPrompt(subject)`):

```text
You are an expert assessment author for UK A-level ${subject}. You output a single JSON object with keys "paper_meta" (optional object with time_allowed_minutes, total_marks, preamble_html string) and "questions" (array). Each question has: client_id (string), parent_client_id (string or null for top-level), order (number), label (string or null), marks (number), topic (string or null), body (array of blocks). Each block is one of: {"kind":"text","value":"<p>HTML fragment</p>"}, {"kind":"math","value":"latex or plain math"}, {"kind":"table","headers":["h1"],"rows":[["c1"]]}, {"kind":"image_placeholder","caption":"..."}. Use parent_client_id to nest subparts (e.g. part (a) under question 1). Order siblings with "order". Do not include mark schemes in the JSON.
```

**User prompt** (`buildPaperGenerateUserPrompt`): instructs generation for `exam_board`, `subject`, `course`, `paper_name`, target question count and total marks; optional appended sections for reference excerpts (up to 120k chars), student 'liked' exemplars (up to 20k), and 'avoid' feedback (up to 8k). Ends with: return only JSON per system schema (no markdown fences). On retry after invalid JSON, an extra line asks for one valid JSON object.

---

### Legacy HTML paper → structured parse

| | |
| --- | --- |
| **Purpose** | Convert existing exam paper HTML into the same structured JSON shape as generation (for papers predating structured storage). |
| **Code** | `src/app/modules/paper/paper.controller.ts` → `src/app/prompts/parse-legacy.ts` |
| **Version constant** | `PARSE_LEGACY_PROMPT_VERSION` → `parse_legacy_v2` |
| **Model** | `OPENAI_PARSE_MODEL` (default `gpt-4o-mini`) |
| **Response** | Zod `zodResponseFormat(legacyPaperParseStructuredSchema, 'legacy_paper_parse')` via `chat.completions.parse` |

**System prompt** (`buildParseLegacySystemPrompt`):

```text
Convert exam paper HTML into structured data. Follow the JSON schema exactly: root has "paper_meta" (object or null) and "questions" (array). Each question MUST use string IDs: "client_id" and "parent_client_id" are JSON strings (e.g. "q1", "q1a"), never bare numbers — so they can be used as stable keys. Use parent_client_id null for top-level questions. Include order (number), label (string or null), marks (number), topic (string or null), and body (array of blocks). Every block must include kind, value, headers, rows, and caption keys. For text and math blocks, set value to a string and set headers, rows, and caption to null. For table blocks, set headers and rows to string arrays and set value and caption to null. For image_placeholder blocks, set caption to a string and set value, headers, and rows to null. Infer marks from phrases like [3 marks] when present, otherwise use 1. Preserve mathematical meaning. If paper_meta is unknown, set it to null. For paper_meta fields you do not infer, use null (not omission).
```

**User message:** first 100k characters of `paper.content`.

---

### Mark scheme generation

| | |
| --- | --- |
| **Purpose** | From stored questions JSON, produce per-question model answers and mark-point breakdowns. |
| **Code** | `src/app/modules/paper/mark-scheme.service.ts` → `src/app/prompts/mark-scheme.ts` |
| **Version constant** | `MARK_SCHEME_PROMPT_VERSION` → `mark_scheme_v1` |
| **Model** | `OPENAI_MARK_SCHEME_MODEL`, else `OPENAI_PAPER_MODEL`, default `gpt-5-mini` |
| **Response** | `json_object`; validated with `markSchemeResultSchema` |

**System prompt** (`buildMarkSchemeSystemPrompt`):

```text
You are an examiner. Given exam questions as JSON, produce a mark scheme as JSON only. Output shape: { "items": [ { "question_id": "<id>", "model_answer": "<HTML string>", "points": [ { "description": string, "marks": number } ] } ] }. Sum of points[].marks per item must equal the question marks. question_id must match exactly.
```

**User message:** `JSON.stringify({ questions: payload })` where each question includes `question_id`, `label`, `marks`, `body`.

---

### Attempt marking (student answers)

| | |
| --- | --- |
| **Purpose** | Score each student answer against max marks using mark scheme + question text; optional grade band and summary. |
| **Code** | `src/app/modules/answer/marking.service.ts` → `src/app/prompts/ai-marking.ts` |
| **Version constant** | `AI_MARKING_PROMPT_VERSION` / `MARKING_PROMPT_VERSION` → `ai_marking_v1` |
| **Model** | `OPENAI_MARKING_MODEL` (default `gpt-5-mini`) |
| **Response** | `json_object`; parsed with Zod in `parseMarkingResult` |

**System prompt** (`buildAiMarkingSystemPrompt`):

```text
You are an A-level examiner. Mark each student answer against the max marks. Return JSON: { questions: [{ question_id, score, examiner_note }], grade_band, summary }. Scores must be integers 0..max for that question.
```

**User message:** JSON payload (truncated to 120k chars) with `mark_scheme`, `questions` (ids, marks, prompt/body), and `answers` (question_id, student_answer, max_score).

---

## exam-genius monorepo — dashboard app (`apps/dashboard-app`)

### Legacy predicted past paper (HTML via Chat Completions API)

| | |
| --- | --- |
| **Purpose** | Older flow: generate a sample past paper as HTML from subject/board/course parameters (still exposed at `POST` `src/app/api/openai/generate/route.ts`). |
| **Code** | `apps/dashboard-app/src/app/api/openai/generate/route.ts` |
| **Model** | Hard-coded `gpt-3.5-turbo` |
| **Client** | `apps/dashboard-app/src/server/openai.ts` (`OpenAIApi` v3-style) |

**System message** (template; `subject` interpolated):

```text
You are a GPT model trained on previous A-level ${subject} past papers
```

**User message** (template; interpolates `exam_board`, `subject`, `course`, `paper_name`, `num_questions`, `num_marks`):

```text
Please generate a new sample past paper for the upcoming A-level ${exam_board} ${subject} ${course} ${paper_name} exam in JuneThe questions generated should be based on A-level ${exam_board} ${subject} ${course} past paper questions from the years 2018 to 2022.The past paper should have ${num_questions} questions. The total mark for this paper is ${num_marks}. Display the time allowed and totals marks for the paper at the beginning with a hr rule to separate it from the questions. Questions should all be relevant to the ${exam_board} ${subject} ${course} specification. For each question, display the number of marks at the end and format the question using HTML markup. Any question that includes '<' or '>' should be formatted as {'<'} or {'>'}. For example, "... example question block ..." should be formatted as follows: "<ol type='1'>...</ol>"
```

*(The route’s source string includes a long worked example of HTML formatting; see the file for the exact example block.)*

---

### Question body edit (AI SDK)

| | |
| --- | --- |
| **Purpose** | Apply a natural-language or preset edit to a question’s block JSON while preserving schema; optionally preserve or update marks. |
| **Code** | `apps/dashboard-app/src/server/question-edit-logic.ts` (`buildQuestionEditPrompt`) |
| **Version constant** | `QUESTION_EDIT_PROMPT_VERSION` → `question_edit_v1` |
| **Call sites** | `apps/dashboard-app/src/server/api/routers/question.ts` (`generateText`); `apps/dashboard-app/src/app/api/question/edit/route.ts` (`streamText`) |
| **Model** | `OPENAI_QUESTION_EDIT_MODEL` (default `gpt-4o-mini`) |
| **Response** | Model text stripped of ` ```json ` fences; parsed as `editOutputSchema` (`body` block array, optional `marks`) |
| **Observability** | `logAiStructured('question_edit', …)` via `apps/dashboard-app/src/server/ai-structured-log.ts` (Axiom when `AXIOM_TOKEN` + `AXIOM_DATASET` set); fields include `channel` (`trpc` \| `stream`), `ok`, `duration_ms`, `question_id`, `paper_id`, `model`, `prompt_version`. |
**Prompt** (single string; no separate system message): built as:

```text
${presetLine}${marksLine} Student request: ${userPrompt}

Current question body (JSON blocks): ${JSON.stringify(q.body)}

Return ONLY valid JSON: {"body":[...blocks...],"marks": optional number}. Blocks use kind: text|math|table|image_placeholder|figure with the same shape as input.
```

Where `presetLine` is `Preset: ${preset}. ` when a preset is set; `marksLine` is either `Keep total marks at ${q.marks}.` or `You may adjust marks; return "marks" in JSON.`

---

## Related routing / integration notes

- Dashboard tRPC `paper` router can call the backend `POST` `/api/openai/generate`-style flow against the deployed API base URL (`paper.ts`); primary **structured** generation runs on the **backend** `generatePaper` handler, not this legacy route.
- Middleware allows `/api/openai(.*)` for the legacy generate endpoint.

---

## Changelog (manual)

| Date | Change |
| --- | --- |
| 2026-04-28 | Question edit: `QUESTION_EDIT_PROMPT_VERSION` (`question_edit_v1`), dashboard `logAiStructured('question_edit')` for stream + tRPC paths. |
| *(add rows here when prompts change)* | |
