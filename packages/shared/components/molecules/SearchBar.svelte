<script type="typescript">
    import { Icon, Input } from 'shared/components'

    export let searchActive: boolean
    export let searchValue: string
    export let inputElement: HTMLInputElement
</script>

<div class="z-0 flex items-center absolute right-0 transition-all {searchActive ? 'w-full' : 'w-0'} overflow-hidden">
    <Icon icon="search" classes="z-10 absolute left-2 text-gray-500" />
    <Input bind:value={searchValue} classes="z-0" style="padding: 0 2.5rem;" bind:inputElement />
    <button on:click={() => (searchActive = !searchActive)} class="z-10 absolute right-2">
        <Icon icon="close" classes="text-gray-500 hover:text-blue-500" />
    </button>
</div>
