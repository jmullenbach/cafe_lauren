Shows where a meal, recipe, pantry item or product match came from, and whether a person has signed off.
```jsx
<SuggestedTag />                          {/* dashed "Suggested" — nobody has looked yet */}
<SuggestedTag status="kept" by="Joe" />
<SuggestedTag status="edited" by="Lauren" />
<SuggestedTag status="draft" />           {/* AI-written recipe, not yet checked */}
```
- Rule: dashed = unreviewed. Never present AI output without this tag until a person acts on it.
