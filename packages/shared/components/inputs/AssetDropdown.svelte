<script lang="typescript">
    import { FontWeightText } from 'components/Text.svelte'

    import { Icon, Text } from 'shared/components'
    import { assets } from 'shared/lib/assets'

    export let asset = $assets?.[0]
</script>

{#if asset}
    <div class="flex flex-row items-center px-2 space-x-2 text-left bg-gray-100 rounded-md">
        <div class="icon h-6 w-6 rounded-full flex items-center justify-center bg-black p-0.5">
            <Icon classes="text-white" icon={asset?.name?.toLocaleLowerCase()} height="100%" width="100%" />
        </div>
        <Text color="gray-600" fontWeight={FontWeightText.semibold} fontSize="15" classes="font-semibold"
            >{asset?.name}</Text
        >
    </div>
{/if}
