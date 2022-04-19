<script lang="typescript">
    import { Icon } from 'shared/components'

    export let network = ''

    const commonClasses =
        'absolute right-0 bottom-0 h-7 w-7 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-900'
</script>

{#if network === 'IOTA Mainnet' || network === 'IOTA Devnet'}
    <div class="bg-black {commonClasses}">
        <Icon width="24" height="24" icon="iota" classes="text-white" />
    </div>
{:else if network === 'Shimmer Mainnet' || network === 'Shimmer Devnet'}
    <div class="bg-shimmer-highlight {commonClasses}">
        <Icon width="24" height="24" icon="shimmer" classes="text-black" />
    </div>
{/if}
