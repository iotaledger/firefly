import { DrawerId } from '../enums'
import { drawersStore } from '../stores'

export function closeDrawer(drawerId: DrawerId): void {
    drawersStore.update(($drawersStore) => $drawersStore.filter((drawer) => drawer.id !== drawerId))
}
