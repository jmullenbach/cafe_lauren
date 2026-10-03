Confirmation or focused task in a modal — e.g. keeping last week's unchecked items.
```jsx
<Dialog title="Keep 3 unchecked items?" description="Yogurt, cornstarch and limes weren't bought last week." onClose={close}
  actions={<><Button variant="ghost">Remove them</Button><Button>Keep and sort</Button></>} />
```
