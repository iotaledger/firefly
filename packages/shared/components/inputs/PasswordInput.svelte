<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { localize } from '@core/i18n'
    import { Icon, InputType, Text, TextInput } from 'shared/components'

    export let value: string
    export let classes: string | undefined = undefined
    export let strength: number = 0
    export let showStrengthLevel = false
    export let showRevealToggle = false
    export let strengthLevels = 4
    export let label: string | undefined = undefined
    export let placeholder: string | undefined = undefined
    export let maxlength: number | undefined = undefined
    export let error: string | undefined = undefined
    export let integer: boolean = false
    export let autofocus: boolean = false
    export let submitHandler: () => void = () => {}
    export let disabled: boolean = false

    let revealed: boolean = false
    let type: InputType = InputType.Password

    function revealToggle(): void {
        type = type === InputType.Password ? InputType.Text : InputType.Password
        revealed = !revealed
    }

    const STRENGTH_COLORS: string[] = ['gray-300', 'orange-500', 'yellow-600', 'yellow-300', 'green-700']
</script>

<div class={classes} class:disabled>
    {#if showStrengthLevel && strength !== undefined}
        <strength-meter class="flex flex-row justify-between items-center mb-2">
            <div class="flex flex-row">
                <Text smaller secondary>{localize('general.passwordStrength')}:</Text>
                <Text smaller color={STRENGTH_COLORS[strength]} classes="uppercase ml-2">
                    {localize(`general.passwordStrength${strength}`)}
                </Text>
            </div>
            <div class="flex flex-row justify-end">
                {#each Array(strengthLevels) as _, i}
                    <span class={`ml-1 w-1.5 h-0.5 rounded-lg bg-${STRENGTH_COLORS[strength > i ? i + 1 : 0]}`} />
                {/each}
            </div>
        </strength-meter>
    {/if}
    <div class="flex w-full relative">
        <TextInput
            bind:error
            bind:value
            inputType={type}
            {maxlength}
            {integer}
            {autofocus}
            {disabled}
            {label}
            placeholder={placeholder || localize('general.password')}
            {submitHandler}
            disableContextMenu={true}
            spellcheck="false"
            capsLockWarning={true}
        >
            <button
                type="button"
                on:mousedown|preventDefault|stopPropagation={revealToggle}
                tabindex="-1"
                class="absolute top-3 right-3"
                class:hidden={!showRevealToggle || disabled}
                slot="right"
                {...$$restProps}
            >
                <Icon icon={revealed ? IconEnum.View : IconEnum.Hide} classes="text-blue-500" />
            </button>
        </TextInput>
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
