const fs = require('fs')
const path = require('path')
const file = path.join(process.cwd(), '/store')

// Check if the file exists in the current directory.
fs.access(file, fs.constants.F_OK, (err) => {
  console.log(`${file} ${err ? 'does not exist' : 'exists'}`)
})

// Check if the file is readable.
const readfile = (callback) => {
  fs.access(file, fs.constants.R_OK, (err) => {
    const readable = err ? false : true
    console.log(`rsStatus: ${readable}`)
    console.log(`errStatus: ${err}`)
    callback(readable)
  })
}

const storeToken = (resumeToken) => {
  fs.writeFile(file, JSON.stringify(resumeToken), 'utf8', (err) => {
    if (err) throw err
    console.log(`rsToken stored`)
  })
}
let resumeToken

const getToken = (callback) => {
  fs.readFile(file, 'utf8', (err, token) => {
    if (err) throw err
    resumeToken = JSON.parse(token)
    // console.log(`rsToken: ${JSON.stringify(resumeToken)}`)
    callback(resumeToken)
  })
}

module.exports = { getToken, storeToken, readfile }
