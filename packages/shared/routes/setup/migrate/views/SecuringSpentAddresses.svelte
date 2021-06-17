<script lang="typescript">
    import { BundleMiningLayout, Button, Icon, ProgressBar, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import {
        createMigrationBundle,
        getInputIndexesForBundle,
        ledgerMigrationProgresses,
        MINING_TIMEOUT_SECONDS,
        selectedBundlesToMine,
    } from 'shared/lib/migration'
    import { walletSetupType } from 'shared/lib/router'
    import { SetupType } from 'shared/lib/typings/routes'
    import { createEventDispatcher, onDestroy, onMount } from 'svelte'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    let progressBarPercent = 0
    let progressBarMessage = `${progressBarPercent} % completed`
    let timeElapsed = 0

    let timeout
    let interval

    $: progressBarMessage = `${progressBarPercent}% completed`

    onMount(() => {
        $selectedBundlesToMine.reduce(
            (promise, bundle, idx) =>
                promise.then((acc) =>
                    createMigrationBundle(getInputIndexesForBundle(bundle), bundle.miningRuns * 10 ** 8, true)
                        .then((result) => {
                            timeElapsed = (idx + 1) * MINING_TIMEOUT_SECONDS
                            updateProgress()

                            if (idx === $selectedBundlesToMine.length - 1) {
                                clearInterval(interval)

                                redirectWithTimeout()
                            }
                        })
                        .catch((error) => {
                            console.error(error)

                            timeElapsed = (idx + 1) * MINING_TIMEOUT_SECONDS
                            updateProgress()

                            if (idx === $selectedBundlesToMine.length - 1) {
                                clearInterval(interval)

                                redirectWithTimeout()
                            }
                        })
                ),
            Promise.resolve([])
        )

        initiateProgressBar()
    })

    function redirectWithTimeout(_timeout = 1500) {
        timeout = setTimeout(() => {
            dispatch('next')
        }, _timeout)
    }

    function updateProgress() {
        progressBarPercent = Math.floor((timeElapsed / (MINING_TIMEOUT_SECONDS * $selectedBundlesToMine.length)) * 100)
        progressBarMessage = progressBarPercent.toString() + '% completed'
    }

    function initiateProgressBar() {
        interval = setInterval(() => {
            timeElapsed += 2

            updateProgress()
        }, 2000)
    }

    function handleBackClick() {
        dispatch('previous')
    }

    //TODO:
    const handleCancelClick = () => {
        console.log('Cancel clicked')
        // dispatch('previous')
    }

    onDestroy(() => {
        clearTimeout(timeout)
        clearInterval(interval)
    })
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <BundleMiningLayout
        allowBack={false}
        progress={$walletSetupType === SetupType.TrinityLedger ? $ledgerMigrationProgresses : undefined}>
        <div slot="icon_boxed">
            <div class="flex justify-center items-center rounded-2xl w-12 h-12 bg-blue-500 shadow-lg">
                <Icon boxed="true" icon="history" classes="text-white" />
            </div>
        </div>
        <div slot="box_content">
            <Text type="h2" classes="mb-5 text-center">{locale('views.securingSpentAddresses.title')}</Text>
            <Text type="p" secondary classes="mb-4 text-center">
                {locale('views.securingSpentAddresses.body1', { values: { minutes: $selectedBundlesToMine.length * 10 } })}
            </Text>
            <Text type="p" secondary classes="mb-8 text-center">{locale('views.securingSpentAddresses.body2')}</Text>
            <div class="flex flex-col flex-grow items-center">
                <Button secondary classes="w-56" onClick={() => Electron.openUrl('https://firefly.iota.org/faq#spent-addresses')}>
                    {locale('views.bundleMiningWarning.learn')}
                </Button>
            </div>
        </div>
        <div slot="actions" class="w-2/5 mt-8">
            <ProgressBar narrow percent={progressBarPercent} message={progressBarMessage} />
        </div>
    </BundleMiningLayout>
{/if}
