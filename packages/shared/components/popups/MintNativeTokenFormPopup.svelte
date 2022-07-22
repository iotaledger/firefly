<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { Converter } from '@lib/converter'
    import { closePopup } from '@lib/popup'
    import { AddInputButton, Button, ClosableTextInput, NumberInput, Text, TextInput } from 'shared/components'
    import { FontWeightText } from '../Text.svelte'

    let name: string
    let totalSupply: number
    let circulatingSupply: number
    let decimals: number
    let symbol: string
    let description: string
    let url: string
    let logoUrl: string

    let nameError: string = ''
    $: name, (nameError = '')
    let totalSupplyError: string
    $: totalSupply, (totalSupplyError = '')
    let circulatingSupplyError: string
    $: circulatingSupply, (circulatingSupplyError = '')
    let decimalsError: string
    $: decimals, (decimalsError = '')
    let symbolError: string
    $: symbol, (symbolError = '')
    let descriptionError: string
    $: description, (descriptionError = '')
    let urlError: string
    $: url, (urlError = '')
    let logoUrlError: string
    $: logoUrl, (logoUrlError = '')

    let descriptionButtonElement: HTMLButtonElement
    let isDescriptionInputOpen = false
    function openDescriptionInput() {
        isDescriptionInputOpen = true
    }

    let urlButtonElement: HTMLButtonElement
    let isUrlInputOpen = false
    function openUrlInput() {
        isUrlInputOpen = true
    }

    let logoUrlButtonElement: HTMLButtonElement
    let isLogoUrlInputOpen = false
    function openLogoUrlInput() {
        isLogoUrlInputOpen = true
    }

    function handleCancel() {
        closePopup()
    }

    async function handleMint() {
        const valid = await validate()
        if (valid) {
            try {
                await $selectedAccount.mintNativeToken(
                    {
                        accountAddress: $selectedAccount.depositAddress,
                        maximumSupply: '0x' + Number(totalSupply).toString(16),
                        circulatingSupply: '0x' + Number(circulatingSupply).toString(16),
                        foundryMetadata: Array.from(
                            Converter.utf8ToBytes(
                                JSON.stringify({
                                    standard: 'IRC30',
                                    name,
                                    symbol,
                                    decimals: Number(decimals),
                                    ...(description && { description }),
                                    ...(url && { url }),
                                    ...(logoUrl && { logoUrl }),
                                })
                            )
                        ),
                    },
                    {
                        remainderValueStrategy: { strategy: 'ReuseAddress', value: null },
                    }
                )
                closePopup()
            } catch (reason) {
                console.error(reason)
            }
        }
    }

    async function validate(): Promise<boolean> {
        try {
            await Promise.all([
                isNameValid(),
                isTotalSupplyValid(),
                isCirculatingSupplyValid(),
                isDecimalsValid(),
                isSymbolValid(),
            ])
            return true
        } catch (error) {
            console.error('Error: ', error)
            return false
        }
    }

    function isNameValid(): Promise<void> {
        if (!name) {
            nameError = 'Name is required'
            return Promise.reject(nameError)
        } else {
            return Promise.resolve()
        }
    }

    function isTotalSupplyValid(): Promise<void> {
        if (totalSupply.toString().length < 1) {
            totalSupplyError = 'Total supply is required'
            return Promise.reject(totalSupplyError)
        } else if (totalSupply < 1) {
            totalSupplyError = 'Total supply must be greater than 0'
            return Promise.reject(totalSupplyError)
        } else {
            return Promise.resolve()
        }
    }

    function isCirculatingSupplyValid(): Promise<void> {
        if (circulatingSupply.toString().length < 1) {
            circulatingSupplyError = 'Circulating supply is required'
            return Promise.reject(circulatingSupplyError)
        } else if (circulatingSupply < 1) {
            circulatingSupplyError = 'Circulating supply must be greater than 0'
            return Promise.reject(circulatingSupplyError)
        } else if (circulatingSupply > totalSupply) {
            circulatingSupplyError = 'Circulating supply must be less than or equal to the total supply'
            return Promise.reject(circulatingSupplyError)
        } else {
            return Promise.resolve()
        }
    }

    function isDecimalsValid(): Promise<void> {
        if (decimals.toString().length < 1) {
            decimalsError = 'Decimals is required'
            return Promise.reject(decimalsError)
        } else if (decimals < 0) {
            decimalsError = 'Decimals must be greater than or equal to 0'
            return Promise.reject(decimalsError)
        } else {
            return Promise.resolve()
        }
    }

    function isSymbolValid(): Promise<void> {
        if (!symbol) {
            symbolError = 'Symbol is required'
            return Promise.reject()
        } else {
            return Promise.resolve()
        }
    }
