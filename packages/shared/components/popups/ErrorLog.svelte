<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { errorLog } from 'shared/lib/errors'
    import { closePopup } from 'shared/lib/popup'
    import { setClipboard } from 'shared/lib/utils'
    import { Locale } from 'shared/lib/typings/i18n'
    import { Error } from 'shared/lib/typings/error'

    export let locale: Locale

    const handleClearClick = () => {
        errorLog.set([])
        closePopup()
    }

    const handleCopyClick = () => {
        const str = []

        for (const err: Error of $errorLog) {
            str.push(new Date(err.time).toUTCString())
            str.push(`${err.type}: ${err.message}`)
            str.push('')
        }

        setClipboard(str.join('\r\n'))
    }
</script>

<style type="text/scss">
    .log {
        max-height: 58vh;
        @screen md {
            max-height: 30vh;
        }
    }
</style>

<div class="mb-5">
    <Text type="h4">{locale('popups.errorLog.title')}</Text>
</div>
<div class="log overflow-y-auto">
    {#if $errorLog.length > 0}
        {#each $errorLog as error}
            <div class="mb-7">
                <Text type="p" secondary>{new Date(error.time).toUTCString()}</Text>
                <Text type="p">
                    {error.type}:
                    {error.message}
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
