<script lang="typescript">
    import { BaseError } from '@core/error'
    import { localize } from '@core/i18n'
    import { isSoftwareProfile } from '@core/profile'
    import { mintNativeToken } from '@core/wallet'
    import { closePopup, updatePopupProps } from '@lib/popup'
    import { checkStronghold } from '@lib/stronghold'
    import { isTransferring } from '@lib/wallet'
    import {
        AddInputButton,
        Button,
        ClosableInput,
        Error,
        NumberInput,
        Spinner,
        Text,
        TextInput,
    } from 'shared/components'
    import { FontWeight } from '../Text.svelte'
    import { onMount } from 'svelte'

    export let name: string
    export let totalSupply: number
    export let circulatingSupply: number
    export let decimals = 0
    export let symbol: string
    export let description: string
    export let url: string
    export let logoUrl: string
    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

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

    let error: BaseError

    let decimalsButtonElement: HTMLButtonElement
    let isDecimalsInputOpen = false
    function openDecimalsInput() {
        isDecimalsInputOpen = true
    }

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

    async function mintAction() {
        try {
            await mintNativeToken(Number(totalSupply), Number(circulatingSupply), {
                standard: 'IRC30',
                name,
                symbol,
                decimals: Number(decimals),
                ...(description && { description }),
                ...(url && { url }),
                ...(logoUrl && { logoUrl }),
            })
            closePopup()
        } catch (reason) {
            if (!error) {
                error = reason.error
                    ? new BaseError({
                          message: reason.error ?? reason.message,
                          logToConsole: true,
                          saveToErrorLog: true,
                      })
                    : reason
            }
        }
    }

    function handleCancel() {
        closePopup()
    }

    async function handleMint(): Promise<void> {
        error = null
        const valid = await validate()
        if (valid) {
            try {
                if ($isSoftwareProfile) {
                    updatePopupProps({
                        name,
                        totalSupply,
                        circulatingSupply,
                        decimals,
                        symbol,
                        description,
                        url,
                        logoUrl,
                    })
                    await checkStronghold(mintAction, true)
                }
            } catch (reason) {
                if (!error) {
                    error = reason.error
                        ? new BaseError({
                              message: reason.error ?? reason.message,
                              logToConsole: true,
                              saveToErrorLog: true,
                          })
                        : reason
                }
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
        } else if (Number(totalSupply) < 1) {
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
        } else if (Number(circulatingSupply) < 1) {
            circulatingSupplyError = 'Circulating supply must be greater than 0'
            return Promise.reject(circulatingSupplyError)
        } else if (Number(circulatingSupply) > Number(totalSupply)) {
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
        } else if (Number(decimals) < 0) {
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

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            if (!error) {
                error = err.error
                    ? new BaseError({ message: err.error ?? err.message, logToConsole: true, saveToErrorLog: true })
                    : err
            }
        }
    })
</script>

<div class="space-y-6">
    <Text type="h4" fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold}>
        {localize('popups.mintNativeTokenForm.title')}
    </Text>

    <div class="space-y-4 max-h-100 scrollable-y flex-1">
        <TextInput
            bind:value={name}
            label={localize('popups.mintNativeTokenForm.inputs.name')}
            placeholder={localize('popups.mintNativeTokenForm.inputs.name')}
            error={nameError}
        />
        <TextInput
            bind:value={symbol}
            label={localize('popups.mintNativeTokenForm.inputs.symbol')}
            placeholder={localize('popups.mintNativeTokenForm.inputs.symbol')}
            maxlength={5}
            error={symbolError}
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
        <ClosableInput
            bind:value={decimals}
            bind:buttonElement={decimalsButtonElement}
            bind:open={isDecimalsInputOpen}
            inputType="number"
            isInteger
            label={localize('popups.mintNativeTokenForm.inputs.decimals')}
            placeholder={localize('popups.mintNativeTokenForm.inputs.decimals')}
            error={decimalsError}
        />
        <ClosableInput
            bind:value={description}
            bind:buttonElement={descriptionButtonElement}
            bind:open={isDescriptionInputOpen}
            label={localize('popups.mintNativeTokenForm.inputs.description')}
            placeholder={localize('popups.mintNativeTokenForm.inputs.description')}
            error={descriptionError}
        />
        <ClosableInput
            bind:value={url}
            bind:buttonElement={urlButtonElement}
            bind:open={isUrlInputOpen}
            label={localize('popups.mintNativeTokenForm.inputs.url')}
            placeholder={localize('popups.mintNativeTokenForm.inputs.url')}
            error={urlError}
        />
        <ClosableInput
            bind:value={logoUrl}
            bind:buttonElement={logoUrlButtonElement}
            bind:open={isLogoUrlInputOpen}
            label={localize('popups.mintNativeTokenForm.inputs.logoUrl')}
            placeholder={localize('popups.mintNativeTokenForm.inputs.logoUrl')}
            error={logoUrlError}
        />
        {#if !isDescriptionInputOpen || !isUrlInputOpen || !isLogoUrlInputOpen}
            <optional-input-buttons class="flex flex-wrap space-x-4">
                <AddInputButton
                    bind:buttonElement={decimalsButtonElement}
                    bind:open={isDecimalsInputOpen}
                    text={localize('popups.mintNativeTokenForm.inputs.decimals')}
                    onClick={openDecimalsInput}
                />
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
                {#if false}
                    <AddInputButton
                        bind:buttonElement={logoUrlButtonElement}
                        bind:open={isLogoUrlInputOpen}
                        text={localize('popups.mintNativeTokenForm.inputs.logo')}
                        onClick={openLogoUrlInput}
                    />
                {/if}
            </optional-input-buttons>
        {/if}
        {#if error}
            <Error error={error?.message} />
        {/if}
    </div>

    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button secondary classes="w-full" disabled={$isTransferring} onClick={handleCancel}>
            {localize('actions.cancel')}
        </Button>
        <Button autofocus classes="w-full" disabled={$isTransferring} onClick={handleMint}>
            {#if $isTransferring}
                <Spinner busy classes="justify-center break-all" />
            {:else}
                {localize('actions.mint')}
            {/if}
        </Button>
    </div>
</div>
