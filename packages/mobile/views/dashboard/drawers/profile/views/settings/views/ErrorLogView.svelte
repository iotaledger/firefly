<script lang="typescript">
    import { errorLog } from '@core/error'
    import { localize } from '@core/i18n'
    import { setClipboard } from '@core/utils'
    import { Button, Text, TextType } from 'shared/components'

    function handleClearClick(): void {
        errorLog.set([])
    }

    function handleCopyClick(): void {
        const str = []

        for (const err of $errorLog) {
            str.push(new Date(err.time).toUTCString())
            str.push(`${err.type}: ${err.message}`)
            str.push('')
        }

        setClipboard(str.join('\r\n'))
    }
</script>

<div class="flex flex-col justify-between space-y-4 flex-1 relative">
    <div class="log flex flex-col overflow-y-auto flex-1 space-y-7">
        {#if $errorLog.length > 0}
            {#each $errorLog as error}
                <div>
                    <Text type={TextType.p} secondary>{new Date(error.time).toUTCString()}</Text>
                    <Text type={TextType.p}>
                        {error.type}:
                        {error.message}
                    </Text>
                </div>
            {/each}
        {:else}
            <Text type={TextType.p} secondary>{localize('popups.errorLog.empty')}</Text>
        {/if}
    </div>
    {#if $errorLog.length > 0}
        <div class="flex flex-col space-y-4 w-full">
            <Button outline classes="w-full" onClick={handleClearClick}>
                {localize('actions.clear')}
            </Button>
            <Button classes="w-full" onClick={handleCopyClick}>
                {localize('actions.copy')}
            </Button>
        </div>
    {/if}
</div>

<style type="text/scss">
    .log {
        max-height: calc(100vh - 200px);
    }
</style>
