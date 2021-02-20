const rendererWindow = window

rendererWindow.ipcRenderer.receive("about-content", (_, options) => {
    const {appName, version, iconPath} = options
    document.title = `About ${appName}`
  
    const $titleElement = document.querySelector(".title")
    $titleElement.textContent = appName
  
    const $iconElement = document.getElementById("app-icon")
    $iconElement.src = iconPath
  
    const $appVersionElement = document.getElementById(
        "app-version",
    )
  
    $appVersionElement.textContent = `Version ${version}`

    const $footerElement = document.getElementById(
        "footer",
    )
    
    $footerElement.textContent = `IOTA Foundation ${new Date().getFullYear()}.`
  })