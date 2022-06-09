<script lang="typescript">
    import { Icon, Text } from 'shared/components'

    export let classes: string = ''
    export let icon: 'info' | 'exclamation' | 'none' = 'none'
    export let iconClasses: string = ''
    export let hint: string = ''
    export let hintColor = 'black'
    export let hintDarkColor = 'white'
    export let hintClasses: string = ''
</script>

{#if hint}
    <div class="flex flex-row items-center {classes}">
        {#if icon !== 'none'}
            <Icon {icon} classes="mr-3 fill-current {iconClasses ? iconClasses : 'text-black dark:text-white'}" />
        {/if}
        <Text fontSize="14" lineHeight="5" color={hintColor} darkColor={hintDarkColor} classes={hintClasses}
            >{hint}</Text
        >
    </div>
{/if}
