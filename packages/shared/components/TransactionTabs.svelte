<!--
    @component TransactionTabs, handle transactions filtered by tabs.
	@param {Array} list - array of objects to filter / show.
    @param {number} selected - Default 0, selected tab array index.
    @param {Array} tabs - Default ['all', 'incoming', 'outgoing'], tabs or filter array.
-->
<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { createEventDispatcher, tick } from 'svelte'
    import { flip } from 'svelte/animate'
    import * as easing from 'svelte/easing'
    import { fly, fade } from 'svelte/transition'
    import { localize } from '@core/i18n'
    import { icons } from 'shared/components/icon/icons'

    const dispatch = createEventDispatcher()
    const icon = icons['search']
    export let list = []
    export let selected = 0
    export let tabs = ['all', 'incoming', 'outgoing']

    let current = tabs[selected]
    let isSearching = false
    let searchInput: HTMLInputElement

    const filterBy = (item) => item?.payload?.data?.essence?.data?.incoming

    $: filtered = list.filter(
        (item) =>
            current === 'all' ||
            (current === 'incoming' && filterBy(item)) ||
            (current === 'outgoing' && !filterBy(item))
    )
    $: if (isSearching) {
        focusInput()
    }

    async function focusInput() {
        const untilFinishAnimation = (ms: number) => new Promise((r) => setTimeout(r, ms))
        await untilFinishAnimation(500)
        await tick()
        searchInput.focus()
    }
</script>

<div class="flex flex-auto flex-col h-full space-y-4 py-2 px-4">
    <nav class="grid justify-around gap-4 items-center mt-7">
        <ul class="relative flex items-center p-0" style="border-radius: 11px;">
            {#each tabs as tab, i}
                <li id="tab{i + 1}" class:selected={current === tab} class="z-10 relative">
                    <button on:click={() => (current = tab)}>
                        <Text
                            classes="text-13"
                            bold={current === tab}
                            highlighted={current === tab}
                            secondary={current !== tab}
                        >
                            {localize(`general.${tab}`)}</Text
                        >
                    </button>
                </li>
            {/each}
            <span
                id="check-square"
                class="absolute z-0 text-blue-500 border-b-2 border-blue-500 border-solid shadow-sm"
            />
        </ul>
        <span
            id="search"
            on:click={() => (isSearching = !isSearching)}
            class="col-start-2 row-start-1 z-10 pr-4 rounded-xl"
        />
        <div
            role="searchbox"
            class="z-10 absolute right-0 h-10 mr-8 rounded-xl bg-gray-100 dark:bg-gray-900"
            style="width: {!isSearching ? '0' : '86vw'}; transition: width 0.5s cubic-bezier(0, 0.5, 0, 1) {!isSearching
                ? '0.4s'
                : '0.1s'};"
        >
            <input
                type="search"
                spellcheck="false"
                autocomplete="false"
                bind:this={searchInput}
                on:input={(e) => dispatch('search', e.data ?? 'BACKSPACE')}
                class="text-13 h-10 w-11/12 pl-10 text-blue-500 dark:text-white"
                style="-webkit-appearance: none; appearance: none; background: rgba(0,0,0,0); display: {!isSearching
                    ? 'none'
                    : 'block'}"
            />
        </div>
        <svg
            width={icon.width}
            height={icon.height}
            viewBox="0 0 {icon.width} {icon.height}"
            class="icon col-start-2 row-start-1 z-10 text-blue-500 dark:text-white"
            style="margin-left: {isSearching ? '-73vw' : '8px'}; transform: rotate({!isSearching ? 0 : 90}deg);"
        >
            <path
                d={icon.path[0].d}
                fill-rule={icon.path[0].fillRule}
                clip-rule={icon.path[0].clipRule}
                class:fill-current={true}
            />
        </svg>
        {#if isSearching}
            <span
                class="col-start-2 row-start-1 z-10"
                in:fade={{ duration: 357, delay: 500, easing: easing.quadOut }}
                out:fade={{ duration: 150, easing: easing.quadIn }}
            >
                <Icon icon="close" classes="z-10 ml-2 text-blue-500 dark:text-white" width="22" height="22" />
            </span>
        {/if}
        <button id="search" on:click={() => (isSearching = !isSearching)} class="col-start-2 row-start-1 z-10" />
    </nav>
    <main class="flex flex-auto flex-col overflow-y-auto space-y-2 h-1">
        {#if filtered.length > 0}
            {#each filtered as transaction (transaction.timestamp)}
                <div
                    class="block"
                    in:fly={{ y: 30, duration: 400, easing: easing.sineIn }}
                    out:fly={{ y: 15, duration: 200, easing: easing.sineIn }}
                    animate:flip={{ duration: 700 }}
                >
                    <slot name="transaction" {transaction} />
                </div>
            {/each}
        {:else}
            <slot />
        {/if}
    </main>
</div>

<style type="text/scss">
    /* clears the 'X' from Chrome */
    input[type='search']::-webkit-search-decoration,
    input[type='search']::-webkit-search-cancel-button,
    input[type='search']::-webkit-search-results-button,
    input[type='search']::-webkit-search-results-decoration {
        display: none;
    }

    .icon {
        transition: margin-left 0.5s cubic-bezier(0, 0.5, 0, 1.08) 0.2s,
            transform 0.5s cubic-bezier(0, 0.5, 0, 1.15) 0.2s;
    }
    ul {
        --offset: 1px;
        --button-count: 3;
        // TODO check for small screens, value could be 23vw
        --button-width: min(24vw, calc(60vw / var(--button-count)));
        --button-height: 34px;
        border-width: calc(var(--offset) * var(--button-count));
        border-color: rgba(0, 0, 0, 0);
        border-style: solid;
    }

    ul li#tab1.selected ~ #check-square {
        left: 0;
    }
    ul li#tab2.selected ~ #check-square {
        left: var(--button-width);
    }
    ul li#tab3.selected ~ #check-square {
        left: calc(var(--button-width) * 2);
    }

    #check-square {
        width: var(--button-width);
        height: var(--button-height);
        transition: left 0.5s cubic-bezier(0, 0.5, 0, 1.1);
        will-change: left;
    }
    button {
        width: var(--button-width);
        height: var(--button-height);
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        user-select: none;
        -webkit-user-select: none;
    }
    button:active {
        color: blue;
    }

    #search {
        padding: 9px;
        width: 40px;
        height: 40px;
    }
</style>
