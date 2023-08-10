<script lang="ts">
    import type { AnswerStatus, Question } from '@iota/sdk/out/types'

    import { ProposalAnswer } from '@components'
    import { Icon, Text, TooltipIcon } from '@ui'
    import { FontWeight, Position } from '@ui/enums'

    import { ABSTAIN_VOTE_VALUE } from '@contexts/governance/constants'
    import { ProposalStatus } from '@contexts/governance/enums'
    import { getPercentagesFromAnswerStatuses, IProposalAnswerPercentages } from '@contexts/governance'
    import { selectedProposal } from '@contexts/governance/stores'

    import { Icon as IconEnum } from '@auxiliary/icon'

    export let onQuestionClick: (questionIndex: number) => void
    export let onAnswerClick: (answerValue: number, questionIndex: number) => void

    export let answerStatuses: AnswerStatus[] = []
    export let questionIndex: number = undefined
    export let isOpened = false
    export let question: Question
    export let selectedAnswerValue: number = undefined
    export let votedAnswerValue: number = undefined
    export let isLoading: boolean = false

    let percentages: IProposalAnswerPercentages = {}
    let winnerAnswerIndex: number

    $: answers = [...(question?.answers ?? []), { value: 0, text: 'Abstain', additionalInfo: '' }]
    $: percentages = getPercentagesFromAnswerStatuses(answerStatuses)
    $: disabled =
        $selectedProposal?.status === ProposalStatus.Upcoming ||
        $selectedProposal?.status === ProposalStatus.Ended ||
        !!$selectedProposal?.error
    $: answerStatuses, setWinnerAnswerIndex()
    $: showMargin =
        isOpened ||
        ((votedAnswerValue || votedAnswerValue === ABSTAIN_VOTE_VALUE) && !isOpened) ||
        ((selectedAnswerValue || selectedAnswerValue === ABSTAIN_VOTE_VALUE) && !isOpened) ||
        winnerAnswerIndex !== undefined

    function setWinnerAnswerIndex(): void {
        if ($selectedProposal?.status === ProposalStatus.Ended && answerStatuses?.length > 0) {
            const answersAccumulated = answerStatuses?.map((answer) => answer.accumulated)
            const maxAccumulated = Math.max(...answersAccumulated)
            winnerAnswerIndex = answersAccumulated?.indexOf(maxAccumulated)
        }
    }
</script>

<proposal-question
    class="flex flex-col px-5 py-4 rounded-xl border border-solid border-gray-200
    cursor-pointer dark:border-transparent dark:bg-gray-850"
    class:animate-pulse={isLoading}
>
    <button on:click={() => onQuestionClick(questionIndex)} class="flex justify-between items-center">
        <div class="flex flex-col min-w-0">
            {#if questionIndex !== undefined}
                <Text smaller fontWeight={FontWeight.bold} overrideColor classes="mb-1 text-blue-500">
                    Question {questionIndex + 1}
                </Text>
            {/if}
            <div class="flex flex-row space-x-1.5 items-center">
                <Text
                    fontWeight={FontWeight.bold}
                    overrideColor
                    classes="text-gray-900 dark:text-white {isOpened ? '' : 'truncate'}"
                >
                    {question.text}
                </Text>
                {#if question.additionalInfo}
                    <TooltipIcon
                        iconClasses="text-gray-600 dark:text-gray-500"
                        text={question.additionalInfo}
                        position={Position.Bottom}
                        width={13}
                        height={13}
                    />
                {/if}
            </div>
        </div>
        <Icon icon={IconEnum.ChevronDown} classes="text-gray-500 transform {isOpened ? 'rotate-180' : 'rotate-0'}" />
    </button>
    <proposal-answers class:mt-4={showMargin} class="flex flex-col gap-2">
        {#each answers as answer, answerIndex}
            <ProposalAnswer
                {answer}
                {answerIndex}
                {votedAnswerValue}
                {selectedAnswerValue}
                {disabled}
                {isLoading}
                hidden={!isOpened}
                percentage={percentages[answer.value]}
                isWinner={answerIndex === winnerAnswerIndex}
                proposalStatus={$selectedProposal?.status}
                truncate={!isOpened}
                onAnswerClick={() => onAnswerClick(answer.value, questionIndex)}
            />
        {/each}
    </proposal-answers>
</proposal-question>
