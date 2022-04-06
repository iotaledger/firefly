<script lang="typescript">
    import { Icon, Text } from 'shared/components'

    export let classes: string = ''
    export let icon: 'info' | 'exclamation' | 'none' = 'none'
    export let iconClasses: string = ''
    export let hint: string = ''
    export let hintClasses: string = ''
</script>

{#if hint}
    <div class="flex flex-row items-center {classes}">
        {#if icon !== 'none'}
            <Icon {icon} classes="mr-3 fill-current {iconClasses ? iconClasses : 'text-black dark:text-white'}" />
        {/if}
        <Text type="p" overrideColor classes={hintClasses ? hintClasses : 'text-black dark:text-white'}>{hint}</Text>
    </div>
{/if}
