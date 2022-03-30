<script lang="typescript">
    import { BundleMiningLayout, Button, Icon, ProgressBar, Text } from 'shared/components'
    import { Platform } from 'shared/lib/platform'
    import {
        createMigrationBundle,
        getInputIndexesForBundle,
        mineLedgerBundle,
        MINING_TIMEOUT_SECONDS,
        selectedBundlesToMine,
    } from 'shared/lib/migration'
    import { walletSetupType } from 'shared/lib/wallet'
    import { SetupType } from 'shared/lib/typings/setup'
    import { createEventDispatcher, onDestroy, onMount } from 'svelte'
    import { Locale } from '@core/i18n'

    export let locale: Locale

    const dispatch = createEventDispatcher()

    let progressBarPercent = 0
    let progressBarMessage = `${progressBarPercent} % completed`
    let timeElapsed = 0

    const legacyLedger = $walletSetupType === SetupType.TrinityLedger

    let timeout
    let interval

    $: progressBarMessage = `${progressBarPercent}% completed`

    onMount(() => {
        $selectedBundlesToMine.reduce(
            (promise, bundle, idx) =>
                promise.then((acc) => {
                    const _updateOnSuccess = () => {
                        timeElapsed = (idx + 1) * MINING_TIMEOUT_SECONDS
                        updateProgress()

                        if (idx === $selectedBundlesToMine.length - 1) {
                            clearInterval(interval)

                            redirectWithTimeout()
                        }
                    }

                    const _updateOnError = () => {
                        timeElapsed = (idx + 1) * MINING_TIMEOUT_SECONDS
                        updateProgress()

                        if (idx === $selectedBundlesToMine.length - 1) {
                            clearInterval(interval)

                            redirectWithTimeout()
                        }
                    }

                    if (legacyLedger) {
                        return mineLedgerBundle(bundle.index, bundle.miningRuns * 10 ** 8)
                            .then(() => {
                                _updateOnSuccess()
                            })
                            .catch((error) => {
                                console.error('E', error)
                                _updateOnError()
                            })
                    }
                    return createMigrationBundle(getInputIndexesForBundle(bundle), bundle.miningRuns * 10 ** 8, true)
                        .then((data) => {
                            _updateOnSuccess()
                        })
                        .catch((error) => {
                            console.error(error)

                            _updateOnError()
                        })
                }),
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

    onDestroy(() => {
        clearTimeout(timeout)
        clearInterval(interval)
    })
</script>

<!-- TODO: missing mobile -->
<BundleMiningLayout allowBack={false} {locale} showLedgerProgress={legacyLedger} showLedgerVideoButton={legacyLedger}>
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
            <Button
                secondary
                classes="w-56"
                onClick={() => Platform.openUrl('https://firefly.iota.org/faq#spent-addresses')}
            >
                {locale('views.bundleMiningWarning.learn')}
            </Button>
        </div>
    </div>
    <div slot="actions" class="w-2/5 mt-8">
        <ProgressBar narrow percent={progressBarPercent} message={progressBarMessage} />
    </div>
</BundleMiningLayout>
