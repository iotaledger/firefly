<script lang="typescript">
    import { Icon, Text } from 'shared/components'

    export let classes: string = ''
    export let icon: 'info' | 'exclamation' | 'none' = 'none'
    export let iconClasses: string = ''
    export let hint: string = ''
    export let iconSize: string
    export let hintColor = 'gray-500'
    export let hintDarkColor = 'gray-500'
    export let hintClasses: string = ''
</script>

{#if hint}
    <div class="flex flex-row items-center p-4 rounded-2xl {classes}">
        {#if icon !== 'none'}
            <Icon
                {icon}
                height={iconSize}
                width={iconSize}
                classes="mr-3 fill-current {iconClasses ? iconClasses : 'text-black dark:text-white'}"
            />
        {/if}
        <Text fontSize="14" lineHeight="5" color={hintColor} darkColor={hintDarkColor} classes={hintClasses}
            >{hint}</Text
        >
    </div>
{/if}
