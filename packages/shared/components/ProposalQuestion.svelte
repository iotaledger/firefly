<script lang="typescript">
    import type { Question } from '@iota/wallet'
    import { Text, FontWeight, Icon, ProposalAnswer } from 'shared/components'
    import { ProposalStatus, selectedProposal } from '@contexts/governance'
    import { Icon as IconEnum } from '@auxiliary/icon'

    // TODO: replace with new wallet.rs type
    export let currentVote: { value: number; current: number; accumulated: number }[] = undefined
    export let questionIndex: number = undefined
    export let isOpened = false
    export let question: Question
    export let selectedAnswerValues: number[] // TODO, maybe should be a svelte store
    export let onClick: () => unknown = () => {}

    let percentages: string[]
    let voteValue: number // TODO: get the current answer being voted by the account

    $: answers = [...question?.answers, { value: 0, text: 'Abstain', additionalInfo: '' }]
    $: showMargin = isOpened || ((voteValue || voteValue === 0) && !isOpened) // voteValue 0 corresponds to abstained vote
    $: currentVote, setPercentagesFromAccumulated()
    $: disabled =
        $selectedProposal.status === ProposalStatus.Upcoming || $selectedProposal.status === ProposalStatus.Ended

    function setPercentagesFromAccumulated(): void {
        const totalAccumulated = currentVote?.reduce((acc, answer) => acc + answer.accumulated, 0)
        percentages = answers?.map((currentAnswer) => {
            const answerAccumulated = currentVote?.find((answer) => answer.value === currentAnswer.value)?.accumulated
            const divisionResult = answerAccumulated / totalAccumulated
            return Number.isNaN(divisionResult) ? '0%' : `${Math.round(divisionResult * 100)}%`
        })
    }

    function handleAnswerClick(answerValue: number): void {
        if (selectedAnswerValues[questionIndex] === answerValue) {
            selectedAnswerValues[questionIndex] = undefined
        } else {
            selectedAnswerValues[questionIndex] = answerValue
        }
    }
</script>

<proposal-question
    class="flex flex-col px-5 py-4 rounded-xl border border-solid border-gray-200 dark:border-transparent dark:bg-gray-850 cursor-pointer"
>
    <div on:click={onClick} class="flex justify-between items-center">
        <div class="flex flex-col">
            {#if questionIndex !== undefined}
                <Text smaller fontWeight={FontWeight.bold} overrideColor classes="mb-1 text-blue-500"
                    >Question {questionIndex + 1}</Text
                >
            {/if}
            <Text fontWeight={FontWeight.bold} overrideColor classes="text-gray-900 dark:text-white"
                >{question.text}</Text
            >
        </div>
        <div class="transform {isOpened ? 'rotate-180' : 'rotate-0'}">
            <Icon icon={IconEnum.ChevronDown} classes="text-gray-500" />
        </div>
    </div>
    <proposal-answers class:mt-4={showMargin} class={isOpened ? 'space-y-2' : ''}>
        {#each answers as answer, answerIndex}
            <ProposalAnswer
                {answer}
                {answerIndex}
                {disabled}
                on:answerClicked={(event) => handleAnswerClick(event.detail)}
                hidden={!isOpened}
                isSelected={selectedAnswerValues[questionIndex] === answer?.value}
                isVotedFor={voteValue === answer?.value}
                percentage={percentages[answerIndex]}
            />
        {/each}
    </proposal-answers>
</proposal-question>
