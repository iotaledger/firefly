import { DrawerId } from '../enums'
import { addDrawerState } from '../stores'
import { DrawerProps } from '../types'

export function openDrawer(options: { id: DrawerId; props?: DrawerProps }): void {
    const { id, props } = options ?? {}
    addDrawerState({
        id,
        ...(props && { props }),
    })
}
