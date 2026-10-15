# Version 3 scenario decisions

The latest review replaces the dense, freely clickable funnel with a landing page and three sequential explanation screens. It removes the ex story, explicitly introduces Pickles as the traveler’s dog and Alex as Plot Twist Travel’s existing AI assistant, and extends the scenario from three to six beats.

## Opening

1. Landing: one premise, one primary “Walk me through it” action, and a demo shortcut.
2. Explanation: one idea at a time, with Back/Next. Learn the product; prepare a relevant preview; invite a conversation after the developer experiences it.
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
5. Ask for gate and boarding details again while juggling leash and suitcase. The updated card remains available in Messages.
6. Thank Alex and finish. The latest itinerary stays with the conversation; the closing returns to the developer’s perspective.

“Why iMessage?” callouts appear at the corresponding message event, stay until the next beat or dismissal, and can be reopened. They explain comparison, acknowledgment, visual directions, the gate update, finding details and retaining the conversation. Wide screens position them beside Messages; compact screens place them below the phone without covering the conversation.

## History and accessibility

Each message stores its own scenario snapshot. Old maps retain their original gate; opening an old map shows the historical route. The first itinerary is marked as an earlier plan after the update. New map and plan attachments use the updated gate. All current details derive from `src/scenario.ts`.

Voice remains capable, polite and factually equivalent, using natural spoken wording. Messages uses short bursts, reactions and visual attachments. Voice captions fade by default; optional persistent captions, browser audio fallback, keyboard access and reduced motion remain supported. The clock advances only at the explicit story jump, not with playback duration.

The generated Alex portrait is fictional and labeled as an AI assistant. No messaging provider, microphone, live flight data, booking, meeting router or analytics transport is connected.
