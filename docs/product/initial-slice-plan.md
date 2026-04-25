# find-remote-for-me: Initial Slice Plan

## 1. Problem Statement

### Problem framing narrative

**I am:** A Luxembourg-based senior frontend/full-stack engineer with 10+ years of experience in React, Next.js, TypeScript, Node.js, frontend architecture, performance, testing, developer experience, and product-minded delivery.

- I search across Europe-friendly and select US remote roles.
- I care about legal compatibility, timezone fit, and role seniority.
- I want to spend time applying, not screening junk.

**Trying to:**

- Find senior remote jobs that are plausibly compatible with Luxembourg/CET, my seniority, and my target stack.

**But:**

- I have to manually check too many job sources every day.
- Many remote jobs are not actually compatible with someone based in Luxembourg.
- US remote listings often hide residency, payroll, benefits, or work authorization restrictions in the body text.
- Job sources vary in structure, so the same screening work gets repeated.

**Because:**

- Remote job feeds optimize for volume, not fit.
- Cross-border eligibility is usually buried in inconsistent copy instead of exposed as structured metadata.
- Existing job boards are designed for broad audiences, not a specific operator profile.

**Which makes me feel:**

- Distracted, skeptical, and slower than I should be.

### Context and constraints

- Private tool for one operator, not a public marketplace.
- Primary operating context is Luxembourg and CET.
- Initial implementation must stay read-only: fetch, normalize, review, filter.
- No persistence, auth, classification, or automation in slice 1.

### Final problem statement

A Luxembourg-based senior engineer needs a fast way to review remote jobs that are plausibly compatible with their location and profile because current job sources bury fit signals in inconsistent listings, which causes wasted screening time and lower application throughput.

## 2. Jobs To Be Done

### Functional jobs

- Collect jobs from multiple relevant sources in one place.
- Review current openings without opening each source manually.
- Search and filter the visible jobs quickly.
- Open the most promising listings for deeper review.

### Social jobs

- Operate like a disciplined job-market analyst instead of a reactive applicant.
- Maintain a high bar for role quality and relevance.

### Emotional jobs

- Feel in control of the search instead of buried by noisy feeds.
- Reduce frustration from obviously incompatible roles.
- Build confidence that the day’s review session is complete enough.

### Pains

- Repeated tab-hopping across job boards and threads.
- Unstructured location and remote constraints.
- Hidden US-only restrictions.
- Mixed job quality and stale listings.

### Gains

- One dashboard for the first pass of the market.
- Clear source-level visibility.
- Fast keyword filtering.
- A foundation that can later classify eligibility without rebuilding ingestion.

### Main JTBD

When I am looking for senior frontend/full-stack roles, I want to see only jobs that are likely compatible with my location, timezone, seniority, salary expectations, languages, and legal work situation, so that I spend time applying instead of manually filtering garbage.

## 3. Proto-Persona

### Name

- Luxembourg Luc

### Bio and demographics

- Luxembourgish engineer based in Luxembourg.
- 10+ years experience across frontend and full-stack delivery.
- Works comfortably in English and across European teams.
- Active in modern web product environments and values product quality, speed, and technical clarity.

### Quotes

- "If a remote job quietly means US payroll, I want to know before I waste a click."
- "I do not need more jobs. I need fewer bad ones."
- "The first tool should help me review the market, not pretend to automate the whole pipeline."

### Pains

- High manual filtering overhead.
- Too many sources with different structures.
- Low trust in "remote" labels.

### Goals

- Find senior frontend/full-stack roles in Luxembourg, Germany, Switzerland, Europe remote, and select US remote roles that can legally be worked from Luxembourg/CET.
- Build a repeatable private workflow for daily review.

### Behaviors

- Searches daily or near-daily.
- Reads job details carefully before applying.
- Prefers tools that are dense, reliable, and low ceremony.

## 4. Opportunity Solution Tree

### Desired outcome

- Reduce time spent screening low-fit roles while increasing the number of plausible applications per review session.

### Current pain points

- Manual multi-source checking.
- Inconsistent raw formats.
- Hidden legal and geographic constraints.
- No single review surface.

### Opportunities

1. Consolidate relevant job feeds into one operator dashboard.
2. Normalize source data into a comparable job shape.
3. Make first-pass review faster with search and source controls.
4. Preserve source isolation so one broken feed does not kill the session.

