interface IIpfsLink {
    Hash: string
    Name: string
    Size: number
    Target: string
    Type: number
    Mode?: string
    Mtime?: number
    MtimeNsecs?: number
}

interface IIPfsEntry {
    readonly type: 'dir' | 'file'
    readonly cid: string
    readonly name: string
    readonly path: string
    mode?: number
    mtime?: {
        secs: number
        nsecs?: number
    }
    size: number
}

interface IIpfsObject {
    Hash: string
    Links: IIpfsLink[]
}

enum typeOfLink {
    Dir = 'dir',
    File = 'file',
}

const IPFS_ENDPOINT = 'https://ipfs.io'
const IPFS_PATH = '/api/v0/ls'
const IPFS_PREFIX = '/ipfs/'

export async function getIpfsUri(link: { path?: string; hash: string }): Promise<string | undefined> {
    let ipfsLink = `${link.hash}${link.path ?? ''}`
    try {
        const ipfsEntry = await ls(ipfsLink)

        if (ipfsEntry) {
            if (ipfsEntry.type === 'dir') {
                const path = `${link.path ?? ''}/${ipfsEntry.name}`
                return await getIpfsUri({ hash: link.hash, path })
            }
            ipfsLink = `${ipfsLink}/${encodeURIComponent(ipfsEntry.name)}`
        }
    } catch (error) {
        console.error('error', error)
    }

    return `${IPFS_ENDPOINT}${ipfsLink}`
}

async function ls(path: string): Promise<IIPfsEntry | undefined> {
    let ipfsEntry: IIPfsEntry | undefined

    try {
        const baseUrl = IPFS_ENDPOINT
        const method = 'get'
        const payload = undefined
        let headers = {}
        const timeout = undefined

        headers ??= {}

        let controller: AbortController | undefined
        let timerId: NodeJS.Timeout | undefined

        if (timeout !== undefined) {
            controller = new AbortController()
            timerId = setTimeout(() => {
                if (controller) {
                    controller.abort()
                }
            }, timeout)
        }

        try {
            if (path.includes('ipfs')) {
                const response = await fetch(`${baseUrl}${IPFS_PATH}?arg=/${path}`, {
                    method,
                    headers,
                    body: payload ? JSON.stringify(payload) : undefined,
                    signal: controller ? controller.signal : undefined,
                })
                const lsResponse = (await response.json()) as { Objects: IIpfsObject[] }
                const result = lsResponse.Objects[0]
                if (result) {
                    const links = result.Links
                    if (links.length > 0) {
                        ipfsEntry = mapLinkToIpfsEntry(links[0], path)
                    }
                }
            }
        } catch (error) {
            console.error('error', error)
        } finally {
            if (timerId) {
                clearTimeout(timerId)
            }
        }
    } catch (error) {
        console.error('error', error)
    }

    return ipfsEntry
}

function mapLinkToIpfsEntry(link: IIpfsLink, path: string): IIPfsEntry {
    const hash = link.Hash.startsWith(IPFS_PREFIX) ? link.Hash.slice(IPFS_PREFIX.length) : link.Hash
    const entry: IIPfsEntry = {
        name: link.Name,
        path: path + (link.Name ? `/${link.Name}` : ''),
        size: link.Size,
        cid: hash,
        type: typeOf(link),
    }
    if (link.Mode) {
        entry.mode = Number.parseInt(link.Mode, 8)
    }

    if (link.Mtime !== undefined && link.Mtime !== null) {
        entry.mtime = {
            secs: link.Mtime,
        }

        if (link.MtimeNsecs !== undefined && link.MtimeNsecs !== null) {
            entry.mtime.nsecs = link.MtimeNsecs
        }
    }

    return entry
}

function typeOf(link: IIpfsLink): typeOfLink {
    switch (link.Type) {
        case 1:
        case 5: {
            return typeOfLink.Dir
        }
        case 2: {
            return typeOfLink.File
        }
        default: {
            return typeOfLink.File
        }
    }
}
