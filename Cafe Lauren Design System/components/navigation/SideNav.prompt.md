Primary app navigation, one item per stage of the weekly cycle.
```jsx
<SideNav value="week" onChange={go} header={<Wordmark/>} items={[{id:'week',label:'This week',icon:'calendar-days'},{id:'list',label:'Grocery list',icon:'shopping-basket',badge:42}]} />
```