</script>

<div class="space-y-6">
    <Text type="h4" fontSize="18" lineHeight="6" fontWeight={FontWeightText.semibold}>
        {localize('popups.mintNativeTokenForm.title')}
    </Text>

    <div class="space-y-4">
        <TextInput
            bind:value={name}
            label={localize('popups.mintNativeTokenForm.inputs.name')}
            placeholder={localize('popups.mintNativeTokenForm.inputs.name')}
            error={nameError}
        />
        <NumberInput
            bind:value={totalSupply}
            isInteger
            label={localize('popups.mintNativeTokenForm.inputs.totalSupply')}
            placeholder={localize('popups.mintNativeTokenForm.inputs.totalSupply')}
            error={totalSupplyError}
        />
        <NumberInput
            bind:value={circulatingSupply}
            isInteger
            label={localize('popups.mintNativeTokenForm.inputs.circulatingSupply')}
            placeholder={localize('popups.mintNativeTokenForm.inputs.circulatingSupply')}
            error={circulatingSupplyError}
        />
        <NumberInput
            bind:value={decimals}
            isInteger
            label={localize('popups.mintNativeTokenForm.inputs.decimals')}
            placeholder={localize('popups.mintNativeTokenForm.inputs.decimals')}
            error={decimalsError}
        />
        <TextInput
            bind:value={symbol}
            label={localize('popups.mintNativeTokenForm.inputs.symbol')}
            placeholder={localize('popups.mintNativeTokenForm.inputs.symbol')}
            maxlength={5}
            error={symbolError}
        />
        <ClosableTextInput
            bind:value={description}
            bind:buttonElement={descriptionButtonElement}
            bind:open={isDescriptionInputOpen}
            label={localize('popups.mintNativeTokenForm.inputs.description')}
            placeholder={localize('popups.mintNativeTokenForm.inputs.description')}
            error={descriptionError}
        />
        <ClosableTextInput
            bind:value={url}
            bind:buttonElement={urlButtonElement}
            bind:open={isUrlInputOpen}
            label={localize('popups.mintNativeTokenForm.inputs.url')}
            placeholder={localize('popups.mintNativeTokenForm.inputs.url')}
            error={urlError}
        />
        <ClosableTextInput
            bind:value={logoUrl}
            bind:buttonElement={logoUrlButtonElement}
            bind:open={isLogoUrlInputOpen}
            label={localize('popups.mintNativeTokenForm.inputs.logoUrl')}
            placeholder={localize('popups.mintNativeTokenForm.inputs.logoUrl')}
            error={logoUrlError}
        />
        {#if !isDescriptionInputOpen || !isUrlInputOpen || !isLogoUrlInputOpen}
            <optional-input-buttons class="flex flex-row space-x-4">
                <AddInputButton
                    bind:buttonElement={descriptionButtonElement}
                    bind:open={isDescriptionInputOpen}
                    text={localize('popups.mintNativeTokenForm.inputs.description')}
                    onClick={openDescriptionInput}
                />
                <AddInputButton
                    bind:buttonElement={urlButtonElement}
                    bind:open={isUrlInputOpen}
                    text={localize('popups.mintNativeTokenForm.inputs.url')}
                    onClick={openUrlInput}
                />
                <AddInputButton
                    bind:buttonElement={logoUrlButtonElement}
                    bind:open={isLogoUrlInputOpen}
                    text={localize('popups.mintNativeTokenForm.inputs.logoUrl')}
                    onClick={openLogoUrlInput}
                />
            </optional-input-buttons>
        {/if}
    </div>

    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button secondary classes="w-full" onClick={handleCancel}>
            {localize('actions.cancel')}
        </Button>
        <Button autofocus classes="w-full" onClick={handleMint}>
            {localize('popups.mintNativeTokenForm.buttons.mint')}
        </Button>
    </div>
</div>
