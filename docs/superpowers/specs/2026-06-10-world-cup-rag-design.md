# World Cup RAG MVP Design

## Status

Approved for design documentation on 2026-06-10.

No implementation code should be written until this spec is reviewed and explicitly approved.

## Product Goal

Build a single-server-first World Cup RAG application for ordinary football fans. The MVP should let a fan ask World Cup questions in Chinese, browse core World Cup information, see source links and data freshness, and use a lightweight fan identity without a full login system.

## Target User

The primary MVP user is an ordinary football fan.

The experience should prioritize:

- Fast, understandable answers.
- Clear source links.
- Simple Chinese-language UI.
- Easy browsing of teams, matches, players, people, venues, and historical World Cup material.
- Honest freshness boundaries for 2026 content.

## MVP Content Scope

The MVP covers:

- World Cup history.
- 2026 World Cup basic information.
- Already-played schedule records.
- Stable public reference material and user-provided owned material.

The MVP does not promise:

- Real-time scores.
- Breaking news.
- Injury updates.
- Last-minute lineups.
- Live tactical commentary.

Every user-facing data page should show the relevant last update time.

## Copyright And Source Policy

The MVP uses a conservative summary-first policy:

- Answers summarize source material in Chinese.
- Answers include source titles and links.
- The product does not display large verbatim passages from source material.
- When the knowledge base lacks reliable material, the answer should say so instead of inventing.
- Source metadata should include URL, title, source type, language, crawl or import time, and update time where available.

## Freshness Policy

The MVP uses daily scheduled updates.

Daily update jobs may fetch stable public material and process user-provided data. Job status, last successful update time, and errors should be visible in the management page.

The architecture should allow a future move from daily updates to more frequent updates, but the MVP should not include real-time infrastructure.

## Repository And Deployment Strategy

Use a monorepo:

```text
world_cup/
  apps/
    backend-java/
    rag-python/
    web-react/
    web-vue/
  packages/
    api-contracts/
  infra/
    docker-compose.yml
    postgres/
    nginx/
  docs/
    superpowers/
```

Only `web-react` is implemented for the MVP. `web-vue` is reserved for a later functionally equivalent Vue 3 frontend that uses the same API contract.

Deployment must be single-machine-first with Docker Compose. The MVP should avoid Kubernetes, Kafka, Milvus, Elasticsearch, and other heavyweight infrastructure.

## Technology Choices

- Java business backend: Spring Boot 3 with Java 21.
- Python RAG, data processing, and evaluation service: FastAPI with Python 3.12.
- Frontend: React, TypeScript, and Vite first.
- Future frontend: Vue 3, TypeScript, and Vite as a second implementation.
- Database and vector search: PostgreSQL with pgvector.
- LLM and embedding: external API providers behind provider abstractions.
- Future optional service: Go gateway or realtime push service, only after a real need appears.

## Runtime Architecture

```text
Browser
  -> React frontend
  -> Spring Boot API
      -> PostgreSQL + pgvector
      -> FastAPI RAG service
            -> External LLM API
            -> External embedding API
            -> PostgreSQL + pgvector
```

The frontend calls the Java API by default. The Java service owns fan identity, sessions, chat persistence, browsing APIs, and management APIs. The Python service owns ingestion, chunking, embedding, retrieval, answer generation, and RAG evaluation.

PostgreSQL with pgvector is the only core state layer in the MVP.

## Core Data Model

### Anonymous Fan Identity

`fan_user`

- `uid`
- `nickname`
- `avatar_player_id`
- `created_at`
- `last_seen_at`

The app has no password login. On first open, a user creates a lightweight fan identity with uid, nickname, and a selected star player avatar. The backend stores this anonymous user record. MVP account recovery is limited to the user knowing the uid.

### World Cup Domain Data

`tournament`

- year
- host
- stage metadata
- description

`team`

- name
- region or country
- aliases
- crest metadata if available
- description

`player`

- name
- team or national side
- avatar metadata
- description
- star avatar candidate flag

`match`

- tournament year
- stage
- home or team A
- away or team B
- scheduled time
- venue
- played status
- score fields when present in source material

`venue`

- name
- city
- capacity when available
- description

### RAG Data

`source_document`

- title
- URL
- source type
- language
- license or rights note where known
- crawled or imported time
- updated time

`document_chunk`

- source document id
- chunk summary or normalized text
- entity tags
- time range tags
- source reference metadata

`document_embedding`

- chunk id
- vector
- embedding model
- created time

### Chat And Feedback Data

`chat_session`

- uid
- title
- created time

`chat_message`

- session id
- role
- content
- citations
- latency in milliseconds

`answer_feedback`

- message id
- helpful flag
- reason

### Ingestion And Evaluation Data

`ingest_job`

- status
- start time
- end time
- source count
- chunk count
- error summary

`rag_eval_case`

- question
- expected answer points
- expected citation hints
- category

`rag_eval_run`

- retrieval score
- citation coverage
- answer score
- latency

Evaluation is an engineering test or CLI capability in the MVP, not a user-facing page.

## RAG Answer Flow

```text
React chat page
 -> Java /api/chat
 -> Java saves the user message
 -> Java calls FastAPI /rag/answer
 -> FastAPI normalizes the Chinese question
 -> FastAPI performs vector retrieval with metadata filtering
 -> FastAPI optionally performs lightweight reranking
 -> FastAPI generates a Chinese answer
 -> FastAPI returns answer, citations, related entities, and update time
 -> Java saves the assistant message
 -> React displays the answer, source links, freshness, and related browsing entries
```

Answer rules:

- Prefer concise fan-friendly Chinese.
- Include source links for factual claims.
- Include data freshness.
- Avoid unsupported claims.
- If reliable context is missing, say the knowledge base does not contain enough reliable information.

