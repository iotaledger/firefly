import { WalletColors } from "../enums"

export function getRandomWalletColor(): string {
    const colors = Object.values(WalletColors).filter((_, i) => !(i % 2))
    return colors[Math.floor(Math.random() * colors.length)].toString()
}
