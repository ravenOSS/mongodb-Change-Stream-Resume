const fs = require('fs')
const path = require('path')
const EJSON = require('mongodb-extjson')
// sets root as current working directory to create token store
const file = path.join(process.cwd(), '/storeQ')

// Check if the file exists in the current directory.
fs.access(file, fs.constants.F_OK, (err) => {
  console.log(`${file} ${err ? 'does not exist' : 'exists'}`)
})

// Check if the file is readable.
// We'll use this for testing the presence of a token
// niavely accept the file has token
const readfile = (callback) => {
  fs.access(file, fs.constants.R_OK, (err) => {
    // const readable = err ? false : true
    const readable = err ? 0 : 1
    console.log(`rsFileStatus: ${readable}`)
    console.log(`rsFileErrStatus: ${err}`)
    callback(readable)
  })
}
// Using writeFile is unreliable - see docs
const storeToken = (resumeToken) => {
  fs.writeFileSync(file, resumeToken)
  console.log(`rsToken stored`)
}

let resumeToken
let token

const getToken = () => {
  token = fs.readFileSync(file)
  resumeToken = EJSON.parse(token)
  console.log(`rsToken: ${JSON.stringify(resumeToken)}`)
  return resumeToken
}

module.exports = { getToken, storeToken, readfile }
