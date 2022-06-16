<script lang="typescript">
    import { Button } from 'shared/components'

    export let icon = undefined
    export let iconColor = ''
    export let iconHeight: string
    export let iconWidth: string
    export let classes = ''
    export let hidden = false
    export let disabled = false

    export let onClick: () => unknown
</script>

<Button secondary {icon} {iconColor} {iconHeight} {iconWidth} {hidden} {disabled} classes="w-full {classes}" {onClick}>
    <slot />
</Button>
