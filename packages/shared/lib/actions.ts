/**
 * Dispatch event on click outside of node
 * source: https://svelte.dev/repl/0ace7a508bd843b798ae599940a91783?version=3.16.7
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function clickOutside(node: any, options?: { includeScroll }): { destroy } {
    const handleClick = (event) => {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(new CustomEvent('clickOutside', node))
        }
    }

    const handleScroll = () => {
        node.dispatchEvent(new CustomEvent('clickOutside', node))
    }

    document.addEventListener('mousedown', handleClick, true)

    if (options?.includeScroll) {
        document.addEventListener('scroll', handleScroll, true)
    }

    return {
        destroy() {
            document.removeEventListener('click', handleClick, true)
            if (options?.includeScroll) {
                document.removeEventListener('scroll', handleScroll, true)
            }
        },
    }
}
