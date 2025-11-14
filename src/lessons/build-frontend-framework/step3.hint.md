## Hint

For className:
- Check if the prop key is 'className'
- Use `setAttribute('class', value)` instead

For event handlers:
- Check if the prop key starts with 'on' (like 'onClick', 'onSubmit')
- Extract the event name by removing 'on' and lowercasing (onClick -> 'click')
- Use `addEventListener(eventName, handler)` to attach the event

Remember to handle regular props as before for other attributes!

