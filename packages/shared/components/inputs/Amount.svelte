<script>
    import { Icon, Text } from 'shared/components'
    export let amount = undefined
    export let unit = undefined
    export let label = undefined
    export let locale = undefined
    export let classes = ''
    let dropdown = false
    function onKey(e) {
        if (e.keyCode === 8 || e.target.value.length <= 12) {
            return true
        } else {
            e.target.value = e.target.value.substring(0, 12)
        }
    }
    const clickOutside = () => {
        dropdown = false
    }
</script>

<style type="text/scss">
    amount-input {
        position: relative;
        display: block;
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        input {
            width: 100%;
            padding: 15px 40px 16px 13px;
            color: var(--text-secondary-color);
            background: var(--element-bg-color);
            border-color: var(--line-separator-color);
            border-radius: 10px;
            box-shadow: -2px -2px 4px rgba(255, 255, 255, 0.2), 0px 4px 8px rgba(65, 114, 248, 0.08);
            font-size: 12px;
            line-height: 140%;
            font-weight: 700;
        }
        button {
            position: absolute;
            top: 0;
            right: 0;
            width: 65px;
            background: content-box;
            height: 100%;
            color: var(--ui-blue-color);
            text-align: center;
            font-weight: 700;
            font-size: 12px;
            line-height: 140%;
            border-left: 1px solid var(--line-separator-color);
        }
    }
</style>

<svelte:window on:click={clickOutside} />

<amount-input class={classes}>
    <Text type="p" classes="mb-2" smaller>{label || locale('general.amount')}</Text>
    <input type="number" placeholder={label || locale('general.amount')} on:keydown={onKey} bind:value={amount} />
    <button
        on:click={(e) => {
            e.preventDefault()
            e.stopPropagation()
            dropdown = !dropdown
        }}>
        {unit}
    </button>
</amount-input>
