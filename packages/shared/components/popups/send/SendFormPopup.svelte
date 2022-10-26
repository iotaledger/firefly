<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Button, Text, FontWeight, TextType, Tabs } from 'shared/components'
    import { closePopup, openPopup } from '@auxiliary/popup'
    import { SendNftForm, SendTokenForm } from './forms'
    import { setToNewNftTransactionDetails, setToNewTokenTransactionDetails } from '@core/wallet'

    enum SendForm {
        SendToken = 'general.sendToken',
        SendNft = 'general.sendNft',
    }
    const tabs: SendForm[] = [SendForm.SendToken, SendForm.SendNft]
    let activeTab: SendForm = SendForm.SendToken

    let sendTokenForm: SendTokenForm
    let sendNftForm: SendNftForm

    $: selectedForm = activeTab === SendForm.SendToken ? sendTokenForm : sendNftForm
    $: {
        if (activeTab === SendForm.SendToken) {
            setToNewTokenTransactionDetails()
        } else {
            setToNewNftTransactionDetails()
        }
    }

    async function onContinue(): Promise<void> {
        const valid = await selectedForm.handleFormSubmit()
        if (valid) {
            openPopup({
                type: 'sendConfirmation',
                overflow: true,
            })
        }
    }

    function onCancel(): void {
        closePopup()
    }
</script>

<send-form-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('general.sendAsset')}
    </Text>
    <Tabs bind:activeTab {tabs} />
    <send-form-inputs class="flex flex-col space-y-4">
        {#if activeTab === SendForm.SendToken}
            <SendTokenForm bind:this={sendTokenForm} />
        {:else}
            <SendNftForm bind:this={sendNftForm} />
        {/if}
    </send-form-inputs>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancel}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" onClick={onContinue}>
            {localize('actions.send')}
        </Button>
    </popup-buttons>
</send-form-popup>
