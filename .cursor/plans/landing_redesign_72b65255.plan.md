---
name: Landing Redesign
overview: Implement the approved Figma landing redesign on a new `feat/landing-redesign` branch, including shadcn/ui setup and updated branding from the favicon assets. The first implementation will use editable/product-UI placeholders until you provide screenshots later.
todos:
  - id: branch
    content: Create and push `feat/landing-redesign` branch without disturbing unrelated working-tree changes
    status: completed
  - id: shadcn
    content: Initialize shadcn/ui and add only required primitives for the landing page
    status: completed
  - id: branding
    content: Create updated brand lockup using the favicon icon asset and remove old logo usage from new landing shell
    status: completed
  - id: sections
    content: Implement the redesigned landing sections with Tailwind/shadcn and placeholder product UI panels
    status: completed
  - id: analytics
    content: Preserve CTA, sneak-peek modal, and landing analytics behavior
    status: completed
  - id: verify
    content: Run landing lint/build checks and report results
    status: completed
isProject: false
---

# Landing Page Redesign Implementation

## Scope
- Create and push a new branch named `feat/landing-redesign` from the current `exam-genius` repo state.
- Preserve existing unrelated changes, especially `.cursor/settings.json`, and avoid touching the backend repo.
- Rebuild the public landing page in `[apps/landing-page/app/page.tsx](/Users/chiso/Projects/Omnicentra/Exam%20Genius/exam-genius/apps/landing-page/app/page.tsx)` around the Figma direction: product-led hero, capability cards, dark walkthrough band, pricing, FAQ, and final CTA.
- Use the updated brand mark from `[apps/landing-page/public/static/favicon/icon.svg](/Users/chiso/Projects/Omnicentra/Exam%20Genius/exam-genius/apps/landing-page/public/static/favicon/icon.svg)`. Since that appears to be an icon rather than a full wordmark, I’ll create a reusable brand lockup that pairs the favicon icon with `ExamGenius` text and stop using the old `/static/images/logo.svg` / `logo2.svg` in the landing shell.

## Implementation Plan
- Initialize shadcn/ui for the landing app with Radix primitives, using the non-interactive CLI path and pnpm-compatible dependency management. I’ll keep the configuration scoped to the monorepo and preserve the existing Poppins/Tailwind setup in `[apps/landing-page/styles/globals.css](/Users/chiso/Projects/Omnicentra/Exam%20Genius/exam-genius/apps/landing-page/styles/globals.css)` and `[apps/landing-page/tailwind.config.js](/Users/chiso/Projects/Omnicentra/Exam%20Genius/exam-genius/apps/landing-page/tailwind.config.js)`.
- Add only the shadcn primitives needed for this page: likely `button`, `card`, `badge`, `accordion`, and `separator`. If mobile nav needs a drawer, add `sheet`; otherwise keep it custom and lightweight.
- Create landing-specific components under `[apps/landing-page/components/](/Users/chiso/Projects/Omnicentra/Exam%20Genius/exam-genius/apps/landing-page/components)` such as `BrandLogo`, `LandingNavbar`, `ProductPreview`, `FeatureCard`, `HowItWorksRedesign`, `PricingRedesign`, and `LandingFooter`.
- Replace the current section stack in `page.tsx` with the redesigned flow while keeping the existing `SneakPeakContext`, `SneakPeakSlideshow`, and analytics events so CTAs still open the current sneak-peek flow.
- Use safe copy, avoiding hard accuracy claims: “trained on years of past-paper patterns”, “built around real exam-board formats”, and “practice papers, not official examiner papers”.
- Keep screenshots as placeholders for now by recreating product UI panels in JSX/Tailwind, matching the Figma mockups. When you provide real screenshots later, we can swap those panels to image-backed sections.
- Update metadata descriptions in `[apps/landing-page/app/layout.tsx](/Users/chiso/Projects/Omnicentra/Exam%20Genius/exam-genius/apps/landing-page/app/layout.tsx)` so sharing previews reflect the new positioning.

## Validation
- Run `pnpm lint:landing` and `pnpm build:landing` from the monorepo root.
- Use the IDE linter on edited files after implementation.
- If the shadcn CLI changes formatting or generated files, review the diff carefully and keep the changes limited to what the landing page needs.

## Notes
- I will not remove Mantine from the entire landing app in this first branch because `SneakPeakSlideshow`, existing chooser flows, and providers still depend on it. The public landing surface will move toward shadcn/Tailwind now; full Mantine removal can be a follow-up migration once the redesign is stable.