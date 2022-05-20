<script type="typescript">
    import { Icon, Input } from 'shared/components'

    export let searchValue: string
    export let inputElement: HTMLInputElement
</script>

<div class="z-0 flex items-center w-full">
    <Icon icon="search" classes="z-10 absolute left-2 text-gray-500" />
    <Input bind:value={searchValue} classes="z-0" style="padding: 0 1.25rem;" bind:inputElement />
</div>
