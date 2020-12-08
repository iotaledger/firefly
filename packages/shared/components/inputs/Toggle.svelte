<script>
    export let on = undefined

    $: active = $on === true
</script>

<style type="text/scss">
    toggle {
        display: block;
        position: relative;
        width: 41px;
        height: 23px;
        border-radius: 23px;
        background: var(--line-separator-color);
        cursor: pointer;
    }

    knob {
        position: absolute;
        top: 2px;
        left: 2px;
        height: 19px;
        width: 19px;
        border-radius: 19px;
        background: var(--ui-blue-color);
        opacity: 0.2;
        transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);

        &.active {
            left: 20px;
            opacity: 1;
        }
    }
</style>

<toggle
    on:click={() => {
        on.update((on) => !on)
    }}>
    <knob class:active />
</toggle>
