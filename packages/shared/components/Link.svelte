<script lang="ts">
    import { Icon } from 'shared/components'
    import { Icon as IconEnum } from 'shared/lib/auxiliary/icon/enums'

    export let href: string | null = null
    export let disabled: boolean = false
    export let icon: IconEnum | undefined = undefined
</script>

<a data-label="link" on:click|stopPropagation {href} class:with-icon={icon} class:disabled>
    {#if icon}
        <Icon {icon} width={20} height={20} classes="text-blue-500 mr-1 inline" />
    {/if}
    <slot />
</a>

<style lang="scss">
    a {
        @apply text-12 leading-140;
        @apply cursor-pointer;
        @apply text-blue-500;

        &:hover {
            @apply underline;
        }

        &.with-icon {
            @apply flex flex-row;
            @apply items-center;
        }
    }
</style>
