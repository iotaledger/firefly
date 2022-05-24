/**
 * The application's version details, used in
 * checking and downloading updates.
 */
export type IAppVersionDetails = {
    upToDate: boolean
    currentVersion: string
    newVersion: string
    newVersionReleaseDate: Date
    changelog: string
}
