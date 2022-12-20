<script lang="typescript">
    import { Text, FontWeight, Icon, ProposalAnswer } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import type { Answer, Question } from '@iota/wallet'

    export let question: Question
    export let index: number = undefined
    export let selectedAnswerValues: number[] // TODO, maybe should be a svelte store
    export let currentVote: Answer = null
    export let isOpened = false

    export let onClick: () => unknown = () => {}

    $: voteValue = currentVote?.answers?.find((answer) => answer?.current !== 0)?.value
    $: answers = [...question?.answers, { value: 0, text: 'Abstain', additionalInfo: '' }]

    // voteValue 0 corresponds to abstained vote
    $: showMargin = isOpened || ((voteValue || voteValue === 0) && !isOpened)

    function handleAnswerClick(answer: number): void {
        if (selectedAnswerValues[index] === answer) {
            selectedAnswerValues[index] = undefined
        } else {
            selectedAnswerValues[index] = answer
        }
    }
</script>

<proposal-question class="flex flex-col px-5 py-4 rounded-xl border border-solid border-gray-200 cursor-pointer">
    <div on:click={onClick} class="flex justify-between items-center">
        <div class="flex flex-col">
            {#if index !== undefined}
                <Text smaller fontWeight={FontWeight.bold} overrideColor classes="mb-1 text-blue-500"
                    >Question {index + 1}</Text
                >
            {/if}
            <Text fontWeight={FontWeight.bold} overrideColor classes="text-gray-900">{question.text}</Text>
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
                on:answerClicked={(event) => handleAnswerClick(event.detail)}
                hidden={!isOpened}
                isSelected={selectedAnswerValues[index] === answer?.value}
                isVotedFor={voteValue === answer?.value}
            />
        {/each}
    </proposal-answers>
</proposal-question>
