<script lang="typescript">
    import { Transition } from 'shared/components'
    import { mnemonic } from 'shared/lib/app'
    import { getMigrationData } from 'shared/lib/migration'
    import { newProfile } from 'shared/lib/profile'
    import { api, asyncRestoreBackup } from 'shared/lib/wallet'
    import { createEventDispatcher } from 'svelte'
    import { BackupPassword, FileImport, Import, Success, TextImport } from './views/'
    import { Electron } from 'shared/lib/electron'

    export let locale
    export let mobile

    let isGettingMigrationData = false

    enum ImportState {
        Init = 'init',
        TextImport = 'textImport',
        FileImport = 'fileImport',
        BackupPassword = 'backupPassword',
        Success = 'Success',
    }

    const dispatch = createEventDispatcher()

    let importType
    let importFile
    let importFilePath
    let busy = false

    let error = ''

    let state: ImportState = ImportState.Init
    let stateHistory = []

    const _next = async (event) => {
        let nextState
        let params = event.detail || {}
        switch (state) {
            case ImportState.Init:
                const { type } = params
                if (type === 'text') {
                    nextState = ImportState.TextImport
                } else if (type === 'file') {
                    nextState = ImportState.FileImport
                }
                break
            case ImportState.TextImport:
                const { input } = params
                error = ''

                if (input.length === 81) {
                    isGettingMigrationData = true

                    getMigrationData(input)
                        .then(() => {
                            isGettingMigrationData = false

                            importType = 'seed'
                            dispatch('next', { importType })
                        })
                        .catch((error) => {
                            error = locale('views.migrate.problemRestoringWallet')
                            isGettingMigrationData = false
                        })
                } else {
                    importType = 'mnemonic'
                    mnemonic.set(input.split(' '))
                    nextState = ImportState.Success
                }
                break
            case ImportState.FileImport:
                const strongholdRegex = /\.(stronghold)$/i
                const seedvaultRegex = /\.(kdbx)$/i
                const { file, fileName, filePath } = params
                importFile = file
                importFilePath = filePath

                if (seedvaultRegex.test(fileName)) {
                    importType = 'seedvault'
                } else if (strongholdRegex.test(fileName)) {
                    importType = 'stronghold'
                }
                nextState = ImportState.BackupPassword
                break

            case ImportState.BackupPassword:
                const { password } = params
                busy = true

                error = ''

                try {
                    if (importType === 'seedvault') {
                        // Instead of using "busy", we are deliberately using "isGettingMigrationData"
                        // We do not want to display the spinner in FileImport if stronghold is being imported.
                        isGettingMigrationData = true

                        const legacySeed = await Electron.importLegacySeed(importFile, password).catch((error) => {
                            throw error
                        })

                        if (legacySeed) {
                            await getMigrationData(legacySeed)
                        }

                        isGettingMigrationData = false
                    } else {
                        await asyncRestoreBackup(importFilePath, password)
                        $newProfile.lastStrongholdBackupTime = new Date()
                    }

                    nextState = ImportState.Success
                } catch (err) {
                    if (err && err.name === 'KdbxError' && err.code === 'InvalidKey') {
                        error = locale('views.migrate.incorrectSeedVaultPassword')
                    } else {
                        error = locale(err.error)
                    }
                } finally {
                    busy = false
                    isGettingMigrationData = false
                }
                break

            case ImportState.Success:
                dispatch('next', { importType })
                break
        }
        if (nextState) {
            stateHistory.push(state)
            stateHistory = stateHistory
            state = nextState
        }
    }
    const _previous = () => {
        let prevState = stateHistory.pop()
        if (prevState) {
            state = prevState
        } else {
            dispatch('previous')
        }
    }
</script>

{#if state === ImportState.Init}
    <Transition>
        <Import on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === ImportState.TextImport}
    <Transition>
        <TextImport {isGettingMigrationData} on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === ImportState.FileImport}
    <Transition>
        <FileImport on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === ImportState.BackupPassword}
    <Transition>
        <BackupPassword
            on:next={_next}
            on:previous={_previous}
            {isGettingMigrationData}
            {importType}
            {error}
            {locale}
            {mobile}
            {busy} />
    </Transition>
{:else if state === ImportState.Success}
    <Transition>
        <Success on:next={_next} on:previous={_previous} {importType} {locale} {mobile} />
    </Transition>
{/if}
