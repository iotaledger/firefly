<script lang="ts">
    import { get } from 'svelte/store'
    import { Error } from '@ui'
    import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account/stores'
    import { Output } from '@iota/sdk/out/types'
    import {
        getDefaultTransactionOptions,
        getOutputParameters,
        NewNftTransactionDetails,
        newTransactionDetails,
        NewTransactionType,
        setNewTransactionDetails,
    } from '@core/wallet'
    import { Button, NetworkInput, NftInput, OptionalInput, RecipientInput } from 'shared/components'
    import features from '@features/features'
    import { activeProfile } from '@core/profile'
    import { prepareOutput } from '@core/account'
    import { handleError } from '@core/error/handlers'
    import { OptionalInputType } from '../send'
    import { MAX_METADATA_BYTES, MAX_TAG_BYTES } from '@core/utils'

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

    let preparedOutput: Output
    let isPreparingOutput = false

    // Inputs
    let nftInput: NftInput
    let networkInput: NetworkInput
    let recipientInput: RecipientInput
    let metadataInput: OptionalInput
    let tagInput: OptionalInput

    const transactionDetails = get(newTransactionDetails)
    const { expirationDate, layer2Parameters, disableAssetSelection } = transactionDetails as NewNftTransactionDetails
    let { nftId, recipient, tag, metadata, giftStorageDeposit, disableChangeExpiration, disableToggleGift } =
        transactionDetails as NewNftTransactionDetails

    if (Number($selectedAccount.balances.baseCoin.available) === 0) {
        giftStorageDeposit = true
        disableChangeExpiration = true
        disableToggleGift = true
    }

    $: nftId,
        recipient,
        tag,
        metadata,
        setNewTransactionDetails({
            type: NewTransactionType.NftTransfer,
            nftId,
            recipient,
            expirationDate,
            giftStorageDeposit,
            tag,
            metadata,
            layer2Parameters: isLayer2Transfer
                ? { networkAddress: iscpChainAddress, senderAddress: $selectedAccount.depositAddress }
                : null,
            disableAssetSelection,
        })

    let iscpChainAddress = layer2Parameters?.networkAddress
    $: isLayer2Transfer = !!iscpChainAddress
    $: showLayer2 = features?.network?.layer2?.enabled && $activeProfile.isDeveloperProfile
    $: nftId, !showLayer2 && networkInput?.reset()

    async function buildPreparedOutput(): Promise<void> {
        try {
            const details = get(newTransactionDetails)
            isPreparingOutput = true

            const outputParams = await getOutputParameters(details)
            preparedOutput = await prepareOutput($selectedAccount.index, outputParams, getDefaultTransactionOptions())

            return Promise.resolve()
        } catch (err) {
            handleError(err)
            return Promise.reject()
        } finally {
            isPreparingOutput = false
        }
    }

    async function onContinueClick(): Promise<void> {
        const valid = await validateInputs(
            [nftInput?.validate, recipientInput?.validate, networkInput?.validate],
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
            await buildPreparedOutput()

            openPopup({
                id: PopupId.SendConfirmation,
                overflow: true,
                props: {
                    preparedOutput,
                },
            })
        }
    }

    function onCancelClick(): void {
        closePopup()
    }
</script>

<send-nft-form class="flex flex-col space-y-4">
    <send-form-inputs class="flex flex-col space-y-4">
        <NftInput bind:this={nftInput} bind:nftId readonly={disableAssetSelection} />
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
</send-nft-form>
