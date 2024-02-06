import { DecayedMana } from '@iota/sdk'

export function getManaBalance(mana: DecayedMana): number {
    return Number(mana.potential) + Number(mana.stored)
}
