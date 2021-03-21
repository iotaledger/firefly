<script lang="typescript">
    import { Transition } from 'shared/components'
    import { mnemonic } from 'shared/lib/app'
    import { newProfile } from 'shared/lib/profile'
    import { api, asyncRestoreBackup } from 'shared/lib/wallet'
    import { createEventDispatcher } from 'svelte'
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
                if (input.length === 81) {
                    importType = 'seed'
                    dispatch('next', { importType })
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
        <TextImport on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === ImportState.FileImport}
    <Transition>
        <FileImport on:next={_next} on:previous={_previous} {locale} {mobile} />
    </Transition>
{:else if state === ImportState.BackupPassword}
    <Transition>
        <BackupPassword on:next={_next} on:previous={_previous} {importType} {error} {locale} {mobile} {busy} />
    </Transition>
{:else if state === ImportState.Success}
    <Transition>
        <Success on:next={_next} on:previous={_previous} {importType} {locale} {mobile} />
    </Transition>
{/if}
