// TODO(2.0) Fix all usages and rename
export function getSecretManagerPath(profileDirectory: string): string {
    return `${profileDirectory}/wallet.stronghold`
}
