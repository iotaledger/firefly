<script context="module" lang="typescript">
    export enum ImportType {
        Seed = 'seed',
        Mnemonic = 'mnemonic',
        File = 'file',
        SeedVault = 'seedvault',
        Stronghold = 'stronghold',
    }
</script>

<script lang="typescript">
    import { Transition } from 'shared/components'
    import { mnemonic } from 'shared/lib/app'
    import { newProfile } from 'shared/lib/profile'
    import { asyncRestoreBackup } from 'shared/lib/wallet'
    import { createEventDispatcher, setContext } from 'svelte'
    import { get, Writable, writable } from 'svelte/store'
    import { BackupPassword, FileImport, Import, Success, TextImport } from './views/'

    export let locale
    export let mobile

    enum ImportState {
        Init = 'init',
        TextImport = 'textImport',
        FileImport = 'fileImport',
        BackupPassword = 'backupPassword',
        Success = 'Success',
    }

    const dispatch = createEventDispatcher()

    let importType: Writable<ImportType> = writable(null)
    setContext<Writable<ImportType>>('importType', importType)

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
                importType.set(type)
                if (type === ImportType.Seed || type === ImportType.Mnemonic) {
                    nextState = ImportState.TextImport
                } else if (type === ImportType.File) {
                    nextState = ImportState.FileImport
                }
                break
            case ImportState.TextImport:
                const { input } = params
                if (get(importType) === ImportType.Seed) {
                    dispatch('next', { importType: get(importType) })
                } else if (get(importType) === ImportType.Mnemonic) {
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
                    importType.set(ImportType.SeedVault)
                } else if (strongholdRegex.test(fileName)) {
                    importType.set(ImportType.Stronghold)
                }
                nextState = ImportState.BackupPassword
                break

            case ImportState.BackupPassword:
                const { password } = params
                busy = true

                try {
                    await asyncRestoreBackup(importFilePath, password)
                    $newProfile.lastStrongholdBackupTime = new Date()
                    nextState = ImportState.Success
                } catch (err) {
                    error = locale(err.error)
                } finally {
                    busy = false
                }
                break

            case ImportState.Success:
                dispatch('next', { importType: get(importType) })
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
        <TextImport on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === ImportState.FileImport}
    <Transition>
        <FileImport on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === ImportState.BackupPassword}
    <Transition>
        <BackupPassword on:next={_next} on:previous={_previous} {error} {locale} {mobile} {busy} />
    </Transition>
{:else if state === ImportState.Success}
    <Transition>
        <Success on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{/if}
