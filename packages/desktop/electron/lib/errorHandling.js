const IGNORED_ERROR_REGEXES = [
    // Chromium network errors https://chromium.googlesource.com/chromium/src/+/refs/heads/main/net/base/net_error_list.h
    /^net::[A-Z0-9_]*/g,
    /.*neon::event::Channel::send*/,
]

/**
 *
 * @param {string} error Error message
 * @returns {bool}
 */
export const shouldReportError = (error) => {
    for (const regex of IGNORED_ERROR_REGEXES) {
        if (regex.test(error)) {
            return false
        }
    }
    return true
}
