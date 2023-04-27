<script lang="ts">
    import { localize } from '@core/i18n'
    import { ChainType, IChain, IIscpChainMetadata, network } from '@core/network'
    import { Button, HTMLButtonType, Input } from '@ui'

    const isBusy = false

    $: submitDisabled = !chain.name || !chain.aliasAddress || !chain.iscpEndpoint

    const chain: IIscpChainMetadata = {
        type: ChainType.Iscp,
        chainId: undefined,
        name: '',
        explorerUrl: undefined,
        aliasAddress: '',
        iscpEndpoint: '',
    }

    async function onSubmitClick(): Promise<void> {
        let chain: IChain
        try {
            const chainMetadata = <IIscpChainMetadata>{
                type: ChainType.Iscp,
                name: 'ShimmerEVM',
                chainId: 1071,
                aliasAddress: 'rms1prwgvvw472spqusqeufvlmp8xdpyxtrnmvt26jnuk6sxdcq2hk8scku26h7',
                iscpEndpoint: 'https://json-rpc.evm.testnet.shimmer.network',
            }

            chain = await $network.addChain(chainMetadata)
        } catch (err) {
            chain = await $network.getChain(1071)
            $network.removeChain(1071)
            console.error(err)
        }
        const latestBlock = await chain.getLatestBlock()
        console.log('LATEST BLOCK: ', latestBlock)
    }
</script>

<add-chain-drawer class="h-full flex flex-col justify-between">
    <form id="add-chain-form" class="flex flex-col gap-3" on:submit|preventDefault={onSubmitClick}>
        <Input bind:value={chain.name} placeholder={localize('general.name')} disabled={isBusy} />
        <Input
            bind:value={chain.aliasAddress}
            placeholder={localize('views.dashboard.drawers.networkConfig.addChain.aliasAddress')}
            disabled={isBusy}
        />
        <Input
            bind:value={chain.iscpEndpoint}
            placeholder={localize('views.dashboard.drawers.networkConfig.addChain.iscpEndpoint')}
            disabled={isBusy}
        />
        <Input
            bind:value={chain.explorerUrl}
            placeholder={localize('views.dashboard.drawers.networkConfig.addChain.explorerEndpoint')}
            disabled={isBusy}
        />
    </form>
    <Button type={HTMLButtonType.Submit} form="add-chain-form" classes="w-full" disabled={false} {isBusy}>
        {localize('views.dashboard.drawers.networkConfig.addChain.title')}
    </Button>
</add-chain-drawer>
