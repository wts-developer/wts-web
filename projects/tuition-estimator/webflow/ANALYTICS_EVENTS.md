# Tuition Savings Calculator: analytics events

The calculator widget pushes structured interaction events into
`window.dataLayer` whenever Google Tag Manager (or anything else that
defines a dataLayer) is present on the host page. On wts.edu that is the
existing GTM container, so these events are available to GTM, GA4, and
WebFX with no changes to the embed.

The widget itself makes no analytics network calls, sets no cookies, and
collects no personal data; it only announces interactions. On pages
without a dataLayer (the mockups, the standalone demo) the pushes are a
silent no-op.

## Event shape

Every push has the same envelope:

```js
{
  event: "wts_tuition_savings_calculator",
  estimator_action: "<action>",
  ...action-specific parameters
}
```

## Actions

| `estimator_action` | Fires when | Parameters |
|---|---|---|
| `program_select` | A program card is clicked, or a cross-modality chip jumps to the counterpart program (`source: "modality_chip"`) | `program` (config key, e.g. `MATS`, `MDivCampus`), `modality` (`online` / `campus` / `advanced`), optional `source` |
| `modality_select` | A category tab is clicked | `modality` (`online` / `campus` / `advanced`) |
| `scholarship_select` | A scholarship radio is changed | `scholarship` (option id, e.g. `match`), `program` |
| `support_amount` | An outside-support amount is committed: typed (on blur), a quick-amount button, or the Maximum Matching Scholarship button | `amount` (number), `source` (`typed` / `quick` / `max_match`), `program` |
| `start_term` | The start-term dropdown changes | `term` (`YYYY-MM`), `program` |
| `contact_click` | The Contact Us button under the results card is clicked | `program`, `estimated_net` (the estimated cost after support shown at click time, as a number) |

## Suggested GTM wiring (for WebFX)

1. **Trigger**: Custom Event, event name `wts_tuition_savings_calculator`.
2. **Variables**: Data Layer Variables for `estimator_action`, `program`,
   `modality`, `scholarship`, `amount`, `source`, `term`, and
   `estimated_net`.
3. **Tag**: one GA4 Event tag using `estimator_action` as the event name
   (or keep the umbrella name and map `estimator_action` as a parameter),
   forwarding the variables above.

## Notes

- The mockup pages deliberately disable the captured GTM/GA tags so UAT
  traffic never lands in the production Google Analytics property; test
  these events on the production embed or by defining a `dataLayer`
  array manually and inspecting pushes.
- Event names and parameters are part of the widget source
  (`src/calculator.js`, the `track()` helper); changes to the schema
  should update this document in the same PR.
