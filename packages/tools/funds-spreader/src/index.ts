import { SHIMMER_CLAIMING_FUNDS_SPREADERS_PARAMETERS } from './constants'
import { cleanupOldAccountManagerData, spreadFunds } from './helpers'

/**
 * NOTE: Choose the particular parameters to run the funds spreader tool
 * with here!
 */
const FUND_SPREADERS_PARAMETERS = SHIMMER_CLAIMING_FUNDS_SPREADERS_PARAMETERS

async function runFundsSpreader(): Promise<void> {
    try {
        cleanupOldAccountManagerData()
        await Promise.all(
            FUND_SPREADERS_PARAMETERS.map(async (fundsSpreaderParameters, idx) => {
                await spreadFunds(fundsSpreaderParameters, idx + 1)
            })
        )
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

void runFundsSpreader()
