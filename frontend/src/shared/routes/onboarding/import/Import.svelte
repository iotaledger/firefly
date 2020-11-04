<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Import, TextImport, Success } from './views/'

    export let locale
    export let mobile

    enum ImportState {
        Init = 'init',
        TextImport = 'textImport',
        FileImport = 'fileImport',
        Success = 'Success',
    }

    const dispatch = createEventDispatcher()

    let importType

    // let state: ImportState = ImportState.Init
    let state: ImportState = ImportState.Init

    const _next = (event) => {
        let params = event.detail || {}
        switch (state) {
            case ImportState.Init:
                const { type } = params
                if (type === 'text') {
                    state = ImportState.TextImport
                } else if (type === 'file') {
                    state = ImportState.FileImport
                }
                break
            case ImportState.TextImport:
                const { input } = params
                // Dummy
                if (input.includes('123')) {
                    importType = 'mnemonic'
                    state = ImportState.Success
                } else {
                    importType = 'seed'
                    dispatch('next', { importType })
                }
                break
            case ImportState.Success:
                dispatch('next', { importType })
                break
        }
    }
</script>

{#if state === ImportState.Init}
    <Import on:next={_next} {locale} {mobile} />
{:else if state === ImportState.TextImport}
    <TextImport on:next={_next} {locale} {mobile} />
{:else if state === ImportState.Success}
    <Success type={importType} on:next={_next} {locale} {mobile} />
{/if}
