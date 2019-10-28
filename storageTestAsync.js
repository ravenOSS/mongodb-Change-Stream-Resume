const storage = require('node-persist')

// Test whether reinitializing storage removes data
// Test shows that data is retained

const test = async () => {
  await storage.init({
    dir: 'testStore'
  }).then(console.log(`StoreInit1`))

  try {
    console.log(`Try this first ${await storage.getItem('data')}`)
    console.log(`Going to SET data`)
    await storage.setItem('data', 'undefined')
    
    await storage.getItem('data')
    if ('data' === 'undefined') {
      console.log(`Data is undefined`)
    } else {
      console.log(`Check failed`)
    }

    console.log(`Going to GET data`)
    console.log(`Try this ${await storage.getItem('data')}`)

  } catch (err) {
    console.log(`Error`)
  }

  await storage.init({
    dir: 'testStore'
  }).then(console.log(`StoreInit2`))

  await storage.setItem('data', '_id.123')
  try {
    console.log(`Try this again ${await storage.getItem('data')}`)
  } catch (err) {
    return `Error`
  }
}

test()
