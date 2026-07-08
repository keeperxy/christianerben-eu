# Plan 011: Cover untested homepage content sections

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report - do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat ae69f03..HEAD -- src/components/ProjectsSection.tsx src/components/SecurityComplianceSection.tsx src/components/ProjectsSection.test.tsx src/components/SecurityComplianceSection.test.tsx src/tests/pages/Index.test.tsx src/test-utils.tsx`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `ae69f03`, 2026-07-09

## Why this matters

Most public homepage sections have focused tests, but Projects and Security/Compliance do not. The page-level index test mocks Projects and checks only headings for several sections, so project cards, image alt text, tags, and security/compliance list content can disappear without a targeted failure. This plan closes that gap with small component tests.

## Current state

- `src/tests/pages/Index.test.tsx` - page-level smoke test; mocks `ProjectsSection`.
- `src/components/ProjectsSection.tsx` - real project carousel section.
- `src/components/SecurityComplianceSection.tsx` - real security/compliance card grid.
- `src/test-utils.tsx` - provides `renderWithSettings` for component tests with a settings context.

Current excerpts:

```tsx
// src/tests/pages/Index.test.tsx:7-14
vi.mock("@/components/ProjectsSection", () => ({
  __esModule: true,
  default: () => (
    <section id="projects">
      <h2>{siteContent.projectsSectionTitle.en}</h2>
    </section>
  ),
}));
```

```tsx
// src/tests/pages/Index.test.tsx:77-92
it("renders the main homepage sections", async () => {
  renderWithSettings(<Index />);

  const heroHeading = new RegExp(
    `${siteContent.hero.name}.*${siteContent.hero.titleElements[0].en}`,
    "i",
  );
  const heroHeadings = await screen.findAllByRole("heading", { name: heroHeading });
  expect(heroHeadings.length).toBeGreaterThan(0);
  expect(heroHeadings[0]).toBeInTheDocument();
  expect(await screen.findByRole("heading", { name: siteContent.about.title.en })).toBeInTheDocument();
  expect(await screen.findByRole("heading", { name: siteContent.experienceSectionTitle.en })).toBeInTheDocument();
  expect(await screen.findByRole("heading", { name: siteContent.contact.title.en })).toBeInTheDocument();
  expect(await screen.findByRole("heading", { name: siteContent.certificates.title.en })).toBeInTheDocument();
});
```

```tsx
// src/components/ProjectsSection.tsx:36-68
{projects.map((project, index) => (
  <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
    <div className="bg-card rounded-xl overflow-hidden shadow-md border border-border hover-scale transition-all h-full">
      <div className="aspect-video relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
          {project.imageUrl && (
            <Image
              src={project.imageUrl}
              alt={`${t(project.imageAlt)}`}
              width={512}
              height={288}
              className="object-contain max-h-48 max-w-64 h-auto mx-auto"
            />
          )}
        </div>
      </div>
...
      <div className="flex flex-wrap gap-2 mb-6">
        {project.tags.map((tag, tagIndex) => (
          <Badge key={tagIndex} variant="outline" className="font-normal">
            {t(tag)}
          </Badge>
        ))}
      </div>
```

```tsx
// src/components/SecurityComplianceSection.tsx:22-49
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
  {securityCompliance.items.map((item, index) => {
    const IconComponent = item.icon;
    return (
      <div
        key={index}
        className="p-6 rounded-lg border border-border bg-card hover-scale transition-all h-full flex flex-col"
      >
...
        <ul className="space-y-3 flex-grow">
          {item.items.map((listItem, itemIndex) => (
            <li
              key={itemIndex}
              className="flex gap-2 text-sm text-muted-foreground leading-relaxed"
            >
              <span className="text-primary flex-shrink-0">•</span>
              <span>{t(listItem)}</span>
            </li>
          ))}
        </ul>
```

Repo conventions to match:

- Existing component tests live beside components, e.g. `src/components/AboutSection.test.tsx`, `src/components/SkillsSection.test.tsx`, and `src/components/ContactSection.test.tsx`.
- Tests use `renderWithSettings` for context-dependent components.
- Keep tests representative, not exhaustive snapshots.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Install | `bun install --frozen-lockfile` | exit 0 |
| Targeted tests | `bun run test:run -- src/components/ProjectsSection.test.tsx src/components/SecurityComplianceSection.test.tsx` | exit 0 |
| Lint | `bun run lint` | exit 0 |
| Typecheck | `bun run typecheck` | exit 0 |
| Full tests | `bun run test:run` | exit 0 |
| Async leak check | `bun run test:leaks` | exit 0 |
| Generated freshness | `bun run verify:generated` | exit 0 |
| Build | `bun run build` | exit 0 |

## Scope

**In scope**:

- `src/components/ProjectsSection.test.tsx` (create)
- `src/components/SecurityComplianceSection.test.tsx` (create)
- Existing components only if required to add accessible labels/testability without visual change
- `plans/README.md` status row only

**Out of scope**:

- Do not redesign the project carousel.
- Do not change `siteContent`.
- Do not unmock `ProjectsSection` in `src/tests/pages/Index.test.tsx`; keep the page test lightweight unless a new component test makes that mock obsolete by clear consensus.
- Do not add browser/E2E infrastructure.

## Git workflow

- Suggested branch: `advisor/011-cover-homepage-section-tests`
- Commit message style: `Cover homepage content sections`
- Do not push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add `ProjectsSection` tests

Create `src/components/ProjectsSection.test.tsx`.

Test cases:

1. English render:
   - `renderWithSettings(<ProjectsSection />)`.
   - Assert heading `siteContent.projectsSectionTitle.en`.
   - Pick `const firstProject = siteContent.projects[0]`.
   - Assert first project title, description, at least one tag, and image alt text.

2. German render:
   - Render with `{ language: "de", t: (text) => text.de }`.
   - Assert heading `siteContent.projectsSectionTitle.de`.
   - Assert first project German title and image alt text.

If Next Image causes test noise, follow existing repo patterns or mock `next/image` in the test as a plain `img` element. Keep the mock local to the test file.

**Verify**: `bun run test:run -- src/components/ProjectsSection.test.tsx` -> passes.

### Step 2: Add `SecurityComplianceSection` tests

Create `src/components/SecurityComplianceSection.test.tsx`.

Test cases:

1. English render:
   - `renderWithSettings(<SecurityComplianceSection />)`.
   - Assert heading `siteContent.securityCompliance.title.en`.
   - If subtitle exists, assert subtitle.
   - Pick first item and assert its title plus the first list item.

2. German render:
   - Render with German settings.
   - Assert German heading and first item German title/list entry.

Do not assert icon SVG internals; it is enough that content cards render.

**Verify**: `bun run test:run -- src/components/SecurityComplianceSection.test.tsx` -> passes.

### Step 3: Run targeted section tests together

Run:

```sh
bun run test:run -- src/components/ProjectsSection.test.tsx src/components/SecurityComplianceSection.test.tsx
```

**Verify**: both new test files pass without warnings that hide real failures.

### Step 4: Run the full gate and update index

Run:

```sh
bun run lint
bun run typecheck
bun run test:run
bun run test:leaks
bun run verify:generated
bun run build
```

Update `plans/README.md` row for Plan 011 to `DONE` only after all commands pass.

**Verify**: `git status --short` -> only in-scope files changed.

## Test plan

- `ProjectsSection.test.tsx` verifies representative English and German content, image alt text, and tags.
- `SecurityComplianceSection.test.tsx` verifies representative English and German headings/list content.
- Existing `Index.test.tsx` remains a page smoke test.

## Done criteria

- [ ] Projects section has a focused component test.
- [ ] Security/Compliance section has a focused component test.
- [ ] Tests cover English and German rendering for both sections.
- [ ] No visual/runtime behavior changes unless needed for accessibility/testability.
- [ ] `bun run lint`, `bun run typecheck`, `bun run test:run`, `bun run test:leaks`, `bun run verify:generated`, and `bun run build` exit 0.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report back if:

- The components have changed enough that the excerpts no longer match.
- Testing either component requires broad carousel or Next Image infrastructure changes.
- You need to change `siteContent` to make the tests pass.

## Maintenance notes

These tests should stay representative. Avoid snapshotting whole sections; assert stable public content and accessibility-facing text so future content/layout changes can be reviewed intentionally.
