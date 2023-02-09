import { DrawerId } from '../enums'
import { drawersStore } from '../stores'
import { DrawerProps } from '../types'

export function openDrawer(drawerId: DrawerId, props?: DrawerProps): void {
    const newDrawer = { id: drawerId, props }
    drawersStore.update(($drawersStore) => [...$drawersStore, newDrawer])
}
