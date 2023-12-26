<script lang="ts">
    import { Button, FontWeight, Text, TextType } from 'shared/components'
    import Multistep from '../multistep.svelte'

    let startProccess = false

    const steps = [
        {
            title: 'Step 1',
            description: 'One-time deposit',
            image: 'assets/illustrations/implicit-account/show-one-time-address.svg',
        },
        {
            title: 'Step 2',
            description: 'Fund confirmation',
            image: 'assets/illustrations/implicit-account/generate-mana.svg',
        },
        {
            title: 'Step 3',
            description: 'Account creation',
            image: 'assets/illustrations/implicit-account/sign-transaction.svg',
        },
    ]

    function startMultiStepProccess(): void {
        startProccess = true
    }
</script>

<div class="flex flex-col w-full h-full pt-16 px-28 pb-24 items-center justify-between">
    <Text type={TextType.h2}>Activate Account</Text>
    {#if !startProccess}
        <steps-wrapper class="flex space-x-4">
            {#each steps as step}
                <step-content class="flex flex-col items-center space-y-8">
                    <img src={step.image} alt={step.title} />
                    <div class="flex flex-col text-center px-4">
                        <Text
                            type={TextType.p}
                            fontSize="15"
                            color="blue-700"
                            darkColor="blue-700"
                            fontWeight={FontWeight.semibold}>{step.title}</Text
                        >
                        <Text type={TextType.p} fontSize="18" fontWeight={FontWeight.semibold}>{step.description}</Text>
                    </div>
                </step-content>
            {/each}
        </steps-wrapper>
        <Button onClick={startMultiStepProccess}>Start</Button>
    {:else}
        <Multistep />
    {/if}
</div>
