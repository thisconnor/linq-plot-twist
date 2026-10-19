# Scenario decisions through version 7

The October 19 handoff supersedes the earlier branching comparison. This website demonstrates a campaign to Nate. The proposed prospect offer is a relevant live demo number, emailed with a short invitation and a visual. The website and future explainer video are separate deliverables.

## Linear story

There is one fixed scenario, shown first as a call and then in Messages. Both modes communicate the same flight options, recommendation, selected flight and gate update. Only one phone and one channel's playback are active. Revisit controls cancel and reset the inactive voice stream. Switching out of an unfinished message response rolls that incomplete beat back to its prepared draft; completed history is retained, preventing duplicates and stalled turns.

1. Initial disruption: PT204 canceled; traveler and dog Pickles need a way home. Two options appear, with the nonstop recommended.
2. One confirmation: the prepared reply selects the nonstop and mentions pet relief beside B10.
3. Eight minutes later: B12 changes to B18. Boarding remains 6:50 PM. Directions remain available as a fictional map image.

No food branch, alternate-flight game, repeated dog jokes or external response panel remain. Version 6 adds two short feature notes at the user’s request. The first prepared text is `home` alone. Alex introduces himself before the next prepared flight request. The website's illustrative number is never made actionable by SMS/phone links.

## Canonical facts

Source: `src/data/trip.json`. Scenario export: `docs/final-scenario.json`.

- Fictional Harbor City Airport, Terminal 2, Plot Air; canceled flight PT204.
- Start at 5:25 PM. Explicit story jump to 5:33 PM; browser playback duration never advances travel time.
- Selected PT218: 7:20 PM departure, 9:40 PM arrival, 6:50 PM boarding; B12 changes to B18.
- Alternative PT306: 6:15 PM departure, 8:55 PM arrival, 40 minutes in Meadow City.
- Route from pet relief beside B10 to B18: 6 minutes. Leave 5:33 PM, arrive 5:39 PM, 71 minutes before boarding.
- Selecting the sample plan never issues a ticket or completes a booking.

## Native-looking behavior with explicit limits

Prepared traveler drafts live inside the composer and Send is the next action. This is labeled once as guided simulation behavior; it is not a claim about native iMessage generating or limiting replies. Outgoing messages are blue; assistant messages are neutral. Delivered precedes Read, typing precedes each reply, and the confirmation receives one acknowledgment reaction.

Alex’s name/photo appear automatically after the welcome reply in this walkthrough. The Use control is removed at the user’s request. Real contact sharing, read receipts and typing depend on platform settings and delivery behavior.

Flight results and map use browser screenshots of the sample website; gate information uses an original PNG summary. Flight/gate images enlarge; the map opens the matching fictional route website with working zoom. No unsupported flight-selection widget, Google/Expedia integration or reservation evidence is presented. The airport route remains fictional.

## Narration

The user authorized discovering an open-source voice tool. Kokoro-82M v1.0 generated the three fixed Alex clips locally, using the published `am_fenrir` preset and no account/API. There is no browser speech-synthesis fallback. Actual audio time drives sentence captions. Muting preserves timing; audio failure switches to readable timed captions. Persistent captions remain available separately.

The call starts only after the viewer presses Start voice example. The prepared traveler statements appear as YOU SAY captions between Alex clips. An explicit Eight minutes later label accompanies the final update. This compresses the fictional scenario; it is not a claim about a real call's duration.

## Commercial ending

Return explicitly to the developer role, show both logos, and offer Discuss this for your product. Retain the existing non-sending modal and routing disclosure. Restart walkthrough is secondary. No email, meeting request or live message is sent.

## Version 6 review changes

The campaign headline now sells the growth tactic: let qualified builders experience a personalized demo before asking for a meeting. The approved explanation paragraph is unchanged. The role handoff uses readable copy and explicitly identifies the viewer as the traveler, Pickles as their dog, and Alex as the AI assistant. The new male airport portrait matches the existing male narration.

Two short iMessage feature notes are restored at the user's request: one reaction note and one visual-route note, triggered when those features appear. They dismiss automatically or manually. Desktop notes sit beside the phone; mobile notes reserve space below it. The linear three-send scenario is preserved.

Flight and map attachments are now actual screenshots of a purpose-built sample website. This provides familiar search and map hierarchy without claiming real booking results or putting fictional gates on an unrelated real airport screenshot. The map attachment opens the matching fictional route website with working zoom and directions. No Google branding or live navigation is claimed.

The ending makes a concrete pilot proposal, with a stronger headline and action. Its modal stays explicitly non-sending because meeting routing is not configured.

## Version 7 small revisions

The text flow has four sends: home; the separate canceled-flight request; nonstop confirmation; gate-update request. The welcome introduces Alex and reveals the contact automatically before any flight options appear. The message-step list is separate from the three voice scenes, preserving the prerecorded audio and all travel facts. Cancellation still rolls back an incomplete text step, including its contact reveal when the welcome is interrupted.

The campaign headline is now “Let them try it first. Win the meeting.” The email screen uses one compact lead-developer line beside the Plot Twist logo, replacing the large headline and duplicate explanation.
