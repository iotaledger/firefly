<script lang="typescript">
    import { openUrlInBrowser } from '@core/app/utils'

    export let href = ''
    export let title = undefined

    function onLinkClick(): void {
        openUrlInBrowser(href)
    }
</script>

<button class="inline-block break-words w-full text-left" on:click={onLinkClick}><slot /></button>
