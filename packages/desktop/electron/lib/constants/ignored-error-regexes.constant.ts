export const IGNORED_ERROR_REGEXES: Readonly<RegExp[]> = [
    // Chromium network errors https://chromium.googlesource.com/chromium/src/+/refs/heads/main/net/base/net_error_list.h
    /^net::[A-Z0-9_]*/g,
    // Neon bindings send errors
    /.*neon::event::Channel::send*/,
]
