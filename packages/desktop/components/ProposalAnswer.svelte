<script lang="ts">
    import type { Answer } from '@iota/wallet/out/types'

    import { Icon, PingingBadge, Text, TooltipIcon } from '@ui'
    import { FontWeight, Position } from '@ui/enums'

    import { appSettings } from '@core/app/stores'

    import { ProposalStatus } from '@contexts/governance'

    import { Icon as IconEnum } from '@auxiliary/icon'

    export let onAnswerClick: () => void

    export let answer: Answer
    export let answerIndex: number = undefined
    export let votedAnswerValue: number = undefined
    export let selectedAnswerValue: number = undefined
    export let percentage: string = ''
    export let disabled = false
    export let hidden: boolean = null
    export let isWinner: boolean
    export let proposalStatus: string
    export let truncate = false
    export let isLoading = false

    let isSelected: boolean
    let isVotedFor: boolean

    $: selectedAnswerValue, votedAnswerValue, setIsSelected()
    $: isVotedFor = votedAnswerValue === answer?.value
    $: dark = $appSettings.darkMode

    function onClick(): void {
        if (!disabled && !hidden && !isLoading) {
            onAnswerClick()
        }
    }

    function setIsSelected(): void {
        if (selectedAnswerValue === answer?.value) {
            isSelected = true
        } else if (selectedAnswerValue === undefined && votedAnswerValue === answer?.value) {
            isSelected = true
        } else {
            isSelected = false
        }
    }
</script>

<button
    type="button"
    class="proposal-answer"
    class:dark
    class:disabled
    class:hidden={isSelected || isWinner ? false : hidden}
    class:voted={isVotedFor}
    class:winner={isWinner}
    class:selected={isSelected}
    class:cursor-default={isLoading}
    style:--percentage={percentage}
    on:click={onClick}
>
    <div class="flex space-x-3 items-center w-full min-w-0">
        {#if answerIndex !== undefined}
            {#if isVotedFor}
                <status-icon class="flex justify-center items-center w-5 h-5">
                    {#if proposalStatus === ProposalStatus.Ended}
                        <Icon icon={IconEnum.Voted} width={20} height={20} />
                    {:else if proposalStatus === ProposalStatus.Commencing}
                        <Icon icon={IconEnum.History} width={20} height={20} />
                    {:else if proposalStatus === ProposalStatus.Holding}
                        <PingingBadge classes="relative" />
                    {/if}
                </status-icon>
            {:else}
                <answer-index>{answerIndex + 1}</answer-index>
            {/if}
        {/if}
        <Text fontWeight={FontWeight.medium} classes="w-full {truncate ? 'truncate' : ''}">{answer.text}</Text>
    </div>
    <div class="flex items-center space-x-1.5">
        {#if isWinner}
            <Icon icon={IconEnum.Trophy} />
        {/if}
        {#if percentage}
            <Text
                smaller
                fontWeight={FontWeight.medium}
                classes="h-3 ml-auto text-gray-700 dark:text-gray-500"
                overrideColor
            >
                {percentage}
            </Text>
        {/if}
        {#if answer.additionalInfo}
            <TooltipIcon
                icon={IconEnum.Info}
                classes="w-3 h-3"
                iconClasses="text-gray-600 dark:text-gray-500"
                text={answer.additionalInfo}
                position={Position.Left}
                width={12}
                height={12}
            />
        {/if}
    </div>
</button>

<style lang="scss">
    .proposal-answer {
        @apply rounded-md border border-solid border-gray-200;
        @apply relative hidden items-center justify-between p-3 overflow-hidden;
        > * {
            z-index: 2;
        }

        &::after {
            @apply z-10 absolute inline-block h-full -ml-3 mr-auto;
            @apply rounded-l-md bg-gray-100;
            content: '';
            width: var(--percentage);
            z-index: 1;
        }

        &:not(.disabled):hover {
            @apply border-blue-500;
        }

        &:not(.hidden) {
            @apply flex;
        }

        &:not(.winner) status-icon :global(svg) {
            @apply text-blue-500;
        }

        &.selected {
            @apply border-blue-500;

            answer-index {
                @apply bg-blue-500 text-white;
            }
        }

        &.voted {
            &:hover {
                @apply bg-blue-50;
            }

            &::after {
                @apply bg-blue-100;
            }
        }

        &.winner {
            @apply bg-blue-500;

            &::after {
                @apply bg-blue-600;
            }

            answer-index {
                @apply bg-blue-600 text-white;
            }

            :global(*) {
                @apply text-white;
            }
        }

        &.dark:not(.selected) {
            @apply border-transparent;
        }

        &.dark:not(.winner) {
            @apply bg-gray-900;

            &::after {
                @apply bg-gray-1000;
            }

            answer-index {
                @apply bg-gray-900 border-gray-800;
            }
        }

        &.disabled {
            @apply cursor-default;
        }

        answer-index {
            @apply flex items-center justify-center h-5 w-5 bg-white;
            @apply border border-solid border-gray-200;
            @apply font-bold text-12 text-gray-500;
        }
    }
</style>
