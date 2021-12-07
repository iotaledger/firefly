<script lang="typescript">
    import { Text, Icon } from 'shared/components'
    import { AccountColors, AccountPatterns } from 'shared/lib/wallet'

    export let locale
    export let title = locale('views.pickers.pattern')
    export let color = AccountColors.Default
    export let active = AccountPatterns.Default

    const handleKeyPress = (event, pattern) => event.key === 'Enter' && (active = pattern)
    const handleClick = (pattern) => active = pattern
</script>

<style type="text/scss">
    li.active {
        background-color: rgb(var(--account-color));
        --tw-ring-color: rgba(var(--account-color), var(--tw-ring-opacity));
        --tw-ring-opacity: 0.3;
    }
</style>

<div style="--account-color: {color}">
    <div class="flex flex-row mb-4">
        <Text type="h5">{title}</Text>
    </div>
    <ul class="grid grid-cols-4 grid-rows-2 gap-4">
        {#each Object.values(AccountPatterns) as pattern}
            <li
                class="h-20 rounded-lg {pattern === active ? `active opacity-100 ring-4 hover:ring-opacity-40
                focus:ring-opacity-40` : `bg-gray-300 opacity-80 hover:opacity-100 focus:opacity-100`} bg-no-repeat
                bg-center bg-cover bg cursor-pointer flex justify-center items-center"
                style={pattern ? `background-image: url("assets/patterns/${pattern}.svg");` : null}
                on:click={() => handleClick(pattern)} on:keypress={(event) => handleKeyPress(event, pattern)}
                tabindex="0" aria-label={pattern}>
                {#if pattern === active}<Icon icon="checkmark" classes="bg-green-600 text-white rounded-full" />{/if}
            </li>
        {/each}
    </ul>
</div>
