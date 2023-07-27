<script lang="ts">
    import { openUrlInBrowser } from '@core/app/utils'
    import { Link } from '@ui'

    export let href = ''

    function onLinkClick(): void {
        openUrlInBrowser(href)
    }
</script>

<span class="break-all">
    <Link on:click={onLinkClick}><slot /></Link>
</span>
