<script lang="ts">
    import { get } from 'svelte/store'
    import { localize } from '@core/i18n'
    import { AssetAmountInput, Button, Error, NetworkInput, OptionalInput, RecipientInput } from '@ui'
    import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
    import { prepareOutput, selectedWallet } from '@core/wallet'
    import { Output } from '@iota/sdk/out/types'
    import {
        getDefaultTransactionOptions,
        getOutputParameters,
        NewTokenTransactionDetails,
        newTransactionDetails,
        NewTransactionType,
        setNewTransactionDetails,
        TokenStandard,
    } from '@core/wallet'
    import features from '@features/features'
    import { activeProfile } from '@core/profile'
    import { handleError } from '@core/error/handlers'
    import { MAX_METADATA_BYTES, MAX_TAG_BYTES } from '@core/utils'
    import { OptionalInputType } from '@core/wallet/utils/send/sendUtils'

    export let validateInputs: (
        inputValidations?: any,
        optionalInputValidations?: {
            validate?: (promise: Promise<unknown>) => Promise<void>
            value: string
            optionalInputType: OptionalInputType
            byteLimit: number
            errorMessage: string
        }[]
    ) => Promise<boolean> = () => Promise.resolve(true)
    export let isTransferring: boolean = false

    const transactionDetails = get(newTransactionDetails)
    const { layer2Parameters, disableAssetSelection } = transactionDetails as NewTokenTransactionDetails

    let { rawAmount, asset, unit, recipient, tag, metadata } = transactionDetails as NewTokenTransactionDetails
    let iscpChainAddress = layer2Parameters?.networkAddress
    let isPreparingOutput = false
    let assetAmountInput: AssetAmountInput
    let networkInput: NetworkInput
    let recipientInput: RecipientInput
    let metadataInput: OptionalInput
    let tagInput: OptionalInput

    $: rawAmount,
        asset,
        recipient,
        unit,
        tag,
        metadata,
        setNewTransactionDetails({
            type: NewTransactionType.TokenTransfer,
            rawAmount,
            asset,
            recipient,
            unit,
            tag,
            metadata,
            layer2Parameters: isLayer2Transfer
                ? { networkAddress: iscpChainAddress, senderAddress: $selectedWallet.depositAddress }
                : null,
            disableAssetSelection,
        })

    $: isBaseTokenTransfer = asset?.metadata?.standard === TokenStandard.BaseToken
    $: isLayer2Transfer = !!iscpChainAddress
    $: showLayer2 = features?.network?.layer2?.enabled && ($activeProfile.isDeveloperProfile || isBaseTokenTransfer)
    $: asset, !showLayer2 && networkInput?.reset()

    async function buildPreparedOutput(): Promise<{ preparedOutput: Output; allotmentManaCost: number }> {
        try {
            const details = get(newTransactionDetails)
            isPreparingOutput = true
            const outputParams = await getOutputParameters(details)
            const preparedOutput = await prepareOutput($selectedWallet.id, outputParams, getDefaultTransactionOptions())
            const prepareTx = await $selectedWallet.prepareSendOutputs([preparedOutput], getDefaultTransactionOptions())
            const allotmentManaCost =
                prepareTx?._preparedData?.transaction?.allotments?.reduce((acc, { mana }) => acc + mana, 0) || 0
            return {
                preparedOutput,
                allotmentManaCost,
            }
        } catch (err) {
            handleError(err)
        } finally {
            isPreparingOutput = false
        }
    }

    async function onContinueClick(): Promise<void> {
        const valid = await validateInputs(
            [(): Promise<void> => assetAmountInput?.validate(false), recipientInput?.validate, networkInput?.validate],
            [
                {
                    validate: metadataInput?.validate,
                    value: metadata,
                    optionalInputType: OptionalInputType.Metadata,
                    byteLimit: MAX_METADATA_BYTES,
                    errorMessage: localize('error.send.metadataTooLong'),
                },
                {
                    validate: tagInput?.validate,
                    value: tag,
                    optionalInputType: OptionalInputType.Tag,
                    byteLimit: MAX_TAG_BYTES,
                    errorMessage: localize('error.send.tagTooLong'),
                },
            ]
        )

        if (valid) {
            const preparedOutput = await buildPreparedOutput()

            if (preparedOutput) {
                openPopup({
                    id: PopupId.SendConfirmation,
                    overflow: true,
                    props: {
                        ...preparedOutput,
                    },
                })
            }
        }
    }

    function onCancelClick(): void {
        closePopup()
    }
</script>

<send-token-form class="flex flex-col space-y-4">
    <send-form-inputs class="flex flex-col space-y-4">
        <AssetAmountInput bind:this={assetAmountInput} bind:asset bind:rawAmount bind:unit {disableAssetSelection} />
        <NetworkInput bind:this={networkInput} bind:iscpChainAddress {showLayer2} />
        <RecipientInput bind:this={recipientInput} bind:recipient isLayer2={isLayer2Transfer} />
        <optional-inputs class="flex flex-row flex-wrap gap-4">
            <OptionalInput
                bind:this={tagInput}
                bind:value={tag}
                label={localize('general.tag')}
                description={localize('tooltips.optionalInput')}
            />
            {#if !isLayer2Transfer}
                <OptionalInput
                    bind:this={metadataInput}
                    bind:value={metadata}
                    label={localize('general.metadata')}
                    description={localize('tooltips.optionalInput')}
                />
            {/if}
        </optional-inputs>
    </send-form-inputs>
    {#if isTransferring}
        <Error error={localize('notifications.transferring')} />
    {/if}
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancelClick}>
            {localize('actions.cancel')}
        </Button>
        <Button
            classes="w-full"
            onClick={onContinueClick}
            disabled={isTransferring || isPreparingOutput}
            isBusy={isTransferring || isPreparingOutput}
            busyMessage={isPreparingOutput ? 'Preparing' : ''}
        >
            {localize('actions.next')}
        </Button>
    </popup-buttons>
</send-token-form>
