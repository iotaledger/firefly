import extension from '../shared/browser'

const sendMessage = extension.runtime.sendMessage

declare global {
  interface Window { __iota_content__: boolean; }
}

function inject() {
  startListeners()
  
  const injectionSite = document.head || document.documentElement
  const container = document.createElement('script')
  container.src = extension.runtime.getURL('build/inpage.js')
  container.onload = function (HtmlScriptElement) {
    // this.parentNode.removeChild(this)
  }
  injectionSite.insertBefore(container, injectionSite.children[0])
  window.__iota_content__ = true
}

function startListeners(){
  // injected -> background
  window.addEventListener("message", function(e) {
    if(typeof e.data!=='object') return
    if(e.data._content) return 
    sendMessage(e.data)
  });
  // background -> injected
  async function msgHandler(msg) {
    if(typeof msg!=='object') return
    window.postMessage(
      {...msg, _content:true}, 
      window.location.origin
    )
  }
  extension.runtime.onMessage.addListener(msgHandler)
}

if(!window.__iota_content__) {
  inject()
}
