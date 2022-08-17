import { FUNDS_SPREADER_SLEEP_INTERVAL, SHIMMER_CLAIMING_FUNDS_SPREADERS_PARAMETERS } from './constants'
import { cleanupOldAccountManagerData, spreadFunds } from './helpers'
import { sleep } from './utils'

/**
 * NOTE: Choose the particular parameters to run the funds spreader tool
 * with here!
 */
const FUNDS_SPREADERS_PARAMETERS = SHIMMER_CLAIMING_FUNDS_SPREADERS_PARAMETERS

async function runFundsSpreader(): Promise<void> {
    try {
        cleanupOldAccountManagerData()

        let round = 1
        for (const fundsSpreaderParameters of FUNDS_SPREADERS_PARAMETERS) {
            await spreadFunds(fundsSpreaderParameters, round)
            await sleep(FUNDS_SPREADER_SLEEP_INTERVAL)
            round++
        }

        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

void runFundsSpreader()
