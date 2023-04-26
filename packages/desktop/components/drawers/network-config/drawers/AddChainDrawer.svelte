<script lang="ts">
    import { localize } from '@core/i18n'
    import { ChainMetadata, IIscpChainMetadata, network } from '@core/network'
    import { ChainType } from '@core/network/enums'
    import { Button, HTMLButtonType, Input } from '@ui'
    import { onMount } from 'svelte'

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

    function handleSubmit(): void {
        // TODO: Fetch chainId from ISCP node before adding it to profile
    }

    onMount(() => {
        void onMountHelper()
    })

    async function onMountHelper(): Promise<void> {
        console.log('NETWORK: ', $network)
        console.log('NETWORK STATUS: ', $network.getStatus())
        const chainMetadata = <ChainMetadata>{
            name: 'ShimmerEVM',
            chainId: 1071,
            aliasAddress: 'rms1prwgvvw472spqusqeufvlmp8xdpyxtrnmvt26jnuk6sxdcq2hk8scku26h7',
            iscpEndpoint: 'https://json-rpc.evm.testnet.shimmer.network',
        }
        const chain = await $network.addChain(chainMetadata)
        const latestBlock = await chain.getLatestBlock()
        console.log('LATEST BLOCK: ', latestBlock)
    }
</script>

<add-chain-drawer class="h-full flex flex-col justify-between">
    <form id="add-chain-form" class="flex flex-col gap-3" on:submit|preventDefault={handleSubmit}>
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
    <Button
        type={HTMLButtonType.Submit}
        form="add-chain-form"
        classes="w-full"
        disabled={submitDisabled || isBusy}
        {isBusy}
    >
        {localize('views.dashboard.drawers.networkConfig.addChain.title')}
    </Button>
</add-chain-drawer>
