<script lang="typescript">
    import { Text, Button } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { GovernanceRoutes } from 'shared/lib/typings/routes'
    import { governanceRoute } from 'shared/lib/router'

    enum EventStatus {
        Upcoming = 'upcoming',
        Commencing = 'commencing',
        HoldingPeriod = 'holdingPeriod',
        Ended = 'ended'
    }

    const event = {
        title: 'Participate in community Treasury proposal',
        description: 'The future of IOTA is in your hands – you can decide the future of 63Ti unclaimed tokens by participating in this community proposal.\nYou can vote for building the community treasury or burning the unclaimed tokens.',
        status: EventStatus.Upcoming,
    }

    const handleButtonClick = () => {
        governanceRoute.set(GovernanceRoutes.EventDetails)
    }
</script>

<div class="w-full h-full bg-lightblue-200 rounded-2xl"></div>
<Text type="p" classes="bg-white text-14 px-4 py-2 rounded-2xl text-blue-500 uppercase w-fit -mt-4 mb-6" overrideColor bold smaller>
    {localize(`views.governance.events.status.${event.status}`)}
</Text>
<Text type="h2" classes="text-gray-800 mb-4" overrideColor>{event.title}</Text>
<Text type="p" classes="text-gray-700 mb-6 mx-16 text-14 text-center" overrideColor>{event.description} </Text>
<Button classes="w-1/4" onClick={handleButtonClick}><Text type="h5" overrideColor classes="text-white">{localize('views.governance.events.button')}</Text></Button>
