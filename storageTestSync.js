const storage = require('node-persist')

// Test whether reinitializing storage removes data
// Test shows that data is retained
let token
let data

// const setToken = async (key, value) => {
//   await storage.setItem(key, value)
// }

const setToken = async (key, value) => {
  await storage.setItem(key, value)
}

// const getToken = new Promise((resolve, reject) => {
//   resolve(storage.getItem('data'))
// })

const getToken = async () => {
  storage.getItem('data').then(data => { console.log(data) })
  // return 'value'
}

storage.init({ dir: 'testStore' }).then(console.log(`StoreInit1`))

setToken('data', 2345).then(console.log(`Data SET`))

console.log(`Going to GET token`)
console.log(`Token1 ${getToken().then(data => { console.log(data) })}`)

getToken().then(data => {
  console.log(`Data2 ${data}`)
})

storage.init({
  dir: 'testStore'
}).then(console.log(`StoreInit2`))

// setToken('data', '_id.123')

// console.log(`Try this again ${getToken('data')}`)

// storage.getItem('data').then((response) => {
//   console.log(response)
//   // console.log(`Again ${response}`)
// })

