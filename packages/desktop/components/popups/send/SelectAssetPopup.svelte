<script lang="ts">
    import { onMount } from 'svelte'
    import { Button, FontWeight, Text, TextType } from '@ui'
    import { localize } from '@core/i18n'
    import { resetNewTokenTransactionDetails } from '@core/wallet'
    import { closePopup } from '@auxiliary/popup'
    import { sendRouter } from '@desktop/routers'

    function onCancelClick(): void {
        $sendRouter.reset()
        closePopup()
    }

    function onContinueClick(): void {
        $sendRouter.next()
    }

    onMount(() => {
        resetNewTokenTransactionDetails()
    })
</script>

<select-asset-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.transaction.title')}
    </Text>
    <send-form-inputs class="flex flex-col space-y-4">
        <!--        <NetworkInput bind:this={networkInput} bind:networkAddress showLayer2={features?.network?.layer2?.enabled} />-->
        <!--        <RecipientInput bind:this={recipientInput} bind:recipient {isLayer2} />-->
        <!--        <optional-inputs class="flex flex-row flex-wrap gap-4">-->
        <!--            <OptionalInput-->
        <!--                    bind:this={tagInput}-->
        <!--                    bind:value={tag}-->
        <!--                    label={localize('general.tag')}-->
        <!--                    description={localize('tooltips.optionalInput')}-->
        <!--            />-->
        <!--            {#if !isLayer2}-->
        <!--                <OptionalInput-->
        <!--                        bind:this={metadataInput}-->
        <!--                        bind:value={metadata}-->
        <!--                        label={localize('general.metadata')}-->
        <!--                        description={localize('tooltips.optionalInput')}-->
        <!--                />-->
        <!--            {/if}-->
        <!--        </optional-inputs>-->
    </send-form-inputs>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancelClick}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" onClick={onContinueClick}>
            {localize('actions.continue')}
        </Button>
    </popup-buttons>
</select-asset-popup>
