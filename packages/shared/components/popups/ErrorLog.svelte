<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { errorLog } from 'shared/lib/events'
    import { setClipboard } from 'shared/lib/helpers'
    import { closePopup } from 'shared/lib/popup'

    export let locale

    const handleClearClick = () => {
        errorLog.set([])
        closePopup()
    }

    const handleCopyClick = () => {
        const str = []

        for (const err of $errorLog) {
            str.push(new Date(err.time).toUTCString())
            str.push(`${err.type ?? 'EmptyType'}: ${err.message ? locale(err.message) : 'Missing error message'}`)
            str.push("")
        }

        setClipboard(str.join('\r\n'))
    }
</script>

<style>
    .history {
        max-height: 30vh;
    }
</style>

<div class="mb-5">
    <Text type="h4">{locale('popups.errorLog.title')}</Text>
</div>
<div class="history overflow-y-auto">
    {#if $errorLog.length > 0}
        {#each $errorLog as error}
            <div class="mb-7">
                <Text type="p" secondary>{new Date(error.time).toUTCString()}</Text>
                <Text type="p">
                    {error.type ?? 'EmptyType'}:
                    {error.message ? locale(error.message) : 'Missing error message'}
                </Text>
            </div>
        {/each}
    {:else}
        <Text type="p" secondary>{locale('popups.errorLog.empty')}</Text>
    {/if}
</div>
{#if $errorLog.length > 0}
    <div class="flex w-full justify-center pt-8 space-x-4">
        <Button classes="w-1/2" onClick={() => handleClearClick()}>{locale('actions.clear')}</Button>
        <Button classes="w-1/2" onClick={() => handleCopyClick()}>{locale('actions.copy')}</Button>
    </div>
{/if}
