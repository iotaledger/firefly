<script lang="ts">
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import { ClosableInput, AddInputButton, FontWeight, InformationTooltip } from 'shared/components'
    import { Position } from 'shared/components/enums'

    export let label: string = ''
    export let description: string = ''
    export let value: string | undefined = undefined
    export let fontSize: number = 15
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
        {fontSize}
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
                <InformationTooltip anchor={buttonElement} position={Position.Right} title={label} body={description} />
            </tooltip-container>
        {/if}
    {/if}
</optional-input>
