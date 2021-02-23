const rendererWindow = window

rendererWindow.ipcRenderer.receive("about-content", (_, options) => {
    const {appName, version, iconPath} = options
    document.querySelector(".title").textContent = appName
    document.getElementById("app-icon").src = iconPath
    document.getElementById("app-version").textContent = `Version ${version}`
    document.getElementById("footer").textContent = `IOTA Foundation ${new Date().getFullYear()}.`
})
