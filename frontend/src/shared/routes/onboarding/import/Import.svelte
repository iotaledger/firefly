<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Import, TextImport, FileImport, BackupPassword, Success } from './views/'

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

    let state: ImportState = ImportState.Init
    let stateHistory = []

    const _next = (event) => {
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
                // Dummy
                if (input.includes('123')) {
                    importType = 'mnemonic'
                    nextState = ImportState.Success
                } else {
                    importType = 'seed'
                    dispatch('next', { importType })
                }
                break
            case ImportState.FileImport:
                const strongholdRegex = /\.(stronghold)$/i
                const seedvaultRegex = /\.(kdbx)$/i
                const { file, fileName } = params
                importFile = file
                if (seedvaultRegex.test(fileName)) {
                    importType = 'seedvault'
                } else if (strongholdRegex.test(fileName)) {
                    importType = 'stronghold'
                }
                nextState = ImportState.BackupPassword
                break
            case ImportState.BackupPassword:
                nextState = ImportState.Success
            case ImportState.Success:
                dispatch('next', { importType })
                break
        }
        if (nextState) {
            stateHistory.push(nextState)
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
    <Import on:next={_next} on:previous={_previous} {locale} {mobile} />
{:else if state === ImportState.TextImport}
    <TextImport on:next={_next} on:previous={_previous} {locale} {mobile} />
{:else if state === ImportState.FileImport}
    <FileImport on:next={_next} on:previous={_previous} {locale} {mobile} />
{:else if state === ImportState.BackupPassword}
    <BackupPassword on:next={_next} on:previous={_previous} {importType} {locale} {mobile} />
{:else if state === ImportState.Success}
    <Success on:next={_next} on:previous={_previous} {importType} {locale} {mobile} />
{/if}
