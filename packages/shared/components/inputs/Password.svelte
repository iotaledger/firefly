<script>
    import Error from './Error'
    import Input from './Input'
    import { Icon } from 'shared/components'

    export let value = ''
    export let classes = ''
    export let strength = 0
    export let showStrengthLevel = false
    export let showRevealToggle = false
    export let strengthLevels = 4
    export let placeholder = undefined
    export let locale = undefined
    export let maxlength = undefined
    export let error = null

    let revealed = false
    let type = 'password'

    const revealToggle = () => {
        type = type === 'password' ? 'text' : 'password'
        revealed = !revealed
    }
</script>

<style type="text/scss">
    div {
        button {
            right: 12px; // TODO: unable to use tailwind inset
        }
        strength-meter {
            span {
                width: 22px;
                height: 4px;
                &.weak {
                    @apply bg-orange-500;
                }
                &.strong {
                    @apply bg-green-500;
                }
            }
        }
    }
</style>

<div class={classes}>
    {#if showStrengthLevel}
        <strength-meter class="flex flex-row justify-end mb-2">
            {#each Array(strengthLevels) as _, i}
                <span class="ml-1 w-1.5 h-0.5 rounded-lg bg-gray-300"class:strong={strength === 4} class:weak={i - strength < 0}/>
            {/each}
        </strength-meter>
    {/if}
    <div class='flex w-full relative'>
        <Input
            {error}
            {type}
            bind:value
            {maxlength}
            placeholder={placeholder || locale('general.password')} 
        />
        {#if showRevealToggle === true}
            <button type="button" on:click={(e) => revealToggle(e)} tabindex="-1" class="absolute top-3">
                <Icon icon={revealed ? 'view' : 'hide'} classes="text-blue-500" />
            </button>
        {/if}
    </div>
</div>
