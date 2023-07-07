<script lang="ts">
    import { Button, ButtonSize, Text, TextType } from '@ui'

    import { errorLog } from '@core/error'
    import { localize } from '@core/i18n'
    import { setClipboard } from '@core/utils'

    function onClearClick(): void {
        errorLog.set([])
    }

    function onCopyClick(): void {
        const str = []

        for (const err of $errorLog) {
            str.push(new Date(err.time).toUTCString())
            str.push(`${err.type}: ${err.message}`)
            str.push('')
        }

        setClipboard(str.join('\r\n'))
    }
</script>

<error-log-view class="flex flex-col justify-between space-y-4 flex-1 relative">
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
        <div class="flex w-full justify-center space-x-4">
            <Button size={ButtonSize.Medium} classes="w-full" onClick={onClearClick}>
                {localize('actions.clear')}
            </Button>
            <Button size={ButtonSize.Medium} classes="w-full" onClick={onCopyClick}>
                {localize('actions.copy')}
            </Button>
        </div>
    {/if}
</error-log-view>

<style lang="scss">
    .log {
        max-height: calc(100vh - 200px);
    }
</style>
