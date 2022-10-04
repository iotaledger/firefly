import { MenuItem, MenuItemConstructorOptions } from 'electron'
import { menuState } from '../'

export function createRoleMenuItem(role: NonNullable<MenuItem['role']>, label?: string): MenuItemConstructorOptions {
    return {
        label: label ?? menuState.strings[role],
        role,
    }
}
