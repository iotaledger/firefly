import { ipcRenderer } from 'electron'
import { MenuEvent } from '../menu'
import { version, productName } from '../../../package.json'

const AboutApi = {
    getData(): void {
        void ipcRenderer.invoke(MenuEvent.Data).then((data) => ({
            appName: productName,
            version: data.strings.version.replace('{version}', version),
            iconPath: `./assets/logos/darkmode/${process.env.STAGE}_firefly_logo.svg`,
        }))
    },
}

export default AboutApi
