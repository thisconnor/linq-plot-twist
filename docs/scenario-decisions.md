# Scenario decisions

All values describe Harbor City Airport, a fictional airport. The diagram is illustrative and not to scale.

## Fixed facts

- Plot Air PT204: original departure 4:55 PM; revised departure 6:20 PM.
- Boarding starts at 5:50 PM. Gate changes from B8 to B12.
- Traveler starts at the Terminal 2 central concourse at 5:25 PM.
- Direct walk to B12: six minutes.
- Pet relief beside B10: three-minute walk, five-minute stop, four-minute walk to B12.
- Food kiosk: two-minute walk, five-minute pickup allowance, six-minute walk to B12.
- Combined route: two minutes to food, five for pickup, three to pet relief, five for the pet stop, four to B12.
- Charging is at B12 seating. Port availability is unknown.

The walk to the kiosk completes a gap in the original dataset. It preserves the supplied pickup/walk values and the combined 19-minute route.

| Constraints | Minutes | Arrival | Before boarding |
| --- | ---: | --- | ---: |
| Battery | 6 | 5:31 PM | 19 minutes |
| Dog | 12 | 5:37 PM | 13 minutes |
| Food | 13 | 5:38 PM | 12 minutes |
| Dog + battery | 12 | 5:37 PM | 13 minutes |
| Food + battery | 13 | 5:38 PM | 12 minutes |
| Dog + food | 19 | 5:44 PM | 6 minutes |

## Interaction

1. The traveler selects one or two constraints. The same natural-language request enters both interfaces.
2. The assistant gives the flight details and relevant advice. After the same script plays, two context-aware follow-ups become available.
3. The traveler chooses a follow-up, then confirms the plan. A simulated thumbs-up acknowledges the prior reply; it triggers no transaction.
4. Messages retains the plan and route. The final CTA opens the prototype explanation.

Default voice captions fade at phrase pace. A persistent-caption accessibility preference preserves all spoken text. Browser audio is optional and never requests a microphone. The messaging and spoken scripts use identical wording; the diagram is an additional visual presentation of the route.

The reviewer introduction describes validation as proposed work. No completed customer research or measured conversion lift is claimed.
