export function getSecretManagerPath(profileDirectory: string): string {
    return `${profileDirectory}/wallet.stronghold`
}
