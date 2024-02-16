<script lang="ts">
    import { Button, Text } from '@ui'
    import { errorLog } from '@core/error'
    import { localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'
    import { setClipboard } from '@core/utils'

    function onClearClick(): void {
        errorLog.set([])
        closePopup()
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

    function renderErrorMessage(message: string): string {
        if (message !== null && typeof message === 'object') {
            try {
                return JSON.stringify(message)
            } catch {
                return message
            }
        }
        return message
    }
</script>

<div class="mb-5">
    <Text type="h4">{localize('popups.errorLog.title')}</Text>
</div>
<div class="log overflow-y-auto">
    {#if $errorLog.length > 0}
        {#each $errorLog as error}
            <div class="mb-7">
                <Text type="p" secondary>{new Date(error.time).toUTCString()}</Text>
                <Text type="p">
                    {error.type}:
                    {renderErrorMessage(error.message)}
                </Text>
            </div>
        {/each}
    {:else}
        <Text type="p" secondary>{localize('popups.errorLog.empty')}</Text>
    {/if}
</div>
{#if $errorLog.length > 0}
    <div class="flex w-full justify-center pt-8 space-x-4">
        <Button classes="w-1/2" onClick={onClearClick}>{localize('actions.clear')}</Button>
        <Button classes="w-1/2" onClick={onCopyClick}>{localize('actions.copy')}</Button>
    </div>
{/if}

<style lang="scss">
    .log {
        max-height: 50vh;
        @screen md {
            max-height: 30vh;
        }
    }
</style>
