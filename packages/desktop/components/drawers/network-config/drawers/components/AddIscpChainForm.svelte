<script lang="ts">
    import { localize } from '@core/i18n'
    import { IIscpChainMetadata, MAX_CHAIN_NAME_LENGTH, ChainType } from '@core/network'
    import { activeProfile, getNetworkHrp } from '@core/profile'
    import { isValidHexAddress, isValidHttpsUrl, validateBech32Address } from '@core/utils'
    import { ADDRESS_TYPE_ALIAS } from '@core/wallet'
    import { Button, HTMLButtonType, Input } from '@ui'

    const localeKey = 'views.dashboard.drawers.networkConfig.addChain'

    const isBusy = false
    let nameError = ''
    let aliasAddressError = ''
    let iscpEndpointError = ''
    let explorerUrlError = ''
    $: submitDisabled = !chain.name || !chain.aliasAddress || !chain.iscpEndpoint

    const chain: IIscpChainMetadata = {
        type: ChainType.Iscp,
        chainId: undefined,
        name: '',
        explorerUrl: undefined,
        aliasAddress: '',
        iscpEndpoint: '',
    }

    function validateName(): void {
        if (!chain.name) {
            nameError = localize(`${localeKey}.errors.cannotBeEmpty`)
        } else if (chain.name.length > MAX_CHAIN_NAME_LENGTH) {
            nameError = localize(`${localeKey}.errors.nameTooLong`)
        }
    }

    function validateAliasAddress(): void {
        const chains = $activeProfile.network.chains
        let isValidBechAddress = false
        try {
            validateBech32Address(getNetworkHrp(), chain.aliasAddress, ADDRESS_TYPE_ALIAS)
            isValidBechAddress = true
        } catch (error) {
            isValidBechAddress = false
        }

        if (!isValidHexAddress(chain.aliasAddress) && !isValidBechAddress) {
            aliasAddressError = localize(`${localeKey}.errors.aliasAddressWrongFormat`)
        } else if (
            chains.some((_chain) => _chain.type === ChainType.Iscp && _chain.aliasAddress === chain.aliasAddress)
        ) {
            aliasAddressError = localize(`${localeKey}.errors.aliasAddressAlreadyInUse`)
        }
    }

    function validateIscpEndpoint(): void {
        if (!isValidHttpsUrl(chain.iscpEndpoint)) {
            iscpEndpointError = localize(`${localeKey}.errors.invalidUrl`)
        }
    }

    function validateExplorerUrl(): void {
        if (chain.explorerUrl && !isValidHttpsUrl(chain.explorerUrl)) {
            explorerUrlError = localize(`${localeKey}.errors.invalidUrl`)
        }
    }

    function validate(): void {
        validateName()
        validateAliasAddress()
        validateIscpEndpoint()
        validateExplorerUrl()
    }

    function resetErrors(): void {
        nameError = ''
        aliasAddressError = ''
        iscpEndpointError = ''
        explorerUrlError = ''
    }

    function onSubmitClick(): void {
        resetErrors()
        validate()
        const hasError = !!nameError || !!aliasAddressError || !!iscpEndpointError || !!explorerUrlError
        if (!hasError) {
            // TODO: https://github.com/iotaledger/firefly/issues/6375
        }
    }
</script>

<add-iscp-chain class="h-full flex flex-col justify-between">
    <form id="add-chain-form" class="flex flex-col gap-3" on:submit|preventDefault={onSubmitClick}>
        <Input bind:value={chain.name} placeholder={localize('general.name')} disabled={isBusy} error={nameError} />
        <Input
            bind:value={chain.aliasAddress}
            placeholder={localize(`${localeKey}.aliasAddress`)}
            disabled={isBusy}
            error={aliasAddressError}
        />
        <Input
            bind:value={chain.iscpEndpoint}
            placeholder={localize(`${localeKey}.iscpEndpoint`)}
            disabled={isBusy}
            error={iscpEndpointError}
        />
        <Input
            bind:value={chain.explorerUrl}
            placeholder={localize(`${localeKey}.explorerEndpoint`)}
            disabled={isBusy}
            error={explorerUrlError}
        />
    </form>
    <Button
        type={HTMLButtonType.Submit}
        form="add-chain-form"
        classes="w-full"
        disabled={submitDisabled || isBusy}
        {isBusy}
    >
        {localize(`${localeKey}.title`)}
    </Button>
</add-iscp-chain>
