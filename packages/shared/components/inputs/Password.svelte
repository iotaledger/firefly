<script lang="typescript">
    import { Icon, Input, Text } from 'shared/components'
    import { Locale } from '@core/i18n'
    import { mobile } from '@lib/app'

    export let locale: Locale

    export let value = ''
    export let classes = ''
    export let strength = 0
    export let showStrengthLevel = false
    export let showRevealToggle = false
    export let strengthLevels = 4
    export let placeholder = undefined
    export let maxlength = undefined
    export let error = null
    export let integer = false
    export let autofocus = false
    export let submitHandler = undefined
    export let disabled = false

    let revealed = false
    let type = 'password'

    const revealToggle = () => {
        type = type === 'password' ? 'text' : 'password'
        revealed = !revealed
    }

    const STRENGTH_COLORS = ['gray-300', 'orange-500', 'yellow-600', 'yellow-300', 'green-700']
</script>

<div class={classes} class:disabled>
    {#if showStrengthLevel && strength !== undefined}
        <strength-meter class="flex flex-row justify-between items-center mb-2">
            <div class="flex flex-row">
                <Text smaller secondary>{locale('general.passwordStrength')}:</Text>
                <Text smaller overrideColor classes={`text-${STRENGTH_COLORS[strength]} uppercase ml-2`}>
                    {locale(`general.passwordStrength${strength}`)}
                </Text>
            </div>
            <div class="flex flex-row justify-end">
                {#each Array(strengthLevels) as _, i}
                    <span class={`ml-1 w-1.5 h-0.5 rounded-lg bg-${STRENGTH_COLORS[strength > i ? i + 1 : 0]}`} />
                {/each}
            </div>
        </strength-meter>
    {/if}
    <div class="flex  w-full relative">
        <Input
            {error}
            {type}
            bind:value
            {maxlength}
            {integer}
            {autofocus}
            {disabled}
            placeholder={placeholder || locale('general.password')}
            {submitHandler}
            disableContextMenu={!$mobile}
            spellcheck={false}
            autocomplete={$mobile ? 'current-password' : 'off'}
            {locale}
            capsLockWarning={true}
        />
        {#if showRevealToggle === true && !disabled}
            <button type="button" on:click={() => revealToggle()} tabindex="-1" class="absolute top-3 right-3">
                <Icon icon={revealed ? 'view' : 'hide'} classes="text-blue-500" />
            </button>
        {/if}
    </div>
</div>

<style type="text/scss">
    div {
        &:disabled {
            @apply pointer-events-none;
            @apply opacity-50;
        }
        strength-meter {
            span {
                width: 22px;
                height: 4px;
            }
        }
    }
</style>
