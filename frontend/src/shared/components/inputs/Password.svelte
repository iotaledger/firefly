<script>
    import { Icon } from '@shared-components'
    export let locale
    export let classes
    export let strength = null
    export let showStrengthLevel = false
    export let showRevealToggle = false

    export let type = 'password'
    export let value = ''
    export let revealed = false

    const handleInput = (event) => {
        value = event.target.value
    }

    const revealToggle = (event) => {
        const input = event.currentTarget.previousElementSibling

        if (!input) {
            return
        }

        input.type = input.type === 'password' ? 'text' : 'password'
        revealed = !revealed

        console.log('here')
    }
</script>

<style type="text/scss">
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input {
        font-size: 12px;
        line-height: 140%;
        color: #9aadce;
        font-weight: 700;
        width: 100%;
    }

    input {
        padding: 15px 30px 16px 13px;
        background: #ffffff;
        border: 1px solid #eef4ff;
        box-sizing: border-box;
        box-shadow: -2px -2px 4px rgba(255, 255, 255, 0.2), 0px 4px 8px rgba(65, 114, 248, 0.08);
        border-radius: 10px;
    }

    :global(password-input svg path) {
        fill: #108cff;
    }
</style>

<password-input class={classes} class:with-toggle={showRevealToggle}>
    {#if showRevealToggle === true}
        <input {type} {value} class:toggle={showRevealToggle} placeholder={locale('general.password')} on:input={handleInput} />
    {/if}
    <button class="unstyled" on:click={(e) => revealToggle(e)}>
        <Icon icon={revealed ? 'view' : 'hide'} />
    </button>
</password-input>
