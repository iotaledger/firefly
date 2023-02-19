<script lang="typescript">
    import { openUrlInBrowser } from '@core/app/utils'

    export let href = ''
    export let title = undefined

    function handleLinkClick(): void {
        openUrlInBrowser(href)
    }
</script>

<button on:click={handleLinkClick}><slot /></button>
