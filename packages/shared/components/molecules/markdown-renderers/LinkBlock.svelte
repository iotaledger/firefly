<script lang="typescript">
    import { openUrlInBrowser } from '@core/app/utils'

    export let href = ''
    export let title = undefined

    function onLinkClick(): void {
        openUrlInBrowser(href)
    }
</script>

<button on:click={onLinkClick}><slot /></button>
