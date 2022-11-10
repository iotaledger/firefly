<script lang="typescript">
    import { Icon } from 'shared/components'

    export let href = undefined
    export let secondary = false
    export let disabled = false
    export let ghost = false
    export let classes = ''
    export let icon = undefined

    export let onClick = (): void | string => ''
</script>

<a
    class="text-12 leading-140 cursor-pointer text-blue-500 {icon && 'flex flex-row items-center'} {classes}"
    data-label="link"
    {href}
    on:click={onClick}
    class:secondary
    class:disabled
    class:ghost
>
    {#if icon}
        <Icon {icon} width={20} height={20} classes="text-blue-500 mr-1" />
    {/if}
    <slot />
</a>

<style type="text/scss">
    a:hover {
        text-decoration: underline;
    }
</style>
