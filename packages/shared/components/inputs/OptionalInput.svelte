<script lang="typescript">
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import { ClosableInput, AddInputButton, Tooltip, Text } from 'shared/components'
    import { Position } from 'shared/components/Tooltip.svelte'
    import { FontWeight, TextType } from 'shared/components/Text.svelte'

    export let label: string = ''
    export let description: string = ''
    export let value: string = null
    export let error: string = ''
    export let classes: string = null
    export let isOpen: boolean = false
    export let isTooltipVisible: boolean = false

    let buttonElement: HTMLButtonElement

    export function open(): void {
        isOpen = true
    }

    export async function validate(promise: Promise<unknown>): Promise<void> {
        error = ''
        try {
            await promise
        } catch (err) {
            error = err
            throw err
        }
    }

    function onMouseEnter(): void {
        isTooltipVisible = !!description // only show tooltip if it has description
    }

    function onMouseLeave(): void {
        isTooltipVisible = false
    }

    $: if (!isOpen) {
        isTooltipVisible = false
    }
    $: value, (error = '')

    onMount(() => {
        if (value) {
            open()
        }
    })
</script>

<optional-input class={`${isOpen ? 'order-first' : 'order-last'} ${classes}`} class:w-full={isOpen}>
    <ClosableInput
        bind:buttonElement
        bind:open={isOpen}
        bind:value
        bind:error
        {label}
        placeholder={label}
        fontSize="15"
        fontWeight={FontWeight.medium}
        {...$$restProps}
    />
    {#if !isOpen}
        <AddInputButton
            bind:buttonElement
            bind:open={isOpen}
            text={label}
            onClick={open}
            {onMouseEnter}
            {onMouseLeave}
        />
        {#if isTooltipVisible}
            <tooltip-container transition:fade={{ duration: 100 }}>
                <Tooltip anchor={buttonElement} position={Position.Right}>
                    <Text
                        bigger
                        type={TextType.h5}
                        fontWeight={FontWeight.medium}
                        classes="text-left mb-2"
                        color="gray-900">{label}</Text
                    >
                    <Text smaller classes="text-left" color="gray-700" lineHeight="leading-140">{description}</Text>
                </Tooltip>
            </tooltip-container>
        {/if}
    {/if}
</optional-input>
