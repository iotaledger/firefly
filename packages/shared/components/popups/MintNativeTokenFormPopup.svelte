<script lang="typescript">
    import { BaseError } from '@core/error'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile'
    import { mintNativeToken, setMintTokenDetails, mintTokenDetails, TokenStandard } from '@core/wallet'
    import { closePopup } from '@lib/popup'
    import { isTransferring } from '@lib/wallet'
    import { Button, Error, NumberInput, Text, TextInput, OptionalInput, FontWeight } from 'shared/components'
    import { onMount } from 'svelte'
    import { MAX_SUPPORTED_DECIMALS } from '@core/wallet/constants/max-supported-decimals.constants'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    let {
        name: tokenName,
        totalSupply,
        circulatingSupply,
        decimals,
        symbol,
        description,
        url,
        logoUrl,
    } = $mintTokenDetails

    let nameError: string = ''
    $: tokenName, (nameError = '')
    let totalSupplyError: string
    $: totalSupply, (totalSupplyError = '')
    let circulatingSupplyError: string
    $: circulatingSupply, (circulatingSupplyError = '')
    let symbolError: string
    $: symbol, (symbolError = '')

    let error: BaseError

    let decimalsInput: OptionalInput

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
                setMintTokenDetails({
                    name: tokenName,
                    totalSupply,
                    circulatingSupply,
                    decimals,
                    symbol,
                    description,
                    url,
                    logoUrl,
                })
                await checkActiveProfileAuth(mintAction, { stronghold: true, ledger: false })
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
                decimalsInput?.validate(isDecimalsValid()),
                isSymbolValid(),
            ])
            return true
        } catch (error) {
            console.error('Error: ', error)
            return false
        }
    }

    function isNameValid(): Promise<void> {
        if (!tokenName) {
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
        return new Promise((resolve, reject) => {
            if (decimals.toString().length < 1) {
                reject('Decimals is required')
            } else if (Number(decimals) < 0) {
                reject('Decimals must be greater than or equal to 0')
            } else {
                resolve()
            }
        })
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
            bind:value={tokenName}
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
        <optional-inputs class="flex flex-row flex-wrap gap-4">
            <OptionalInput
                bind:this={decimalsInput}
                bind:value={decimals}
                inputType="number"
                isInteger
                maxlength={MAX_SUPPORTED_DECIMALS}
                label={localize('popups.mintNativeTokenForm.inputs.decimals')}
                description={localize('tooltips.mintNativeTokenForm.decimals')}
                fontSize="14"
            />
            <OptionalInput
                bind:value={description}
                label={localize('popups.mintNativeTokenForm.inputs.description')}
                description={localize('tooltips.mintNativeTokenForm.description')}
                fontSize="14"
            />
            <OptionalInput
                bind:value={url}
                label={localize('popups.mintNativeTokenForm.inputs.url')}
                description={localize('tooltips.mintNativeTokenForm.url')}
                fontSize="14"
            />
            <OptionalInput
                bind:value={logoUrl}
                label={localize('popups.mintNativeTokenForm.inputs.logoUrl')}
                description={localize('tooltips.mintNativeTokenForm.logoUrl')}
                fontSize="14"
            />
        </optional-inputs>
        {#if error}
            <Error error={error?.message} />
        {/if}
    </div>

    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" disabled={$isTransferring} onClick={handleCancel}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" disabled={$isTransferring} onClick={handleMint} isBusy={$isTransferring}>
            {localize('actions.mint')}
        </Button>
    </div>
</div>
