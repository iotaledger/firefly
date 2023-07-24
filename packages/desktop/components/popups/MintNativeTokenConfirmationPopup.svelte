<script lang="ts">
    import { localize } from '@core/i18n'
    import { getBaseToken, checkActiveProfileAuth } from '@core/profile'
    import {
        createNativeToken,
        mintTokenDetails,
        TokenStandard,
        buildFoundryOutputData,
        formatTokenAmountPrecise,
        IIrc30Metadata,
    } from '@core/wallet'
    import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
    import { Button, KeyValueBox, Text, FontWeight } from 'shared/components'
    import { onMount } from 'svelte'
    import { selectedAccount } from '@core/account'
    import { handleError } from '@core/error/handlers/handleError'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    const {
        name: tokenName,
        totalSupply,
        circulatingSupply,
        decimals,
        symbol,
        description,
        url,
        logoUrl,
        aliasId,
    } = $mintTokenDetails

    let storageDeposit = '0'

    let metadata: IIrc30Metadata
    $: metadata = {
        standard: TokenStandard.Irc30,
        name: tokenName,
        symbol,
        decimals: Number(decimals),
        ...(description && { description }),
        ...(url && { url }),
        ...(logoUrl && { logoUrl }),
    }
    $: isTransferring = $selectedAccount.isTransferring

    async function prepareFoundryOutput(): Promise<void> {
        const outputData = buildFoundryOutputData(Number(totalSupply), Number(circulatingSupply), metadata, aliasId)
        const preparedOutput = await $selectedAccount.buildFoundryOutput(outputData)
        storageDeposit = formatTokenAmountPrecise(Number(preparedOutput.amount) ?? 0, getBaseToken())
    }

    let detailsList: { [key: string]: { data: string; tooltipText?: string; isCopyable?: boolean } }
    $: detailsList = {
        ...(aliasId && {
            alias: { data: aliasId, isCopyable: true },
        }),
        ...(storageDeposit && {
            storageDeposit: { data: storageDeposit },
        }),
        ...(tokenName && {
            tokenName: { data: tokenName },
        }),
        ...(totalSupply && {
            totalSupply: { data: String(totalSupply) },
        }),
        ...(decimals && {
            decimals: { data: String(decimals) },
        }),
        ...(symbol && {
            symbol: { data: symbol },
        }),
        ...(url && {
            url: { data: url },
        }),
        ...(logoUrl && {
            logoUrl: { data: logoUrl },
        }),
    }

    async function mintAction(): Promise<void> {
        try {
            await createNativeToken(Number(totalSupply), Number(circulatingSupply), metadata)
            closePopup()
        } catch (err) {
            handleError(err)
        }
    }

    function onBackClick(): void {
        closePopup()
        openPopup({
            id: PopupId.MintNativeTokenForm,
            overflow: true,
        })
    }

    async function onConfirmClick(): Promise<void> {
        try {
            await checkActiveProfileAuth(mintAction, { stronghold: true, ledger: false })
        } catch (err) {
            handleError(err)
        }
    }

    onMount(async () => {
        try {
            await _onMount()
            await prepareFoundryOutput()
        } catch (err) {
            handleError(err.error)
        }
    })
</script>

<div class="space-y-6">
    <Text type="h4" fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold}>
        {localize('popups.nativeToken.confirmationTitle')}
    </Text>

    <div class="space-y-2 max-h-100 scrollable-y flex-1">
        {#if Object.entries(detailsList).length > 0}
            <details-list class="flex flex-col space-y-2">
                {#each Object.entries(detailsList) as [key, value]}
                    <KeyValueBox
                        keyText={localize(`popups.nativeToken.property.${key}`)}
                        valueText={value.data}
                        isCopyable={value.isCopyable}
                    />
                {/each}
            </details-list>
        {/if}
    </div>
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" disabled={isTransferring} onClick={onBackClick}>
            {localize('actions.back')}
        </Button>
        <Button classes="w-full" disabled={isTransferring} onClick={onConfirmClick} isBusy={isTransferring}>
            {localize('actions.confirm')}
        </Button>
    </div>
</div>
