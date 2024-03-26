<script lang="ts">
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import { ClosableInput, FontWeight, InformationTooltip, Icon, Text } from '@ui'
    import { Position } from '@ui/enums'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let label: string = ''
    export let description: string = ''
    export let value: string | number | undefined = undefined
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
        <button
            bind:this={buttonElement}
            class="py-1.5 px-3 w-max bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-500 rounded-md"
            on:click={open}
            on:mouseenter={onMouseEnter}
            on:mouseleave={onMouseLeave}
        >
            <div class="flex flex-row items-center space-x-2">
                <Icon icon={IconEnum.Plus} height="10" width="10" classes="text-gray-600" />
                <Text fontSize="12" color="gray-600">{label}</Text>
            </div>
        </button>

        {#if isTooltipVisible}
            <tooltip-container transition:fade={{ duration: 100 }}>
                <InformationTooltip anchor={buttonElement} position={Position.Right} title={label} body={description} />
            </tooltip-container>
        {/if}
    {/if}
</optional-input>
