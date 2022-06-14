export function isNumberLetterOrPunctuation(key: string): boolean {
    if (key.length !== 1) {
        return false
    }
    const code = key.charCodeAt(0)
    return (code >= 48 && code <= 57) || (code >= 65 && code <= 122)
}
