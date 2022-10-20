<script lang="typescript">
    import { setClipboard } from '@core/utils'
    import { Icon } from 'shared/components'

    export let itemToCopy: string
</script>

<button class="ml-2" on:click={() => setClipboard(itemToCopy.toLowerCase())}>
    <Icon icon="copy" classes="text-gray-500" />
</button>
