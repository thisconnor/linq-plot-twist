# Version 5 scenario decisions

The October 19 handoff supersedes the earlier branching comparison. This website demonstrates a campaign to Nate. The proposed prospect offer is a relevant live demo number, emailed with a short invitation and a visual. The website and future explainer video are separate deliverables.

## Linear story

There is one fixed scenario, shown first as a call and then in Messages. Both modes communicate the same flight options, recommendation, selected flight and gate update. Only one phone and one channel's playback are active. Revisit controls cancel and reset the inactive voice stream. Switching out of an unfinished message response rolls that incomplete beat back to its prepared draft; completed history is retained, preventing duplicates and stalled turns.

1. Initial disruption: PT204 canceled; traveler and dog Pickles need a way home. Two options appear, with the nonstop recommended.
2. One confirmation: the prepared reply selects the nonstop and mentions pet relief beside B10.
3. Eight minutes later: B12 changes to B18. Boarding remains 6:50 PM. Directions remain available as a fictional map image.

No food branch, alternate-flight game, repeated dog jokes, side notes or external response panel remain. The initial `HOME` keyword is included in the first prepared traveler message. The website's illustrative number is never made actionable by SMS/phone links.

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

Alex's name/photo are offered only after the first reply. The recipient may choose Use; the header does not assume acceptance beforehand. Contact sharing, read receipts and typing are illustrative and depend on real platform settings and delivery behavior.

Flight results, gate information and map use original PNG attachments. Only image enlargement is interactive. No unsupported flight-selection widget, Google/Expedia integration or reservation evidence is presented. The map is explicitly fictional and not to scale.

## Narration

The user authorized discovering an open-source voice tool. Kokoro-82M v1.0 generated the three fixed Alex clips locally, using the published `am_fenrir` preset and no account/API. There is no browser speech-synthesis fallback. Actual audio time drives sentence captions. Muting preserves timing; audio failure switches to readable timed captions. Persistent captions remain available separately.

The call starts only after the viewer presses Start voice example. The prepared traveler statements appear as YOU SAY captions between Alex clips. An explicit Eight minutes later label accompanies the final update. This compresses the fictional scenario; it is not a claim about a real call's duration.

## Commercial ending

Return explicitly to the developer role, show both logos, and offer Discuss this for your product. Retain the existing non-sending modal and routing disclosure. Restart walkthrough is secondary. No email, meeting request or live message is sent.
