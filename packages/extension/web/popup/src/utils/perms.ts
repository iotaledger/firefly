import type { PermissionName, Permissions } from "../../../shared/types";

export interface Perm {
  text: string
  active: boolean
  name: PermissionName
}
export const initialPerms: Perm[] = [
  {text:'Read addresses',active:false,name:'readAddresses'},
  {text:'Read wallet balance',active:false,name:'readBalance'},
  {text:'Transact on this site',active:false,name:'transact'}
]
export function permsToACL(perms): Permissions {
  const acl: Permissions = {
    readAddresses: false,
    readBalance: false,
    transact: false
  }
  perms.forEach(p=> {
    if(p.active) acl[p.name] = true
  })
  return acl
}
export function aclToPerms(acl):Perm[] {
  return initialPerms.map(p=>{
    if(acl[p.name]) {
      return ({...p,active:true})
    }
    return p
  })
}