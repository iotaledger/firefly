<script lang="typescript">
    import { localize } from '@core/i18n'
    import GovernanceInfoTooltip from 'shared/components/GovernanceInfoTooltip.svelte'
    import { Icon, Text } from 'shared/components'
    import { WalletAccount } from 'shared/lib/typings/wallet'

    export let account: WalletAccount

    const tooltip = { anchor: null as HTMLElement, show: false }

    function toggleTooltip(type: string, show: boolean): void {
        tooltip.show = show
    }
</script>

<div class="flex items-center mb-3 cursor-pointer">
    <Text type="p" smaller overrideColor classes="mr-1 text-gray-700 dark:text-gray-500">
        {localize('views.governance.votingPower.title')}
    </Text>
    <button
        on:mouseenter={() => toggleTooltip('votingWeight', true)}
        on:mouseleave={() => toggleTooltip('votingWeight', false)}
        bind:this={tooltip.anchor}
    >
        <Icon width="12" height="12" icon="info-filled" classes="text-gray-700 dark:text-gray-500" />
    </button>
</div>
<Text type="h1">{account?.balance}</Text>

{#if tooltip.show}
    <GovernanceInfoTooltip type="votingWeight" anchor={tooltip.anchor} position="bottom" />
{/if}
