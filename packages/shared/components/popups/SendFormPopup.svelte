<script lang="typescript">
    import { Button, Text, RecipientInput, AssetAmountInput, ClosableInput, AddInputButton } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { FontWeight } from 'shared/components/Text.svelte'
    import { IAsset, Subject } from '@core/wallet'
    import { onMount } from 'svelte'

    export let asset: IAsset
    export let amount: string
    export let unit: string
    export let recipient: Subject
    export let metadata: string
    export let tag: string

    let assetAmountInput: AssetAmountInput
    let recipientInput: RecipientInput

    async function onSend(): Promise<void> {
        const valid = await validate()
        if (valid) {
            openPopup({
                type: 'sendConfirmation',
                props: {
                    asset,
                    amount,
                    unit,
                    recipient,
                    internal: false,
                    metadata,
                    tag,
                },
                overflow: true,
            })
        }
    }

    async function validate(): Promise<boolean> {
        try {
            await Promise.all([assetAmountInput?.validate(), recipientInput?.validate()])
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
            label={localize('general.metadata')}
            placeholder={localize('general.metadata')}
        />
        <ClosableInput
            bind:buttonElement={metadataButtonElement}
            bind:open={isTagInputOpen}
            bind:value={tag}
            label={localize('general.tag')}
            placeholder={localize('general.tag')}
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
        <Button classes="w-full" secondary onClick={onCancel}>
            {localize('actions.cancel')}
        </Button>
        <Button bind:buttonElement={sendButtonElement} classes="w-full" onClick={onSend}>
            {localize('actions.send')}
        </Button>
    </popup-buttons>
</send-form-popup>
