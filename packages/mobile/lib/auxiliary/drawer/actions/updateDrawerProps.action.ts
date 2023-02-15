import { DrawerId } from '../enums'
import { drawersStore } from '../stores'
import { DrawerProps } from '../types'

export function updateDrawerProps(drawerId: DrawerId, props?: DrawerProps): void {
    drawersStore.update(($drawersStore) =>
        $drawersStore.map((drawer) => {
            if (drawer.id === drawerId) {
                return { ...drawer, props }
            } else {
                return drawer
            }
        })
    )
}
