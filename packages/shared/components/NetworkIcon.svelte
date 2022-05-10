<script lang="typescript">
    import { Icon } from 'shared/components'
    import { ProfileProtocol } from '../lib/typings/profile'

    export let protocol = ''

    const commonClasses = 'rounded-full border-3 border-solid border-white dark:border-gray-900'
</script>

{#if protocol === ProfileProtocol.Iota}
    <div class="bg-black {commonClasses}">
        <Icon height="24" width="24" icon="iota" classes="text-white" />
    </div>
{:else if protocol === ProfileProtocol.Shimmer}
    <div class="bg-shimmer-highlight {commonClasses}">
        <Icon height="24" width="24" icon="shimmer" classes="text-black" />
    </div>
{/if}
