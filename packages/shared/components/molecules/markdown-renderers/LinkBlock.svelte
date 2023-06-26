<script lang="typescript">
    import { openUrlInBrowser } from '@core/app/utils'
    import { Link } from '@ui'

    export let href = ''

    function onLinkClick(): void {
        openUrlInBrowser(href)
    }
</script>

<Link classes="break-all" onClick={onLinkClick}><slot /></Link>
