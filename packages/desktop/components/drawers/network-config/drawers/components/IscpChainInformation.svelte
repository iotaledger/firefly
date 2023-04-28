<script lang="ts">
    import { localize } from '@core/i18n'
    import { IIscpChainConfiguration } from '@core/network'
    import { Pane, Text, HR, FontWeight, CopyableBox } from '@ui'

    export let chainConfiguration: IIscpChainConfiguration

    $: info = {
        ...(chainConfiguration.chainId && {
            chainId: chainConfiguration.chainId,
        }),
        ...(chainConfiguration.aliasAddress && {
            aliasAddress: chainConfiguration.aliasAddress,
        }),
        ...(chainConfiguration.iscpEndpoint && {
            iscpEndpoint: chainConfiguration.iscpEndpoint,
        }),
        ...(chainConfiguration.explorerUrl && {
            explorerUrl: chainConfiguration.explorerUrl,
        }),
    }
</script>

<add-chain-drawer class="h-full w-full flex flex-col justify-between">
    <Pane>
        {#each Object.keys(info) as key}
            <CopyableBox value={info[key]}>
                <div class="w-full text-left">
                    <Text fontWeight={FontWeight.medium} fontSize="13" color="gray-600"
                        >{localize(`views.dashboard.drawers.networkConfig.chain.${key}`)}</Text
                    >
                    <Text fontWeight={FontWeight.semibold} fontSize="15" classes="break-words">{info[key]}</Text>
                </div>
            </CopyableBox>
            <HR />
        {/each}
    </Pane>
</add-chain-drawer>
