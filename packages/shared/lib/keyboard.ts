/**
 * Tabs through form inputs via enter key
 */
export function tabFormWithEnterKey(event: KeyboardEvent, document: Document, formName: string): void {
    if (event.key == 'Enter') {
        const inputs = document.forms[formName].getElementsByTagName('input')
        const active = document.activeElement
        for (let index = 0; index < inputs.length; index++) {
            if (active === inputs[index] && index < inputs.length) {
                inputs[index + 1].focus()
            }
        }
    }
}
