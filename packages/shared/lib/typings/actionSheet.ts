export interface ActionSheetOptions {
    title: string
    message?: string
    options: ActionSheetButton[]
}

export interface ActionSheetButton {
    title: string
    style?: 'DEFAULT' | 'DESTRUCTIVE' | 'CANCEL'
    icon?: string
}
