<script lang="typescript">
    import { Tile } from 'shared/components'
    import { FontWeightText } from 'shared/components/Text.svelte'

    export let icon = ''
    export let iconColor = ''
    export let iconBackgroundColor = ''
    export let iconLabel = ''
    export let iconLabelFontWeight = FontWeightText.semibold
    export let iconSubLabel = ''
    export let iconSubLabelFontWeight = FontWeightText.normal
    export let tileText = ''
    export let tileTextFontWeight = FontWeightText.semibold
    export let tileSubText = ''
    export let tileSubTextFontWeight = FontWeightText.normal
    export let onClick: () => void
</script>

<button
    class="w-full rounded-2xl flex flex-row justify-between items-center bg-gray-50 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700"
    on:click={onClick}
>
    <Tile {...$$props} />
</button>
