# Ending invitation variant

Branch: `ending-agent-invitation`. Based on `bfc331b`, the preserved public version on `main`. This branch is for comparison; it must not replace the existing GitHub Pages release without the user's approval.

## Focused changes

The branch refines the scroll walkthrough's opening phone and closing scene. The invitation email, travel facts, narration, message timing, and original click-through presentation remain unchanged.

The ending returns explicitly to the developer's perspective, then says:

**Bring Your Agent to iMessage**

Add texting, reactions and media to your existing voice agent, with Linq handling the messaging infrastructure.

**Map Your First Workflow** is the single primary action. Supporting text identifies it as a conversation with Linq. It opens Linq's official meeting form in a separate tab. **Explore the sandbox** is a quieter secondary link. This replaces the non-sending meeting-information modal; it does not book or submit anything automatically.

Alex ends the travel conversation in character. The next scroll chapter returns to the developer's perspective and appends one ordinary incoming message inside the same thread. It uses the same native bubble, font, size, and spacing as the other replies; the travel history, contact header, and composer remain in place. The heading returns to the product, and the message's sign-off identifies Linq. The redundant explanatory sentence beside the phone is removed. It says:

> Ready to bring your agent to iMessage? - Linq

Two preview variants share the same message and flow. The default keeps the plain text message. `?view=scroll&ending=graphic` adds a small Plot Twist Travel × Linq lockup inside that bubble, between the Linq sign-off and the blue action. The graphic reuses the existing brand marks and does not link anywhere.

The blue **See your next steps** button jumps to the final invitation. Continuing to scroll reaches the same ending without clicking. There is no arrow, click instruction, or locked scene. The ending's **Back to Linq's message** control scrolls back to the note. Keyboard focus moves to the destination only when one of these shortcuts is activated; ordinary scrolling does not move focus.

The additional ending chapter leaves the earlier travel events at their existing scroll positions. Scrolling backward restores the preceding conversation deterministically. This final Linq note is an illustrated handoff to the developer, not a claim that unrelated real senders share a one-to-one iMessage thread.

The opening phone now uses a centered iOS-style contact stack, rounded blue and gray message bubbles with tails, a timestamp, and a visual-only composer. The flight screenshot stays intact. The voice-screen avatar is also centered; its metadata selector no longer overrides the avatar's display style.

## Verified official destinations

Checked October 20, 2026:

- Meeting form: https://linqapp.com/s/talk-to-an-expert
- Sandbox signup, linked from Linq's website: https://dashboard.linqapp.com/sandbox-signup
- SOC 2 Type II statement and report information: https://linqapp.com/s/security
- Published 99.95% SLA claim: https://linqapp.com/s/talk-to-an-expert

The small proof line reads **Linq infrastructure · SOC 2 Type II · 99.95% SLA**. Each claim links to its official source. This attributes the claims to Linq, rather than this static demo or the fictional travel assistant. The SLA is presented as Linq's published commitment, not observed historical uptime. The public claim does not establish which plan or contract terms apply to a particular prospect.

## Preview

Run `npm run build`, then `npm run preview -- --port 4177`. Compare the two versions:

- Plain message: `http://127.0.0.1:4177/?view=scroll#linq-invitation`
- With the small partnership graphic: `http://127.0.0.1:4177/?view=scroll&ending=graphic#linq-invitation`

Scroll through Linq's message to the final invitation, or use **See your next steps** as a shortcut. End also reaches the final invitation. The public GitHub Pages deployment stays on the approved version.

## Validation

The 27 scenario and scroll-model tests cover the existing travel sequence, deterministic rewind, and progression through the new Linq-note chapter into the final invitation without changing the completed trip. The production build checks TypeScript and Vite output.

Browser review covers normal and reduced motion, desktop and narrow mobile layouts, continuous scrolling into the ending, the optional blue shortcut, return navigation, matching native bubble typography, keyboard focus, and browser errors. Both plain and graphic comparison links open directly at the message chapter after the asynchronous walkthrough loads. The small graphic was checked at 1440×900 and 320×568; the note, graphic, and 44-pixel shortcut fit inside the thread without horizontal overflow. Inactive layers remain hidden from focus and assistive technology. Temporary viewport and motion overrides are restored after review.
