Bottom sheet for focused phone tasks — swap a meal, say why you rejected it, add a recipe, chat with Café.
```jsx
<Sheet open={open} onClose={close} title="Swap Wednesday" subtitle="Tell Café what you'd rather have"
  footer={<Button fullWidth variant="accent">Use this</Button>}>…</Sheet>
```
- The parent must be `position: relative` (the phone screen). Primary action goes last / full width.
