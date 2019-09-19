const fs = require('fs')
const path = require('path')
const file = path.join(process.cwd(), '/store')

// Check if the file exists in the current directory.
fs.access(file, fs.constants.F_OK, (err) => {
  console.log(`${file} ${err ? 'does not exist' : 'exists'}`)
})

// // Check if the file is readable.
// fs.access(file, fs.constants.R_OK, (err) => {
//   console.log(`${file} ${err ? notReadable() : isReadable()}`)
// })
let readable

// Check if the file is readable.
fs.access(file, fs.constants.R_OK, (err) => {
  // console.log(`${file} ${err ? readable = false : readable = true}`)
  console.log(`${file} ${err ? readable = false : readable = true}`)
  if (readable) {
    isReadable()
  } else if (!readable) {
    notReadable()
  }
})

// set as bool variables

const notReadable = () => {
  console.log(`Resume file is NOT readable`)
}

const isReadable = () => {
  console.log(`Resume file is readable`)
}

const storeToken = (resumeToken) => {
  fs.writeFile(file, JSON.stringify(resumeToken), 'utf8', (err) => {
    if (err) throw err
    console.log(`Token stored`)
  })
}
let resumeToken

const getToken = (callback) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) throw err
    resumeToken = JSON.parse(data)
    console.log(`Token: ${resumeToken}`)
    callback(resumeToken)
  })
}

storeToken('ABC')

getToken((resumeToken) => {
  console.log(`Returned: ${resumeToken}`)
})
