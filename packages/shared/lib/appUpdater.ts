import { writable } from 'svelte/store'

type VersionDetails = {
    upToDate: boolean
    currentVersion: string
    newVersion: string
    newVersionReleaseDate: Date
    changelog: string
}

export const versionDetails = writable<VersionDetails>({
    upToDate: true,
    currentVersion: '',
    newVersion: '',
    newVersionReleaseDate: new Date(),
    changelog: ''
})

export const updateProgress = writable<number>(0)
export const updateBusy = writable<boolean>(false)
export const updateComplete = writable<boolean>(false)

window['Electron'].onEvent('version-details', (nativeVersionDetails) => {
    versionDetails.set(nativeVersionDetails);
})

window['Electron'].onEvent('version-progress', (nativeVersionProgress) => {
    updateProgress.set(nativeVersionProgress.percent)
})

window['Electron'].onEvent('version-complete', (nativeVersionComplete) => {
    updateBusy.set(false)
    updateComplete.set(true)
})

window['Electron'].onEvent('version-error', (nativeVersionError) => {
    console.log(nativeVersionError)
})

export function updateDownload(): void {
    updateProgress.set(0)
    updateBusy.set(true)
    updateComplete.set(false)
    window['Electron'].updateDownload()
}

export function updateCancel(): void {
    window['Electron'].updateCancel()
    updateProgress.set(0)
    updateBusy.set(false)
    updateComplete.set(false)
}

export function updateInstall(): void {
    window['Electron'].updateInstall()
}

export async function refreshVersionDetails(): Promise<void> {
    versionDetails.set(await window['Electron'].getVersionDetails())
}