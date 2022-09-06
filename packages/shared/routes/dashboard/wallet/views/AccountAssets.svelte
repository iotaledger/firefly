<script lang="typescript">
    import { localize } from '@core/i18n'
    import { AssetTile, Text, Spinner } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { assets } from 'shared/lib/assets'
    import { isSyncing, currentSyncingAccountStore, selectedAccountIdStore } from '@lib/wallet'

    export let classes = ''
    export let scroll = true
    export let bottomOffset = '1.5rem'
    export let scrollDetection = (node: Element): void => {}

    $: isSelectedAccountSyncing = $currentSyncingAccountStore?.id === $selectedAccountIdStore || $isSyncing
</script>

<div
    class="w-full h-full flex flex-auto flex-col flex-shrink-0 {$mobile ? 'p-5' : 'p-6'} {classes}"
    style="--bottom-offset: {bottomOffset}"
>
    <div class="flex relative">
        <Text classes="text-left mr-2 mt-1 mb-3" type="h5">{localize('general.myAssets')}</Text>
        {#if isSelectedAccountSyncing && $mobile}
            <Spinner busy={true} classes="absolute right-0" />
        {/if}
    </div>
    <div
        class="account-assets flex flex-auto flex-col h-0 -mr-2 pr-2 py-4 {scroll
            ? 'overflow-y-auto scroll-secondary'
            : ''}"
        use:scrollDetection
    >
        {#each $assets as asset}
            <div class="w-full mb-2.5">
                <AssetTile {asset} />
            </div>
        {/each}
    </div>
</div>

<style>
    .account-assets {
        margin-bottom: var(--bottom-offset);
    }
</style>
