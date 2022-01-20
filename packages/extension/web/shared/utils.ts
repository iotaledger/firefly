import type {Msg} from './types'
export {currentTab} from './platform'

export function displayOrigin(origin:string) {
  if(!origin) return ''
  if(origin.includes('//')) {
    const a = origin.split('//')
    return a[1]
  }
  return origin
}

export function checkUrlOK(url: string): boolean {
  if (url.startsWith('http://localhost')) return true
  if (!url.startsWith('https://')) return false
  return true
}

export function getParams() {
  const ps = new URLSearchParams(window.location.search)
  const r:{[k:string]:any} = {}
  for(const [k,v] of ps) {
    r[k] = v
  }
  return r
}

export function makeParams(msg: Msg){
  return new URLSearchParams(flatten(msg)).toString();
}

function flatten(input) {
  return Object.assign({}, 
    ...function _flatten(o) { 
      return [].concat(...Object.keys(o)
        .map(k => (o[k] && typeof o[k] === 'object') ? _flatten(o[k]) : ({[k]: o[k]}))
      );
    }(input)
  )
}