# Ending invitation variant

Branch: `ending-agent-invitation`. Based on `bfc331b`, the preserved public version on `main`. This branch is for comparison; it must not replace the existing GitHub Pages release without the user's approval.

## Focused changes

Only the scroll walkthrough's closing scene, its obsolete closing dialog, and ending-specific styles change. The invitation email, traveler story, narration, messages, timing, media, and original click-through presentation remain unchanged.

The ending returns explicitly to the developer's perspective, then says:

**Bring Your Agent to iMessage**

Add texting, reactions and media to your existing voice agent, with Linq handling the messaging infrastructure.

**Map Your First Workflow** is the single primary action. Supporting text identifies it as a conversation with Linq. It opens Linq's official meeting form in a separate tab. **Explore the sandbox** is a quieter secondary link. This replaces the non-sending meeting-information modal; it does not book or submit anything automatically.

Alex ends the travel conversation in character. Scrolling to the final moment returns to the developer's perspective and shows a distinct **Linq team** conversation, addressed to Plot Twist's developer. It contains one short message:

> You've seen the traveler's experience. Let's map how iMessage could work alongside your voice agent.

**See your next step** reveals the existing ending, with its partnership logos, headline, conversion action, sandbox link, and proof line unchanged. This is a local scene transition, not an outgoing message or an external meeting request. The ending's **Back to Linq's message** control returns focus to that button. The message also offers **Back to the traveler**. Scrolling back into the travel story resets the invitation for the next pass.

## Verified official destinations

Checked October 20, 2026:

- Meeting form: https://linqapp.com/s/talk-to-an-expert
- Sandbox signup, linked from Linq's website: https://dashboard.linqapp.com/sandbox-signup
- SOC 2 Type II statement and report information: https://linqapp.com/s/security
- Published 99.95% SLA claim: https://linqapp.com/s/talk-to-an-expert

The small proof line reads **Linq infrastructure · SOC 2 Type II · 99.95% SLA**. Each claim links to its official source. This attributes the claims to Linq, rather than this static demo or the fictional travel assistant. The SLA is presented as Linq's published commitment, not observed historical uptime. The public claim does not establish which plan or contract terms apply to a particular prospect.

## Preview

Run `npm run build`, then `npm run preview -- --port 4177`. Open `http://127.0.0.1:4177/?view=scroll` and use End to reach Linq's message, then choose **See your next step** to reveal the ending. The public GitHub Pages deployment stays on the approved version.

## Validation

All 26 existing tests and the TypeScript/Vite build pass. Production-preview browser checks cover the ending at 1440×900 and 320×568, readable content without horizontal overflow, a 44-pixel primary action on the small phone, keyboard movement between the primary and secondary links, and the actual official meeting form opening in a separate tab. No form was submitted.

An ending-only presence boundary prevents a previous scroll caption from remaining visible when the viewer reaches the final scene. Entering and leaving the ending were checked with normal and reduced motion; the phone, scenario, and earlier chapter transitions remain outside that boundary. Temporary viewport and reduced-motion overrides are restored after review.

The message-to-ending update was checked at 320×568 and 1440×900, including the full message, a visible 44-pixel button, keyboard activation, focus on the ending heading, return focus to the message button, both back actions, and reset after scrolling out and back. Inactive travel and Linq conversations are hidden from focus and assistive technology. The travel scenario and all 26 existing tests remain intact.
