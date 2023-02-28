import { writable } from 'svelte/store'
import { DrawerId } from '../enums'
import { IDrawerState } from '../interfaces'

export const drawers = writable<IDrawerState[]>([])

export function addDrawerState(drawerState: IDrawerState): void {
    drawers.update(($drawers) => [...$drawers, drawerState])
}

export function updateDrawerState(drawerState: IDrawerState): void {
    drawers.update(($drawers) =>
        $drawers.map((drawer) => {
            if (drawer.id === drawerState.id) {
                return { ...drawer, props: { ...drawer.props, ...drawerState.props } }
            } else {
                return drawer
            }
        })
    )
}

export function removeDrawerState(drawerId: DrawerId): void {
    drawers.update(($drawers) => $drawers.filter((drawer) => drawer.id !== drawerId))
}
