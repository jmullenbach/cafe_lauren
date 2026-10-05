Checkbox with label — mirrors the `- [ ]` format used everywhere in Cafe Lauren (grocery list, ingredients, steps).
```jsx
<Checkbox checked={got} onChange={setGot} strike label={<><b>2 lbs</b> green beans</>} description="Pork chops + citrus chicken" />
```
- Bold the quantity inside the label. Use `strike` for shopping/ingredient lists; `size="l"` in cook mode.