### First solution candidates

1. Build a `/jobs` route with normalized jobs from We Work Remotely, Remotive, and HN Hiring.
2. Add client-side source toggles and keyword search.
3. Show per-source status and partial failure messages.
4. Keep adapters isolated so later classification and new sources can plug in cleanly.

### Assumptions

- WWR RSS is stable enough for slice 1.
- Remotive public API is stable enough for slice 1.
- HN Hiring can be pulled from a stable story search plus thread comments.
- A raw feed dashboard is useful before eligibility classification exists.

### Validation tests

- Endpoint feasibility checks against each live source.
- Unit tests for filter behavior.
- Partial-failure handling via all-settled aggregation and source-level status display.

## 5. Lightweight PRD

### 1. Executive summary

find-remote-for-me is a private job intelligence dashboard for a Luxembourg-based senior engineer. Slice 1 delivers a practical `/jobs` route that aggregates raw jobs from We Work Remotely, Remotive, and HN Hiring into one normalized, searchable, source-filterable table.

### 2. Problem statement

- The user wastes time manually screening multiple job sources.
- Remote compatibility signals are inconsistent and often hidden.
- Existing tools do not optimize for this operator’s location and review workflow.

### 3. Target users and personas

- Primary persona: Luxembourg Luc.
- Secondary personas: none for slice 1.

### 4. Strategic context

- This is a private workflow tool, so operator efficiency matters more than growth mechanics.
- Slice 1 should create a stable ingestion and review surface, not solve fit classification yet.

### 5. Solution overview

- Add a `/jobs` route.
- Fetch jobs server-side from three sources.
- Normalize all jobs into one `Job` shape.
- Render a dense, readable review table with search and source filtering.
- Surface loading, empty, and source-level error states.

### 6. Success metrics

- The route renders usable job data from at least one source even if another source fails.
- The operator can filter visible jobs by source and keyword without a page reload.
- The code makes it obvious where to add a fourth source later.

### 7. User stories and requirements

- See section 8.

### 8. Out of scope

- Eligibility classification.
- Salary parsing.
- Timezone parsing.
- Persistence and saved decisions.
- Auth.
- Email digests.
- ATS integrations.
- AI explanations.
- Background refresh jobs.

### 9. Dependencies and risks

- Third-party feed availability and format drift.
- HN comment parsing quality.
- Client-side rendering cost if the HN thread is large.

### 10. Open questions

- Should future slices cache feeds server-side?
- Should HN ingestion stay thread-based or move to an alternate structured source if one proves more stable?

## 6. Roadmap

### Now: Slice 1

- Bootstrap the project from the template.
- Establish the dashboard theme direction.
- Ship `/jobs` with WWR, Remotive, and HN Hiring ingestion.
- Add client-side search and source filters.
- Show partial source failures without breaking the page.

### Next: Slice 2

- Add lightweight caching and refresh metadata.
- Add relevance-oriented presets for senior frontend/full-stack searches.
- Add first heuristics for legal/timezone compatibility flags.
- Add direct links and review aids for triage sessions.

### Later: Slice 3

- Persist jobs and deduplicate across sources.
- Save decisions: apply, reject, revisit.
- Add extracted fit signals and explanation summaries.
- Add daily digest and workflow automation.

### Future platform phase

- ATS integrations.
- Browser dashboard refinements.
- Application tracking.
- Richer AI-assisted screening.

## 7. User Story Map

### Segment

- Senior remote engineering job seeker based in Luxembourg.

### Persona

- Luxembourg Luc.

### Narrative

- Review relevant remote software jobs from multiple sources quickly enough to focus effort on promising applications.

### Activities

1. Collect sources
2. Normalize jobs
3. Display jobs
4. Review jobs
5. Manage follow-up

### Steps

**Collect sources**

- Fetch We Work Remotely
- Fetch Remotive
- Fetch HN Hiring
- Capture source failures independently

**Normalize jobs**

- Map each source to the common job shape
- Create stable IDs
- Trim descriptions into readable snippets

**Display jobs**

- Show title, company, source, location, date, link, and snippet
- Show loading, empty, and source status states
- Show count metadata

**Review jobs**

- Filter by source
- Search by keyword
- Open the original listing

**Manage follow-up**

- Later: classify eligibility
- Later: save/apply/reject
- Later: email digest

