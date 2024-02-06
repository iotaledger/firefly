module.exports = () => {
    if (process.platform !== 'darwin' || process.env.MACOS_SKIP_NOTARIZATION) {
        return undefined
    }

    return {
        teamId: 'UG77RJKZHH',
    }
}
