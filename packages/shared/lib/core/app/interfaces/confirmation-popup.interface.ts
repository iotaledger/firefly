export interface IConfirmationPopup {
    open: boolean
    title: string
    description: string
    callback: () => void
}