### Release slices

- Release 1: Collect sources, normalize jobs, display jobs, filter by source, search by keyword.
- Later releases: classification, persistence, workflow automation.

## 8. First-Slice User Stories

### User Story J1

- **Summary:** View a combined raw job feed from three sources

#### Use Case

- **As a** Luxembourg-based senior engineer reviewing remote roles
- **I want to** open one jobs dashboard that combines We Work Remotely, Remotive, and HN Hiring
- **so that** I can review the market without checking each source manually

#### Acceptance Criteria

- **Scenario:** Combined feed renders with partial resilience
- **Given:** the jobs route is opened
- **and Given:** the server can reach at least one configured source
- **When:** the page loads
- **Then:** I see a normalized jobs table and source-level status information

### User Story J2

- **Summary:** Filter visible jobs by source

#### Use Case

- **As a** daily operator
- **I want to** enable or disable job sources from a keyboard-accessible menu
- **so that** I can narrow the review session to the feeds I care about

#### Acceptance Criteria

- **Scenario:** Source menu updates the visible table
- **Given:** the jobs route has loaded jobs from one or more sources
- **When:** I uncheck or re-check a source in the selector
- **Then:** the table updates to reflect only the enabled sources

### User Story J3

- **Summary:** Search the loaded jobs by keyword

#### Use Case

- **As a** senior frontend/full-stack job seeker
- **I want to** search the visible jobs by keywords such as React, TypeScript, or Germany
- **so that** I can find promising roles faster

#### Acceptance Criteria

- **Scenario:** Search filters across core job fields
- **Given:** jobs are visible in the table
- **When:** I enter a keyword
- **Then:** the visible rows are filtered case-insensitively across title, company, location, source, tags, and description

### User Story J4

- **Summary:** Understand feed health and result state

#### Use Case

- **As a** cautious operator
- **I want to** see whether the feed is loading, empty, or partially failed
- **so that** I know whether I am looking at a trustworthy session

#### Acceptance Criteria

- **Scenario:** Route communicates feed state clearly
- **Given:** the jobs page is loading, empty, or has source failures
- **When:** the UI renders that state
- **Then:** I can understand what happened without relying only on color

## 9. Story Splitting

### Original epic

- Review a combined remote jobs dashboard with raw normalized listings from multiple sources.

### Splits using workflow steps

1. Ingest and normalize source data.
2. Render the raw jobs table and source state.
3. Add source selection controls.
4. Add keyword search over visible jobs.

### Why this split

- Each slice delivers user-facing value.
- No front-end/back-end horizontal slicing.
- Source ingestion can be validated independently from client review controls.

## 10. PoL Probe Advice

### Probe 1: We Work Remotely ingestion

- **Probe type:** Feasibility Check
- **Risk:** RSS endpoint may not be available or may lack enough fields.
- **Test run:** Live request to `https://weworkremotely.com/remote-jobs.rss` and `https://weworkremotely.com/categories/remote-programming-jobs.rss`
- **Current result:** Working RSS observed on April 25, 2026.

### Probe 2: Remotive ingestion

- **Probe type:** Feasibility Check
- **Risk:** Public API may be unavailable or materially restricted.
- **Test run:** Live request to `https://remotive.com/api/remote-jobs`
- **Current result:** Working JSON API observed on April 25, 2026.

### Probe 3: HN Hiring ingestion

- **Probe type:** Feasibility Check
- **Risk:** Stable discovery of the latest hiring thread may be awkward.
- **Test run:** Live request to Algolia story search and item thread endpoints.
- **Current result:** Latest hiring story and nested comments were reachable on April 25, 2026.

### Probe 4: Source failure isolation

- **Probe type:** Feasibility Check plus synthetic failure simulation
- **Risk:** One failing source could blank the page.
- **Test plan:** Aggregate with settled promises and test partial failure behavior.
- **Implementation consequence:** The UI must show partial results and source-level errors.

## 11. Context Engineering Notes

- Inspect the template before editing and follow existing App Router, shared UI, and server patterns.
- Keep the working context bounded to the jobs route, the adapters, the shared types, and minimal theme changes.
- Avoid building future features early.
- Avoid premature source registries or generic plugin systems.
- Keep each adapter readable and source-specific.
- Prefer `pnpm` for package management in this repository.
