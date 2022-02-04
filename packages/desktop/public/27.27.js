;(self.webpackChunkdesktop = self.webpackChunkdesktop || []).push([
    [27],
    {
        59027: (e, r, t) => {
            'use strict'
            t.r(r), t.d(r, { SecureStoragePluginWeb: () => s, SecureStoragePlugin: () => a })
            var o = t(94932)
            class s extends o.Uw {
                constructor() {
                    super({ name: 'SecureStoragePlugin', platforms: ['web'] }),
                        (this.PREFIX = 'cap_sec_'),
                        (this.addPrefix = (e) => this.PREFIX + e)
                }
                get(e) {
                    return null !== localStorage.getItem(this.addPrefix(e.key))
                        ? Promise.resolve({ value: atob(localStorage.getItem(this.addPrefix(e.key))) })
                        : Promise.reject('Item with given key does not exist')
                }
                set(e) {
                    return localStorage.setItem(this.addPrefix(e.key), btoa(e.value)), Promise.resolve({ value: !0 })
                }
                remove(e) {
                    return localStorage.removeItem(this.addPrefix(e.key)), Promise.resolve({ value: !0 })
                }
                clear() {
                    for (const e in localStorage) 0 === e.indexOf(this.PREFIX) && localStorage.removeItem(e)
                    return Promise.resolve({ value: !0 })
                }
                keys() {
                    const e = Object.keys(localStorage).filter((e) => 0 === e.indexOf(this.PREFIX))
                    return Promise.resolve({ value: e })
                }
                getPlatform() {
                    return Promise.resolve({ value: 'web' })
                }
            }
            const a = new s()
        },
    },
])
//# sourceMappingURL=27.27.js.map
