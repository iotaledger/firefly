<script lang="ts">
    import { get } from 'svelte/store'
    import { localize } from '@core/i18n'
    import { newTransactionDetails, updateNewTransactionDetails } from '@core/wallet'
    import { Text, TextInput, Button, TextType, FontWeight } from 'shared/components'
    import { closePopup, openPopup } from '@lib/popup'
    import { getByteLengthOfString } from '@lib/utils/getByteLengthOfString'

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

<add-optional-metadata-popup>
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.addOptionalMetadata.title')}
    </Text>
    <Text type={TextType.h4} fontWeight={FontWeight.semibold} classes="text-left" color="gray-600">
        {localize('popups.addOptionalMetadata.title')}
    </Text>
    <add-optional-metadata-form-inputs>
        <TextInput
            bind:this={metadataInput}
            bind:value={metadata}
            error={metadataError}
            label={localize('general.metadata')}
            description={localize('tooltips.optionalInput')}
        />
        <TextInput
            bind:this={tagInput}
            bind:value={tag}
            error={tagError}
            label={localize('general.tag')}
            description={localize('tooltips.optionalInput')}
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
