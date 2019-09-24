const fs = require('fs')
const path = require('path')
const BSON = require('bson')
let EJSON = require('mongodb-extjson')
// sets root as current working directory and creates token store
const file = path.join(process.cwd(), '/store')

// Check if the file exists in the current directory.
fs.access(file, fs.constants.F_OK, (err) => {
  console.log(`${file} ${err ? 'does not exist' : 'exists'}`)
})

// Check if the file is readable.
// We'll use this for testing the presence of a token
// nievely accept the file has token
const readfile = (callback) => {
  fs.access(file, fs.constants.R_OK, (err) => {
    // const readable = err ? false : true
    const readable = err ? 0 : 1
    console.log(`rsStatus: ${readable}`)
    console.log(`rsErrStatus: ${err}`)
    callback(readable)
  })
}
// Using writeFile is unreliable - see docs
const storeToken = (resumeToken) => {
  fs.writeFileSync(file, resumeToken)
  console.log(`rsToken stored`)
  // fs.writeFile(file, JSON.stringify(resumeToken), 'utf8', (err) => {
  // fs.writeFile(file, BSON.serialize(resumeToken), (err) => {
  // fs.writeFileSync(file, EJSON.stringify(resumeToken), (err) => {
}
// const storeToken = (resumeToken) => {
//   fs.writeFileSync(file, resumeToken, 'utf8', (err) => {
//     if (err) throw err
//     console.log(`rsToken stored`)
//   // fs.writeFile(file, JSON.stringify(resumeToken), 'utf8', (err) => {
//   // fs.writeFile(file, BSON.serialize(resumeToken), (err) => {
//   // fs.writeFileSync(file, EJSON.stringify(resumeToken), (err) => {
//   })
// }
let resumeToken
let bsonToken
let token

const getToken = () => {
  token = fs.readFileSync(file)
  resumeToken = EJSON.parse(token)
  console.log(`rsToken: ${JSON.stringify(resumeToken)}`)
  return resumeToken

  // console.log(`rsToken: ${EJSON.parse(token)}`)
  // resumeToken = JSON.parse(token)
  // bsonToken = BSON.deserialize(token)
  // resumeToken = token
}
// const getToken = (callback) => {
//   // fs.readFile(file, 'utf8', (err, token) => {
//     if (err) throw err
//     resumeToken = EJSON.parse(token)
//     console.log(`rsToken: ${JSON.stringify(resumeToken)}`)
//     callback(resumeToken)

//     // console.log(`rsToken: ${EJSON.parse(token)}`)
//     // resumeToken = JSON.parse(token)
//     // bsonToken = BSON.deserialize(token)
//     // resumeToken = token

//     // callback(bsonToken)
//   })
// }

module.exports = { getToken, storeToken, readfile }
