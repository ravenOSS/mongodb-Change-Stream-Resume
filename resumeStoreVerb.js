const fs = require('fs')
const path = require('path')
const EJSON = require('mongodb-extjson')
// sets root as current working directory and creates token store
const file = path.join(process.cwd(), '/storeV') // just put token store in process root dir

// Check if the file exists in the current directory.
fs.access(file, fs.constants.F_OK, (err) => {
  console.log(`rsExistence check: ${file} ${err ? 'does not exist' : 'exists'}`)
})

// Check if the file is readable.
// We'll use this for testing the presence of a token
// naively accept the file has token if readable
// Use node.js fs module
const readfile = (callback) => {
  fs.access(file, fs.constants.F_OK || fs.constants.R_OK, (err) => {
    // const readable = err ? false : true
    const readable = err ? 0 : 1
    console.log(`rsFileStatus: ${readable}`)
    console.log(`rsFileErrStatus: ${err}`)
    callback(readable)
  })
}

const storeToken = (resumeToken) => {
  fs.writeFile(file, resumeToken, (error) => {
    if (error) {
      console.error('Error while writing token file')
    } else {
      console.error('rsResumeToken saved')
    }
  })
}

const getToken = () => {
  const token = fs.readFileSync(file)
  const resumeToken = EJSON.parse(token)
  console.log(`rsToken: ${JSON.stringify(resumeToken)}`)
  return resumeToken

  // console.log(`rsToken: ${EJSON.parse(token)}`)
  // resumeToken = JSON.parse(token)
  // bsonToken = BSON.deserialize(token)
  // resumeToken = token
}

// const getToken = (callback) => {
//   fs.readFile(file, 'utf8',
//     (error, resumeToken) => {
//       if (error) {
//         console.error('Error while reading token file')
//       } else {
//         console.log(`rsGetToken: ${resumeToken}`)

//         callback(EJSON.parse(resumeToken))
//         // callback(EJSON.parse(resumeToken))
//       }
//     })
// }

module.exports = { getToken, storeToken, readfile }
