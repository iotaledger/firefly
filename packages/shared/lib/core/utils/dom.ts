/**
 * Updates the application path.
 */
export const goto = (path: string): void => {
    window.location.hash = path
}
