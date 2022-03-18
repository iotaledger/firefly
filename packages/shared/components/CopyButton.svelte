<script lang="typescript">
    import { Icon } from 'shared/components'
    import { setClipboard } from '@core/utils/os'

    export let itemToCopy: string
</script>

<button class="ml-2" on:click={() => setClipboard(itemToCopy.toLowerCase())}>
    <Icon icon="copy" classes="text-gray-500" />
</button>
