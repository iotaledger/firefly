<script lang="typescript">
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { Icon, Text } from 'shared/components'
    import { assets } from 'shared/lib/assets'

    export let asset = $assets?.[0]
</script>

{#if asset}
    <div
        class="flex flex-row items-center p-2 space-x-2 text-left bg-gray-100 dark:bg-gray-700 rounded-md cursor-pointer"
    >
        <div class="icon h-6 w-6 rounded-full flex items-center justify-center bg-black p-0.5">
            <Icon classes="text-white" icon={asset?.meta.name.toLocaleLowerCase()} height="100%" width="100%" />
        </div>
        <Text color="gray-600" darkColor="gray-500" fontWeight={FontWeightText.semibold} fontSize="15">
            {asset?.meta.name}
        </Text>
        <div class="transform rotate-0">
            <Icon height="18" width="18" icon="chevron-down" classes="text-gray-600 dark:text-gray-500" />
        </div>
    </div>
{/if}
