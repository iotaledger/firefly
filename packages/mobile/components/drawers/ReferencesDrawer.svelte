<script lang="ts">
    import { onMount } from 'svelte'

    import { Button, FontWeight, TextInput } from '@ui'

    import { localize } from '@core/i18n'
    import { getByteLengthOfString, MAX_METADATA_BYTES, MAX_TAG_BYTES } from '@core/utils'
    import { newTransactionDetails, updateNewTransactionDetails } from '@core/wallet'

    import { closeDrawer, DrawerId } from '@/auxiliary/drawer'

    let metadata, tag: string
    let error: string = undefined

    $: tag, metadata, validate()

    onMount(() => {
        metadata = $newTransactionDetails?.metadata ?? ''
        tag = $newTransactionDetails?.tag ?? ''
    })

    function handleConfirm(): void {
        updateNewTransactionDetails({ type: $newTransactionDetails.type, tag, metadata })
        closeDrawer(DrawerId.References)
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

<references-drawer class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
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
    <Button onClick={handleConfirm} classes="w-full" disabled={!!error}>
        {error ?? localize('actions.confirm')}
    </Button>
</references-drawer>
