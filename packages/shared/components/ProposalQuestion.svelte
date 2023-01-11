<script lang="typescript">
    import { Text, FontWeight, Icon, ProposalAnswer } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import type { Answer, AnswerStatus, Question } from '@iota/wallet'

    export let allVotes: AnswerStatus[] = undefined
    export let questionIndex: number = undefined
    export let isOpened = false
    export let question: Question
    export let selectedAnswerValues: number[] // TODO, maybe should be a svelte store
    export let votedAnswerValue: number = undefined
    export let onClick: () => unknown = () => {}

    let percentages: string[]

    $: answers = [...question?.answers, { value: 0, text: 'Abstain', additionalInfo: '' }]
    $: showMargin = isOpened || ((votedAnswerValue || votedAnswerValue === 0) && !isOpened) // votedAnswerValue 0 corresponds to abstained vote
    $: allVotes, setPercentagesFromAccumulated()

    function setPercentagesFromAccumulated(): void {
        const totalAccumulated = allVotes?.reduce((acc, answer) => acc + answer.accumulated, 0)
        percentages = answers?.map((currentAnswer) => {
            const answerAccumulated = allVotes?.find((answer) => answer.value === currentAnswer.value)?.accumulated
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

    function isAnswerSelected(answer: Answer): boolean {
        if (selectedAnswerValues[questionIndex] === answer?.value) {
            return true
        } else if (selectedAnswerValues[questionIndex] === undefined && votedAnswerValue === answer?.value) {
            return true
        } else {
            return false
        }
    }
</script>

<proposal-question class="flex flex-col px-5 py-4 rounded-xl border border-solid border-gray-200 cursor-pointer">
    <div on:click={onClick} class="flex justify-between items-center">
        <div class="flex flex-col">
            {#if questionIndex !== undefined}
                <Text smaller fontWeight={FontWeight.bold} overrideColor classes="mb-1 text-blue-500"
                    >Question {questionIndex + 1}</Text
                >
            {/if}
            <Text fontWeight={FontWeight.bold} overrideColor classes="text-gray-900">{question.text}</Text>
        </div>
        <div class="transform {isOpened ? 'rotate-180' : 'rotate-0'}">
            <Icon icon={IconEnum.ChevronDown} classes="text-gray-500" />
        </div>
    </div>
    <proposal-answers class:mt-4={showMargin} class={isOpened ? 'space-y-2' : ''}>
        {#key selectedAnswerValues[questionIndex]}
            {#each answers as answer, answerIndex}
                <ProposalAnswer
                    {answer}
                    {answerIndex}
                    on:answerClicked={(event) => handleAnswerClick(event.detail)}
                    hidden={!isOpened}
                    isSelected={isAnswerSelected(answer)}
                    isVotedFor={votedAnswerValue === answer?.value}
                    percentage={percentages[answerIndex]}
                />
            {/each}
        {/key}
    </proposal-answers>
</proposal-question>
