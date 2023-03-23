<script lang="typescript">
    import { openUrlInBrowser } from '@core/app/utils'
    import { Link } from '@ui'

    export let href = ''
    export let title = undefined

    function onLinkClick(): void {
        openUrlInBrowser(href)
    }
</script>

<Link classes="break-all" onClick={onLinkClick}><slot /></Link>
