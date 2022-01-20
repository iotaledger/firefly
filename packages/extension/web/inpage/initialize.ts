import * as iotalib from './iota';

declare global {
  interface Window { 
    iota: any; 
    __iota_injected__: boolean;
  }
}

export function initialize(){
  console.log("__INITIALIZE__IOTA__")
  window.iota = iotalib
  window.__iota_injected__ = true  
}

if(!window.__iota_injected__) {
  initialize()
}