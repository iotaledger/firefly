
export function bindEvents(element, events) {
    const listeners = Object.entries(events).map(([event, handler]) => {        
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