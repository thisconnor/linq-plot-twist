# Final review refinements

October 19, 2026. Applies to the current scroll walkthrough at `?view=scroll`.

## Actionable feedback

- **Audience:** teams already building voice AI products. The invitation is for a product team with an existing voice assistant, rather than an undefined group of AI builders.
- **Benefit:** add iMessage alongside voice. The existing travel story supplies the evidence: flight options, a gate update, and directions the customer can revisit. The voice agent remains useful.
- **Invitation:** make the subject and first paragraph about the customer's benefit. Describe the company-specific demo as a standalone concept built from public information, without access to the prospect's agent. Keep one main action: **Try the customer demo**. Keep **HELP**, the illustrative number, and the separate greeting before the flight request.
- **Final CTA:** return explicitly to the developer's perspective and invite a meeting with Linq. The dialog gives that meeting a purpose: map one workflow, then test an integration in the sandbox before planning a customer pilot. It explicitly states that this demo neither books that meeting nor connects an agent.

## Brainstorming retained as possibilities

Appointment and dental examples, post-call summaries, receipts, reminders, calendar invitations, free trials, and a particular tool-call architecture are ideas for later discovery. They are not requirements for this travel demo. No claim is made that integration is one step, effortless, or already connected. No comparative engagement or conversion figures are added.

## Scope

The ten-part scroll story, travel facts, male Alex identity, Pickles, existing audio, attachments, and deterministic rewind remain intact. The shared email copy is also used by the preserved click-through version; its other screens remain unchanged. No routing migration, live messaging, scheduling service, new integration, or outreach is added.

The user selected the scroll experience as the current version. The original URL remains available for reference. Earlier version 8 screen-copy notes describe that older presentation; this note records the current scroll framing.

## Source grounding

[Linq's website](https://linqapp.com/) presents iMessage messaging alongside voice and offers sandbox and expert conversations. [Linq's attachment documentation](https://docs.linqapp.com/channel/imessage/guides/messaging/attachments/) supports the use of images and files as the concrete messaging benefit. These sources establish product capabilities; they do not establish a working integration in this browser simulation.

## Review boundaries

This is a fictional browser walkthrough and an illustrative outreach email. The company-specific prospect offer remains a proposed live operation. The browser demo does not send an invitation, provision a phone number, connect an agent, place a call, book a flight, or request a meeting.

## Validation

All 26 existing tests and the TypeScript/Vite production build pass. Browser review covers the introduction, invitation action, traveler handoff, intentional voice playback and scroll cancellation, HELP/greeting/contact order, the flight request, flight options, reaction, gate update, route, backward scrolling, and the final dialog. Keyboard checks confirm that focus stays in the dialog and Escape returns focus to **Meet with Linq** without changing the scroll position.

Responsive review uses 1440×900, 1280×720, 375×812, and 320×568. The email action stays visible without horizontal overflow. At the smallest size, the decorative mail toolbar yields space to the email and its action. The final dialog sits above the fixed header and leaves its actions reachable. Browser QA remains verification of this scripted web experience, not a live Linq or native iPhone integration.
