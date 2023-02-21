import { DrawerId } from '../enums'
import { drawersStore } from '../stores'
import { DrawerProps } from '../types'

export function updateDrawerProps(drawerId: DrawerId, newProps?: DrawerProps): void {
    drawersStore.update(($drawersStore) =>
        $drawersStore.map((drawer) => {
            if (drawer.id === drawerId) {
                return { ...drawer, props: { ...drawer.props, ...newProps } }
            } else {
                return drawer
            }
        })
    )
}
