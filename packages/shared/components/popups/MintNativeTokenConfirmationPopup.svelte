<script lang="typescript">
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile'
    import { mintNativeToken, mintTokenDetails, TokenStandard } from '@core/wallet'
    import { closePopup, openPopup } from '@auxiliary/popup'
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

    $: isTransferring = $selectedAccount.isTransferring

    let detailsList: { [key in string]: { data: string; tooltipText?: string; isCopyable?: boolean } }
    $: detailsList = {
        ...(aliasId && {
            alias: { data: aliasId, isCopyable: true },
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
            await mintNativeToken(Number(totalSupply), Number(circulatingSupply), {
                standard: TokenStandard.IRC30,
                name: tokenName,
                symbol,
                decimals: Number(decimals),
                ...(description && { description }),
                ...(url && { url }),
                ...(logoUrl && { logoUrl }),
            })
            closePopup()
        } catch (reason) {
            handleError(reason.error)
        }
    }

    function handleBack(): void {
        closePopup()
        openPopup({
            type: 'mintNativeTokenForm',
            overflow: true,
        })
    }

    async function handleMint(): Promise<void> {
        try {
            await checkActiveProfileAuth(mintAction, { stronghold: true, ledger: false })
        } catch (reason) {
            handleError(reason.error)
        }
    }

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            handleError(err.error)
        }
    })
</script>

<div class="space-y-6">
    <Text type="h4" fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold}>
        {localize('popups.mintNativeToken.confirmationTitle')}
    </Text>

    <div class="space-y-2 max-h-100 scrollable-y flex-1">
        {#if Object.entries(detailsList).length > 0}
            <details-list class="flex flex-col space-y-2">
                {#each Object.entries(detailsList) as [key, value]}
                    <KeyValueBox
                        keyText={localize(`popups.mintNativeToken.property.${key}`)}
                        valueText={value.data}
                        isCopyable={value.isCopyable}
                    />
                {/each}
            </details-list>
        {/if}
    </div>
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" disabled={isTransferring} onClick={handleBack}>
            {localize('actions.back')}
        </Button>
        <Button classes="w-full" disabled={isTransferring} onClick={handleMint} isBusy={isTransferring}>
            {localize('actions.confirm')}
        </Button>
    </div>
</div>
