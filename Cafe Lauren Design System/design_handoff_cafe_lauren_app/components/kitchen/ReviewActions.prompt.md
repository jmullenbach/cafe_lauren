Keep / Swap / Not this — attach to every AI suggestion so a person always decides.
```jsx
<ReviewActions onReject={askWhy} onSwap={openSwap} onApprove={keep} />
<ReviewActions size="s" onEdit={edit} onApprove={ok} approveLabel="Looks right" />
```
- Reject should always open a "why" sheet (ChoiceChips + Input) — the reason goes back to Café.
