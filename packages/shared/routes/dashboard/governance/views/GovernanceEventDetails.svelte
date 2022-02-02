<script lang="typescript">
    import { DashboardPane } from 'shared/components'
    import { Text, Icon, Link, Button } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { GovernanceRoutes } from 'shared/lib/typings/routes'
    import { governanceRoute } from 'shared/lib/router'
    import { ParticipationEventState } from 'shared/lib/participation/types'
    import type { ParticipationEvent } from 'shared/lib/participation/types'

    export let event: ParticipationEvent;

    const handleBackClick = () => governanceRoute.set(GovernanceRoutes.Init)
</script>

<div
    on:click={handleBackClick}
    class="inline-flex justify-between items-center w-20 p-2 pr-4 bg-white hover:bg-gray-100 border
    rounded-lg border-solid border-gray-300 cursor-pointer mb-5">
    <Icon icon="arrow-left" classes="w-4 h-4 text-gray-500" />
    <Text type="p" smaller overrideColor classes="text-gray-800">{localize('actions.back')}</Text>
</div>

<div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
    <DashboardPane classes="w-full h-full p-6 col-span-2 flex flex-col">
        <Text type="p" classes="mr-auto uppercase px-2 py-1 mb-2 text-blue-500 bg-blue-100 rounded-lg" smaller bold overrideColor>{event.status.status}</Text>
        <Text type="h2" classes="mb-4">{event.information.name}</Text>
        <Text type="p" classes="mb-2">{event.information.additionalInfo}</Text>
        <Text type="p" classes="mb-2">{event.information.payload.questions[0].text}</Text>
        <Text type="p" classes="mb-6">{event.information.payload.questions[0].additionalInfo}</Text>
        {#each event.information.payload.questions[0].answers as answer, i}
            <div class="py-4 px-6 bg-gray-50 border border-solid border-gray-100 rounded-lg flex mb-4">
                <div>
                    <Text type="p" classes="uppercase text-blue-500 mb-2" overrideColor smaller bold>{`Option ${i + 1}`}</Text>
                    <Text type="h3" classes="mb-2">{answer.text}</Text>
                    <Text type="p">{answer.additionalInfo}</Text>
                </div>
                <Button medium classes="my-auto ml-44" disabled={event.status.status === ParticipationEventState.Upcoming}>Cast votes</Button>
            </div>
        {/each}
    </DashboardPane>
    <DashboardPane classes="w-full h-1/3 flex flex-row flex-shrink-0 space-y-3 overflow-hidden p-6">
        <div class="space-y-3">
            <Text type="p" smaller>My voting power</Text>
            <Text type="h1" classes="inline-flex items-end">4528 <Text type="h4" classes="ml-1 mb-1">votes</Text></Text>
            <Text type="p" smaller>My max voting power</Text>
            <Text type="h1" classes="inline-flex items-end">195609600 <Text type="h4" classes="ml-1 mb-1">votes</Text></Text>
        </div>
        <Icon icon="info" classes="ml-auto mt-0" />
    </DashboardPane>
</div>
