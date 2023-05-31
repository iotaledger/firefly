<script lang="ts">
    import { Button, ChainInput, FontWeight, Spinner, Text, TextInput, TextType } from '@ui'

    import { localize } from '@core/i18n'
    import { ERC20_TOKEN_ADDRESS_LENGTH, getErc20TokenSymbol } from '@core/layer-2'
    import { HEXADECIMAL_PREFIX, HEXADECIMAL_REGEXP } from '@core/utils'

    import { closePopup } from '@desktop/auxiliary/popup'
    import { showAppNotification } from '@auxiliary/notification'
    import { updateActiveAccountTrackedTokens } from '@core/wallet'

    let busy = false

    let chainId: number

    let tokenAddress: string
    let tokenAddressError = ''
    $: tokenAddress, (tokenAddressError = '')

    function onCancelClick(): void {
        closePopup()
    }

    async function onImportClick(): Promise<void> {
        busy = true

        if (validate()) {
            try {
                const erc20TokenSymbol = await getErc20TokenSymbol(tokenAddress, chainId)
                if (erc20TokenSymbol) {
                    updateActiveAccountTrackedTokens(tokenAddress, chainId)
                    showAppNotification({
                        type: 'success',
                        alert: true,
                        message: localize('popups.importErc20Token.success', {
                            values: { tokenSymbol: erc20TokenSymbol },
                        }),
                    })
                }
            } catch (err) {
                console.error(err)
                showAppNotification({
                    type: 'error',
                    alert: true,
                    message: localize('popups.importErc20Token.error'),
                })
            }
        }

        busy = false
    }

    function validate(): boolean {
        tokenAddressError = validateTokenAddress()
        return !tokenAddressError
    }

    function validateTokenAddress(): string {
        const hasHexPrefix = tokenAddress?.startsWith(HEXADECIMAL_PREFIX)
        const isValidHex = HEXADECIMAL_REGEXP.test(tokenAddress)
        if (!hasHexPrefix || !isValidHex) {
            return localize('error.erc20Token.invalidAddressFormat')
        }

        const addressLength = tokenAddress?.substring(2)?.length
        if (addressLength !== ERC20_TOKEN_ADDRESS_LENGTH) {
            return localize('error.erc20Token.invalidAddressLength')
        }
    }
</script>

<import-erc20-token-popup class="space-y-6">
    <Text type={TextType.h4} fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold}>
        {localize('popups.importErc20Token.title')}
    </Text>

    <div class="space-y-4 max-h-100 scrollable-y flex-1">
        <ChainInput bind:chainId />
        <TextInput
            bind:value={tokenAddress}
            label={localize('popups.importErc20Token.property.tokenAddress')}
            placeholder={localize('popups.importErc20Token.property.tokenAddress')}
            error={tokenAddressError}
        />
    </div>

    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" disabled={busy} onClick={onCancelClick}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" disabled={busy || !chainId || !tokenAddress} onClick={onImportClick}>
            {#if busy}
                <Spinner busy message={localize('actions.importing')} />
            {:else}
                {localize('actions.import')}
            {/if}
        </Button>
    </div>
</import-erc20-token-popup>
