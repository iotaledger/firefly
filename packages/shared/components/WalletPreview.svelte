<script lang="typescript">
    import { Text } from 'shared/components'

    export let name = ''
    export let color = ''
    export let pattern = ''
</script>

<div class="w-full h-52 flex flex-col mb-5 bg-{!color ? 'turquoise-500' : color} rounded-xl relative">
    <div class="flex flex-row mb-6 p-5 h-full w-full absolute grid">
        <div class="mb-32 w-full flex flex-row justify-between items-start space-x-1.5">
            <Text bold overrideColor classes="text-white overflow-hidden overflow-ellipsis">{name}</Text>
        </div>
        <div class="flex justify-between w-full flex-row space-x-4 flex-nowrap justify-items-end">
            <Text smaller overrideColor classes="block text-white">100 Gi</Text>
            <Text smaller overrideColor classes="block text-white">$ 40000</Text>
        </div>
    </div>
    {#if pattern}
        <img class="object-cover h-52" src={`assets/patterns/wallet-backgrounds/${pattern}.svg`} alt="" />
    {:else}<img src="assets/patterns/wallet-backgrounds/default.svg" alt="" />{/if}
</div>
