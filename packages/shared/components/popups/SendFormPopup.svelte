<script lang="typescript">
    import { Button, Text, RecipientInput, AssetAmountInput, ClosableInput, AddInputButton } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { FontWeight } from 'shared/components/Text.svelte'
    import { newTransactionDetails, updateNewTransactionDetails } from '@core/wallet'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { getByteLengthOfString } from '@lib/utils/getByteLengthOfString'

    let { asset, amount, unit, recipient, metadata, tag } = get(newTransactionDetails)
    let assetAmountInput: AssetAmountInput
    let recipientInput: RecipientInput

    async function onSend(): Promise<void> {
        const valid = await validate()
        if (valid) {
            updateNewTransactionDetails({ asset, amount, unit, recipient, metadata, tag })
            openPopup({
                type: 'sendConfirmation',
                overflow: true,
            })
        }
    }

    async function validate(): Promise<boolean> {
        try {
            await Promise.all([
                assetAmountInput?.validate(),
                recipientInput?.validate(),
                validateTag(),
                validateMetadata(),
            ])
            return true
        } catch (error) {
            console.error('Error: ', error)
            return false
        }
    }

    function onCancel(): void {
        closePopup()
    }

    let metadataButtonElement: HTMLButtonElement
    let isMetadataInputOpen = false
    function openMetadataInput() {
        isMetadataInputOpen = true
    }

    let tagButtonElement: HTMLButtonElement
    let isTagInputOpen = false
    function openTagInput() {
        isTagInputOpen = true
    }

    let tagError: string = ''
    function validateTag(): Promise<void> {
        tagError = ''
        if (getByteLengthOfString(tag) > 64) {
            tagError = localize('error.send.tagTooLong')
            return Promise.reject(tagError)
        }
    }

    let metadataError: string = ''
    function validateMetadata(): Promise<void> {
        metadataError = ''
        if (getByteLengthOfString(metadata) > 8192) {
            metadataError = localize('error.send.metadataTooLong')
            return Promise.reject(metadataError)
        }
    }

    let sendButtonElement: HTMLButtonElement
    onMount(() => {
        if (metadata) {
            openMetadataInput()
        }
        if (tag) {
            openTagInput()
        }
        if (amount && recipient) {
            sendButtonElement.focus()
        }
    })
</script>

<send-form-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type="h3" fontWeight={FontWeight.semibold} classes="text-left">{localize('popups.sendForm.title')}</Text>
    <send-form-inputs class="flex flex-col space-y-4">
        <AssetAmountInput bind:this={assetAmountInput} bind:asset bind:amount bind:unit />
        <RecipientInput bind:this={recipientInput} bind:recipient />
        <ClosableInput
            bind:buttonElement={metadataButtonElement}
            bind:open={isMetadataInputOpen}
            bind:value={metadata}
            error={metadataError}
            label={localize('general.metadata')}
            placeholder={localize('general.metadata')}
            fontSize="15"
            fontWeight={FontWeight.medium}
        />
        <ClosableInput
            bind:buttonElement={tagButtonElement}
            bind:open={isTagInputOpen}
            bind:value={tag}
            error={tagError}
            label={localize('general.tag')}
            placeholder={localize('general.tag')}
            fontSize="15"
            fontWeight={FontWeight.medium}
        />
        {#if !isMetadataInputOpen || !isTagInputOpen}
            <optional-input-buttons class="flex flex-row space-x-4">
                <AddInputButton
                    bind:buttonElement={metadataButtonElement}
                    bind:open={isMetadataInputOpen}
                    text={localize('general.metadata')}
                    onClick={openMetadataInput}
                />
                <AddInputButton
                    bind:buttonElement={tagButtonElement}
                    bind:open={isTagInputOpen}
                    text={localize('general.tag')}
                    onClick={openTagInput}
                />
            </optional-input-buttons>
        {/if}
    </send-form-inputs>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancel}>
            {localize('actions.cancel')}
        </Button>
        <Button bind:buttonElement={sendButtonElement} classes="w-full" onClick={onSend}>
            {localize('actions.send')}
        </Button>
    </popup-buttons>
</send-form-popup>
