
export function bindEvents(element, events) {
    console.log('Element', element);
    console.log('Events', events);

    const listeners = Object.entries(events).map(([event, handler]) => {
        console.log('Event', event);
        console.log('Handler', handler);
        
        const listener = element.addEventListener(event, handler)

        return [event, listener]
    })

    return {
        destroy() {
            listeners.forEach(([event, listener]) => {
                element.removeEventListener(event, listener)
            })
        }
    }
}