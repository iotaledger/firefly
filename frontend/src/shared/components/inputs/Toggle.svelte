<script>
    export let on
    export let disabled

    $: active = $on === true
</script>

<style>
    toggle {
        display: block;
        position: relative;
        width: 41px;
        height: 23px;
        border-radius: 23px;
        background: var(--line-separator-color);
        cursor: pointer;
    }

    toggle.disabled {
        pointer-events: none;
    }

    knob,
    toggle.disabled knob.active {
        position: absolute;
        top: 2px;
        left: 2px;
        height: 19px;
        width: 19px;
        border-radius: 19px;
        background: var(--ui-blue-color);
        opacity: 0.2;
        transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    knob.active {
        left: 20px;
        opacity: 1;
    }
</style>

<toggle
    on:click={() => {
        on.update((on) => !on)
    }}
    class:disabled>
    <knob class:active />
</toggle>