## Daily Ingestion Flow

```text
Scheduler
 -> FastAPI ingestion pipeline
 -> Fetch stable public sources and read user-provided material
 -> Clean and normalize records
 -> Extract or associate entities
 -> Chunk documents
 -> Create embeddings
 -> Upsert PostgreSQL records and pgvector embeddings
 -> Write ingest_job status
 -> Java management API reads status for the frontend
```

The scheduler may be inside the Python service or a lightweight Compose service. It should not require Airflow, Kafka, Kubernetes, or other heavy components.

## UI Pages

### Fan Home

First open:

- uid input.
- nickname input.
- star player avatar selection.

Returning fan:

- welcome message.
- ask a World Cup question entry.
- browse entry.
- popular question prompts.
- last update time.

Review criteria:

- All inputs have visible labels.
- Avatar touch targets are at least 44 px.
- Mobile layout does not crowd controls.
- The update time is visible without dominating the page.

### Chat Page

The chat page provides:

- World Cup question input.
- Example prompts.
- Answer cards.
- Source links.
- Data freshness.
- Related team, match, player, or venue links.

Review criteria:

- Citations are clickable.
- No-source answers are clearly marked.
- Loading and error states are clear.
- Long answers remain readable on mobile.
- The input area does not hide conversation content.

### Browse Page

The browse page provides sections for:

- Teams.
- Matches.
- Players and people.
- Venues.

It should support search and simple filters. Details should include core facts, related matches, source freshness, and a way to ask a follow-up question.

Review criteria:

- Lists are scannable.
- Match rows make stage, teams, time, and status easy to compare.
- State is not conveyed by color alone.
- Mobile and desktop layouts use stable spacing and avoid horizontal scrolling.

### My Records

The records page provides:

- uid.
- nickname.
- avatar.
- question history.
- answer feedback history where useful.
- continue-chat action.

Review criteria:

- History is ordered clearly.
- Empty state includes a useful action.
- Copy does not imply this is a secure account system.

### Management Page

The management page is protected by an environment secret or Basic Auth. It provides:

- data source status.
- last successful update time.
- latest ingest jobs.
- trigger reindex action.
- error summary.

Review criteria:

- Rebuild actions require confirmation.
- Running jobs show progress or clear status.
- Errors are readable.
- Secrets are not exposed.

## Global UI And UX Standards

Use ui-ux-pro-max review for every implemented page.

Global standards:

- Chinese-first interface.
- Sports content product feel rather than a marketing landing page.
- Directly usable first screen.
- WCAG AA contrast for normal text.
- Visible keyboard focus states.
- 44 px minimum touch targets for important controls.
- Icons from a consistent SVG icon library such as Lucide.
- No emoji as functional icons.
- Stable responsive layouts with no unintended horizontal scroll.
- Loading states that reserve space to reduce layout shift.
- Clear data freshness and source visibility on content pages.
- A restrained palette using field green, deep ink, white, and limited gold accents without becoming a single-color theme.

## Implementation Phases

### Phase 1: Engineering Skeleton And Contracts

Create the monorepo structure, Git repository, README, Docker Compose, PostgreSQL with pgvector, Spring Boot service, FastAPI service, React Vite app, and API contract conventions.

Verification:

- health checks pass.
- containers start locally.
- API contract smoke test passes.

### Phase 2: Anonymous Fan Identity

Implement `fan_user`, avatar candidates, first-open identity setup, and returning fan state.

Verification:

- Java service and controller tests.
- React form and local state tests.
- homepage UI/UX review.

### Phase 3: Domain Browsing Data

Implement seed data, browsing APIs, search, filters, list pages, and detail views for teams, matches, players, and venues.

Verification:

- repository, service, and API tests.
- frontend list, detail, and search tests.
- browse page UI/UX review.

### Phase 4: RAG Documents And Chat

Implement ingestion, chunking, embedding provider abstraction, pgvector retrieval, answer endpoint, Java chat persistence and forwarding, and React chat UI.

Verification:

- chunking tests.
- citation tests.
- retrieval filter tests.
- no-source answer tests.
- Java forwarding and persistence tests.
- frontend loading, error, citation, and related-entity tests.
- chat page UI/UX review.

### Phase 5: Daily Updates And Management

Implement scheduled ingestion jobs, job status tracking, protected management APIs, and management UI.

Verification:

- job state transition tests.
- failure recording tests.
- management protection tests.
- rebuild confirmation tests.
- management page UI/UX review.

### Phase 6: My Records And Feedback

Implement chat history, feedback, uid isolation, and the records page.

Verification:

- history query tests.
- uid isolation tests.
- feedback persistence tests.
- empty state tests.
- records page UI/UX review.

### Phase 7: RAG Evaluation And Release Hardening

Implement RAG evaluation test cases, evaluation runner, Compose production profile, backup notes, and GitHub handoff preparation.

Verification:

- evaluation command passes.
- end-to-end smoke test passes.
- Docker Compose one-command startup works.
- README instructions are verified.

## Engineering Workflow

Implementation should follow TDD:

- write a failing test.
- run the test and confirm it fails for the expected reason.
- implement the smallest useful behavior.
- run tests and verification.
- commit focused changes.

Every UI page must pass a ui-ux-pro-max sports content product experience review before that page is considered complete.

React is implemented first. Vue is implemented later from the same API contract after the React MVP stabilizes.

## Open Confirmed Boundaries

- MVP uses one GitHub repository.
- MVP deploys on one small server.
- MVP uses Docker Compose.
- MVP does not use Kubernetes, Kafka, Milvus, or Elasticsearch.
- MVP uses external LLM and embedding APIs.
- MVP stores anonymous fan records in the backend database.
- MVP does not include full login, password accounts, email, phone verification, or social login.
