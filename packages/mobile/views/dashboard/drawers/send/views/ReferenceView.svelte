<script lang="typescript">
    import { localize } from '@core/i18n'
    import { getByteLengthOfString, MAX_METADATA_BYTES, MAX_TAG_BYTES } from '@core/utils'
    import { newTransactionDetails, updateNewTransactionDetails } from '@core/wallet'
    import { Button, FontWeight, TextInput } from 'shared/components'
    import { onMount } from 'svelte'
    import { sendRouter } from '../../../../../lib/routers'

    let metadata, tag: string
    let error: string = undefined

    $: tag, metadata, validate()

    onMount(() => {
        metadata = $newTransactionDetails?.metadata ?? ''
        tag = $newTransactionDetails?.tag ?? ''
    })

    function onContinueClick(): void {
        updateNewTransactionDetails({ type: $newTransactionDetails.type, tag, metadata })
        $sendRouter.next()
    }

    function validate(): void {
        error = validateReference(metadata, MAX_METADATA_BYTES, localize('error.send.metadataTooLong'))
        if (!error) {
            error = validateReference(tag, MAX_TAG_BYTES, localize('error.send.tagTooLong'))
        }
    }

    function validateReference(value: string, byteLimit: number, errorMessage: string): string {
        if (getByteLengthOfString(value) > byteLimit) {
            return errorMessage
        }
    }
</script>

<div class="w-full overflow-y-auto flex flex-col flex-auto h-1 justify-between">
    <div class="flex flex-row flex-1 justify-center relative">
        <div class="w-full flex-col space-y-2">
            <TextInput
                slot="input"
                bind:value={metadata}
                label={localize('general.metadata')}
                fontWeight={FontWeight.medium}
                placeholder={localize('general.metadata')}
            />
            <TextInput
                slot="input"
                bind:value={tag}
                label={localize('general.tag')}
                fontWeight={FontWeight.medium}
                placeholder={localize('general.tag')}
            />
        </div>
    </div>
    <Button onClick={onContinueClick} classes="w-full" disabled={!!error}>
        {error ?? localize('actions.continue')}
    </Button>
</div>
