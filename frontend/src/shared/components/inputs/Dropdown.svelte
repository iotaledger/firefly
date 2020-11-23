<script>
    import { Icon, Text } from '@shared-components'

    export let value = undefined
    export let items = []
    export let onSelect = () => {}

    let dropdown = false

    const clickOutside = () => {
        dropdown = false
    }
</script>

<style type="text/scss">
    dropdown-input {
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: 24px;
        height: 52px;
        padding: 15px 30px 15px 15px;
        width: 100%;
        background: #ffffff;
        border: 1px solid #eef4ff;
        box-shadow: -2px -2px 4px rgba(255, 255, 255, 0.2), 0px 4px 8px rgba(65, 114, 248, 0.08);
        border-radius: 10px;
        cursor: pointer;

        :global(svg.right) {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 12px;
        }
        :global(svg.right path) {
            fill: var(--button-secondary-icon-color);
        }
    }

    nav {
        position: absolute;
        top: 50px;
        left: 0px;
        width: 100%;
        max-height: 260px;
        overflow-y: scroll;
        background: var(--element-bg-color);
        box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.25);
        border-radius: 7px;
        opacity: 0;
        transition: opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        z-index: 2;
        &.active {
            opacity: 1;
            pointer-events: all;
        }
        button {
            position: relative;
            display: flex;
            align-items: center;
            background: var(--element-bg-color);
            height: 36px;
            padding: 0 20px;
            width: 100%;
            text-align: left;
            font-size: 14px;
            &:hover {
                background: var(--line-separator-color);
            }
            &.active {
                background: var(--line-separator-color);
            }
            &:first-child {
                border-radius: 3px 3px 0 0;
            }
            &:last-child {
                border-radius: 0 0 3px 3px;
            }
        }
    }
</style>

<svelte:window on:click={clickOutside} />

<dropdown-input
    on:click={(e) => {
        e.stopPropagation()
        dropdown = !dropdown
    }}>
    <Text type="p" bold>{value}</Text>
    <Icon icon="arrow-down" classes="right" />
    <nav class:active={dropdown}>
        {#each items as item}
            <button on:click={() => onSelect(item.value)} class:active={item.label === value}> {item.label} </button>
        {/each}
    </nav>
</dropdown-input>
