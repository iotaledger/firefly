<script lang="ts">
    import { get } from 'svelte/store'
    import { localize } from '@core/i18n'
    import { newTransactionDetails, updateNewTransactionDetails } from '@core/wallet'
    import { Text, TextInput, Button, TextType, FontWeight } from 'shared/components'
    import { closePopup, openPopup } from '@auxiliary/popup'
    import { getByteLengthOfString } from '@core/utils'

    let { metadata, tag } = get(newTransactionDetails)

    let metadataInput: TextInput
    let tagInput: TextInput

    let metadataError = ''
    let tagError = ''

    $: metadata, (metadataError = '')
    $: tag, (tagError = '')

    function onCancel(): void {
        closePopup()
    }

    function onReview(): void {
        if (isValidMetadataAndTag()) {
            updateNewTransactionDetails({ metadata, tag })
            openPopup({
                type: 'sendConfirmation',
                overflow: true,
            })
        }
    }

    function isValidMetadataAndTag(): boolean {
        const validMetadata = validateLength(metadata, 8192)
        metadataError = validMetadata ? '' : localize('error.send.metadataTooLong')

        const validTag = validateLength(tag, 64)
        tagError = validTag ? '' : localize('error.send.tagTooLong')

        return validMetadata && validTag
    }

    function validateLength(value: string, byteLimit: number): boolean {
        if (getByteLengthOfString(value) > byteLimit) {
            return false
        } else {
            return true
        }
    }
</script>

<add-optional-metadata-popup class="flex flex-col space-y-4">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.addOptionalMetadata.title')}
    </Text>
    <Text type={TextType.h5} fontWeight={FontWeight.normal} classes="text-left" color="gray-600">
        {localize('popups.addOptionalMetadata.description')}
    </Text>
    <add-optional-metadata-form-inputs class="flex flex-col space-y-4">
        <TextInput
            bind:this={metadataInput}
            bind:value={metadata}
            error={metadataError}
            label={localize('general.metadata')}
            placeholder={localize('general.metadata') + ` (${localize('general.optional')})`}
            description={localize('tooltips.transactionDetails.outgoing.metadata')}
        />
        <TextInput
            bind:this={tagInput}
            bind:value={tag}
            error={tagError}
            label={localize('general.tag')}
            placeholder={localize('general.tag') + ` (${localize('general.optional')})`}
            description={localize('tooltips.transactionDetails.outgoing.tag')}
        />
    </add-optional-metadata-form-inputs>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancel}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" onClick={onReview}>
            {localize('actions.review')}
        </Button>
    </popup-buttons>
</add-optional-metadata-popup>
