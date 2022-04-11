const fs = require('fs')

const __SOURCE_DIRECTORY__ = 'public/build'
const __DESTINATION_DIRECTORY__ = `${__SOURCE_DIRECTORY__}/build`

if (!fs.existsSync(__DESTINATION_DIRECTORY__)) {
    fs.mkdirSync(__DESTINATION_DIRECTORY__)
}

fs.readdirSync(__SOURCE_DIRECTORY__).forEach((file) => {
    if (file.includes('.node')) {
        fs.copyFileSync(`${__SOURCE_DIRECTORY__}/${file}`, `${__DESTINATION_DIRECTORY__}/${file}`)
    }
})
