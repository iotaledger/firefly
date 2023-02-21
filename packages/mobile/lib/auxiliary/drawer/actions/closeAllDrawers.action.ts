import { drawersStore } from '../stores'

export function closeAllDrawers(): void {
    drawersStore.set([])
}
