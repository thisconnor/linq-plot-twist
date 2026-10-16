# Version 4 scenario decisions

The opening stays focused and sequential. The latest review adds clear brand ownership, a more explicit developer-to-customer transition, balanced channel annotations, a three-way dinner decision, and a Plot Twist × Linq partnership ending.

## Opening

1. Landing: one premise, one primary “Walk me through it” action, and a demo shortcut.
2. Explanation: one idea at a time, with Back/Next. Select a customer profile and relevant company signals; AI custom-builds a lightweight demo for each company before outreach; review it and send a cold email invitation; invite a conversation after the developer experiences it.
3. Developer: mock invitation to try an iMessage version of the voice assistant they already have.
4. Traveler: canceled flight home, dog Pickles, AI assistant Alex. No ex or unexplained backstory.

## Canonical sample facts

All names, flights, terminal geometry and times are fictional. The traveler starts in Harbor City Airport, Terminal 2, at 5:25 PM after Plot Air PT204 is canceled. Pickles is cleared to travel on either replacement option. Selecting a plan does not issue a ticket.

| Choice | Flight | Departs | Boards | Home tonight | Connection | Original gate | Updated gate |
|---|---|---|---|---|---|---|---|
| Simpler trip | PT218 | 7:20 PM | 6:50 PM | 9:40 PM | Nonstop | B12 | B18 |
| Earlier arrival | PT306 | 6:15 PM | 5:45 PM | 8:55 PM | 40 min in Meadow City | B16 | B20 |

Before the gate change: three-minute walk to pet relief beside B10, five-minute stop, then four minutes to B12 or six to B16. Total 12/14 minutes; arrival 5:37/5:39, with 73/6 minutes before boarding.

The story explicitly advances eight minutes to 5:33 after the pet stop. The selected flight changes gate; boarding and departure remain unchanged. From pet relief, B18 takes six minutes and B20 takes eight. Arrival is 5:39/5:41, with 71/4 minutes before boarding. The connection branch tells the traveler to head straight there.

## Six user-controlled beats

1. Ask Alex for replacement flights. Both options and Alex’s recommendation appear.
2. Choose a flight. Receive its details; Alex asks what the traveler needs before walking over.
3. Ask for a pet stop. Receive directions, a map and the time allowance.
4. Check in after the stop. Receive a gate change and revised route.
5. Two hungry travelers: choose “Feed both of us,” “Pickles first,” or “Straight to the gate.” Alex adapts to the boarding buffer; a dinner card retains the plan.
6. Thank Alex and finish. The latest itinerary stays with the conversation; the closing returns to the developer’s perspective.

Paired voice/iMessage notes appear at the corresponding message event. A shared hide/reopen control persists across beats until reset. At 1440 pixels and above, compact notes sit outside the phones; smaller screens keep a balanced pair below the interfaces. The call stays equally competent; the notes discuss spoken information and retained visuals.

## Dinner feasibility

At 5:33 the traveler is still at pet relief. The B14 deli is along the fictional route to B18. On the nonstop, allow 10 minutes for takeaway plus 5 minutes for Pickles’ usual food from the traveler’s bag. Ready at B18 at 5:54, with 56 minutes before boarding. Pickles-only adds 5 minutes: ready 5:44, buffer 66. Going straight preserves 5:39 and 71 minutes.

For the connection, Alex declines the deli detour. Head directly to B20; if feeding Pickles, allow two minutes at the gate with his packed food, ready at 5:43 with two minutes before boarding. Going straight is ready at 5:41 with four minutes. The traveler’s dinner waits until after boarding. These are illustrative estimates, not live venue or queue claims. No food is ordered. `getDinnerPlan` supplies the same steps and timing to both channels and the final itinerary. Earlier maps remain estimates for the direct route, before the dinner decision.

## Brand ownership

Linq owns the growth explanation and invitation sender. The developer inbox introduces Plot Twist subtly. The traveler setup explicitly changes perspective and switches to Plot Twist’s cream, plum and coral identity; the voice interface carries that identity. Native iMessage styling stays familiar, with a restrained Powered by Linq lockup. The final modal pairs both logos with a customer-focused invitation and secondary prototype disclosure.

## History and accessibility

Each message stores its own scenario snapshot. Old maps retain their original gate; opening an old map shows the historical route. The first itinerary is marked as an earlier plan after the update. New map and plan attachments use the updated gate. All current details derive from `src/scenario.ts`.

Voice remains capable, polite and factually equivalent, using natural spoken wording. Messages uses short bursts, reactions and visual attachments. Voice captions fade by default; optional persistent captions, browser audio fallback, keyboard access and reduced motion remain supported. The clock advances only at the explicit story jump, not with playback duration.

The generated Alex portrait is fictional and labeled as an AI assistant. No messaging provider, microphone, live flight data, booking, meeting router or analytics transport is connected.
