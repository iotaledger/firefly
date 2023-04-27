<script lang="ts">
    import { localize } from '@core/i18n'
    import { IIscpChainMetadata } from '@core/network'
    import { ChainType } from '@core/network/enums'
    import { isValidUrl } from '@core/utils'
    import { Button, HTMLButtonType, Input } from '@ui'

    const isBusy = false
    const localeKey = 'views.dashboard.drawers.networkConfig.addChain'

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

    function validate(): boolean {
        if (!chain.name) {
            nameError = localize(`${localeKey}.errors.cannotBeEmpty`)
        }

        const isHex = chain.aliasAddress.startsWith('0x')
        if (!isHex || !/^(0x08)?[0-9a-f]{64}?(?:0[1-9]|[1-5][0-9]|6[0-4])?0{8}$/i.test(chain.aliasAddress)) {
            aliasAddressError = localize(`${localeKey}.errors.aliasAddressMustBeHex`)
        }

        if (!isValidUrl(chain.iscpEndpoint)) {
            iscpEndpointError = localize(`${localeKey}.errors.invalidUrl`)
        }

        if (chain.explorerUrl && !isValidUrl(chain.explorerUrl)) {
            explorerUrlError = localize(`${localeKey}.errors.invalidUrl`)
        }

        return !!nameError || !!aliasAddressError || !!iscpEndpointError || !!explorerUrlError
    }

    function handleSubmit(): void {
        validate()
        // TODO: Fetch chainId from ISCP node before adding it to profile
    }
</script>

<add-chain-drawer class="h-full flex flex-col justify-between">
    <form id="add-chain-form" class="flex flex-col gap-3" on:submit|preventDefault={handleSubmit}>
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
</add-chain-drawer>
