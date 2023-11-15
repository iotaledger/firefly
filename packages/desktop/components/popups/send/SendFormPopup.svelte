<script lang="ts">
    import { get } from 'svelte/store'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account'
    import {
        isReservedTagKeyword,
        InclusionState,
        selectedAccountActivities,
        newTransactionDetails,
        NewTransactionType,
    } from '@core/wallet'
    import { getByteLengthOfString } from '@core/utils'
    import { ownedNfts } from '@core/nfts'
    import SendTokenForm from './SendTokenForm.svelte'
    import SendNftForm from './SendNftForm.svelte'
    import { OptionalInputType, SendFormTab } from '@core/wallet/utils/send/sendUtils'
    import { FontWeight, Tabs, Text, TextType } from '@ui'

    const tabs: SendFormTab[] = [SendFormTab.SendToken, SendFormTab.SendNft]
    const { type: transactionType, disableAssetSelection } = get(newTransactionDetails)
    let activeTab: SendFormTab =
        transactionType === NewTransactionType.NftTransfer ? SendFormTab.SendNft : SendFormTab.SendToken

    $: hasSpendableNfts = $ownedNfts.some((nft) => nft.isSpendable)
    $: isTransferInProgress =
        $selectedAccountActivities.some((_activity) => _activity.inclusionState === InclusionState.Pending) ||
        $selectedAccount.isTransferring

    async function validate(
        inputValidations?: [() => Promise<void>],
        optionalInputValidations?: [
            {
                validate?: (promise: Promise<unknown>) => Promise<void>
                value: string
                optionalInputType: OptionalInputType
                byteLimit: number
                errorMessage: string
            }
        ]
    ): Promise<boolean> {
        try {
            const inputValidationPromises = inputValidations ? inputValidations.map((v) => v()) : []
            const optionalInputValidationPromises = optionalInputValidations
                ? optionalInputValidations.map((payload) =>
                      payload.validate?.(
                          validateOptionalInput(
                              payload.value,
                              payload.optionalInputType,
                              payload.byteLimit,
                              payload.errorMessage
                          )
                      )
                  )
                : []
            await Promise.all([...inputValidationPromises, ...optionalInputValidationPromises])
            return true
        } catch (err) {
            console.error('Error and return: ', err)
            return false
        }
    }

    function validateOptionalInput(
        value: string,
        optionalInputType: OptionalInputType,
        byteLimit: number,
        errorMessage: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            if (getByteLengthOfString(value) > byteLimit) {
                reject(errorMessage)
            }

            if (optionalInputType === OptionalInputType.Tag) {
                if (isReservedTagKeyword(value)) {
                    reject(localize('error.send.reservedTagKeyword'))
                }
            }

            resolve()
        })
    }
</script>

<send-form-popup class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.transaction.title')}
    </Text>
    {#if hasSpendableNfts && !disableAssetSelection}
        <Tabs bind:activeTab {tabs} />
    {/if}
    {#if activeTab === SendFormTab.SendToken}
        <SendTokenForm validateInputs={validate} isTransferring={isTransferInProgress} />
    {:else}
        <SendNftForm validateInputs={validate} isTransferring={isTransferInProgress} />
    {/if}
</send-form-popup>
