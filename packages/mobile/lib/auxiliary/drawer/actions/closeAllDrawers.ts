import { drawers } from '../stores'

export function closeAllDrawers(): void {
    drawers.set([])
}
