# ENVIE Reference Audit

Reference: https://www.envieagency.com/
Reviewed: 2026-10-21, live browser and supplied mobile screenshot.

## Findings

- The page introduces recognisable customer problems before its detailed service catalogue. This gives visitors a reason to continue before they encounter technical service names.
- Four numbered cards use a short heading, a dividing rule and one paragraph. Alternating dark, light and accent surfaces make the sequence easy to scan.
- The cards use sticky positioning. As visitors scroll, each incoming card covers the previous card beneath the fixed navigation. This is a scroll-driven stack, not an autoplay carousel.
- Cases describe the task and the agency's work; testimonials provide supporting evidence. NickolasSpace already has a project selector, so duplicating it would add navigation without adding evidence.
- The reference also uses a compact floating navigation, animated headline and service accordions. These are separate design decisions; changing the existing NickolasSpace navigation and service tabs is outside this implementation.

## Implemented For NickolasSpace

- Added BusinessChallenges between the introduction and services, with four original business problems relevant to websites, automation, integrations and custom development.
- Recreated the sticky card stack using native CSS, without a new animation dependency or scroll interception.
- Preserved the existing charcoal, light grey and mint palette, with an 8px card radius.
- Added English, Ukrainian and Swedish copy, plus a contact button using the existing modal.
- Motion pause and reduced-motion preferences show a normal non-sticky list. Short viewports also use the normal list so tall cards cannot trap their content under the header.

## Verification

Browser checks covered desktop (1440x900) and mobile (390x844), Ukrainian and Swedish text, card overlap, horizontal overflow, the existing contact modal and the motion pause control. Build, lint and the existing automated checks were run separately.

## Next Priorities

Use verified project outcomes and genuine client feedback to strengthen the cases. Do not copy the reference's statistics, testimonials or business claims. Keep the current hero and navigation stable while evaluating how visitors use the new section.
