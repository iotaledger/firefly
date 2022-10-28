/**
 * Update application path
 */
export function goto(path: string): void {
    window.location.hash = path
}
