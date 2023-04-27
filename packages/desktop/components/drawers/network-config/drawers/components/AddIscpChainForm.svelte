<script lang="ts">
    import { localize } from '@core/i18n'
    import { IIscpChainMetadata, MAX_CHAIN_NAME_LENGTH } from '@core/network'
    import { ChainType } from '@core/network/enums'
    import { isValidHexAddress, isValidUrl } from '@core/utils'
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
        if (!isValidHexAddress(chain.aliasAddress)) {
            aliasAddressError = localize(`${localeKey}.errors.aliasAddressMustBeHex`)
        }
    }

    function validateIscpEndpoint(): void {
        if (!isValidUrl(chain.iscpEndpoint)) {
            iscpEndpointError = localize(`${localeKey}.errors.invalidUrl`)
        }
    }

    function validateExplorerUrl(): void {
        if (chain.explorerUrl && !isValidUrl(chain.explorerUrl)) {
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
        if (hasError) {
            // TODO: Fetch chainId from ISCP node before adding it to profile
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
