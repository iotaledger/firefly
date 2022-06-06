<script lang="ts">
    // this is a wrapper component for svelty-picker

    import SveltyPicker from 'svelty-picker'
    import { Tooltip, Icon } from 'shared/components'
    import { createEventDispatcher } from 'svelte'

    export let value: Date

    const dispatch = createEventDispatcher()
    const DATE_NOW = new Date(Date.now())
    const startDate = DATE_NOW.toLocaleString('sv')

    let rawValue: string = startDate

    function clickClose() {
        dispatch('close')
    }

    $: value = new Date(rawValue).getTime() >= DATE_NOW.getTime() ? new Date(rawValue) : DATE_NOW
</script>

<Tooltip inlineStyle="padding: 0 0.5rem 0.5rem 0.5rem;" {...$$restProps}>
    <button on:click={clickClose} class="block ml-auto mr-2 mt-2">
        <Icon icon="close" classes="text-gray-600 dark:text-white" />
    </button>
    <SveltyPicker
        pickerOnly
        autoclose
        clearBtn={false}
        {startDate}
        format="yyyy-mm-dd hh:ii"
        theme="datetime-picker-colors"
        bind:value={rawValue}
    />
</Tooltip>

<style type="text/scss">
    :global(body.scheme-dark) {
        :global(.datetime-picker-colors) {
            --sdt-color: theme('colors.white');
            --sdt-btn-bg-hover: theme('colors.gray.800');
            --sdt-btn-bg-hover: theme('colors.gray.800');
            --sdt-btn-header-bg-hover: theme('colors.gray.800');
            --sdt-clock-bg: theme('colors.gray.800');
            --sdt-clock-bg-minute: theme('colors.gray.800');
        }
    }

    :global(.datetime-picker-colors) {
        --sdt-primary: theme('colors.blue.500');
        --sdt-color: theme('colors.gray.600');
        --sdt-color-selected: theme('colors.white');
        --sdt-bg-main: none;
        --sdt-bg-today: var(--sdt-primary);
        --sdt-today-color: theme('colors.white');
        --sdt-btn-bg-hover: theme('colors.gray.200');
        --sdt-btn-header-bg-hover: theme('colors.gray.200');
        --sdt-clock-bg: theme('colors.gray.200');
        --sdt-clock-bg-minute: theme('colors.gray.200');
        --sdt-clock-bg-shadow: none;
        --sdt-shadow: none;
    }
</style>
