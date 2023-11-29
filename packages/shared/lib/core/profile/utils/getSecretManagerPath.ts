// TODO(2.0) Fix all usages
export function getSecretManagerPath(profileDirectory: string): string {
    return `${profileDirectory}/wallet.stronghold`
}
