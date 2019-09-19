const dotenv = require('dotenv').config()
const server = require('http').createServer()
const io = require('socket.io')(server)

io.on('connection', client => {
  console.log(`Client connected: ${client}`)
  // client.on('event', data => { /* … */ })
  // client.on('disconnect', () => { /* … */ })
})
server.listen(3000)

const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const url = process.env.atlasURL

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true,
  connectTimeoutMS: 60000,
  socketTimeoutMS: 60000
})

client.connect(err => {
  assert.strict.equal(null, err)
  if (err) {
    console.log(`We've got a problem`)
  } else {
    console.log('Connected successfully to MongoDB')
  }
  const db = client.db('plottingData')
  const collection = db.collection('streamTest')
  const pipeline = {
    $match: {
      operationType: {
        $in: ['insert']
      }
    }
  }
  // let resumeToken
  // let token
  let changeStream

  const storeInit = async () => {
    await storage.init({
      dir: 'testStore'
    })
  }
  storeInit()

  getToken()
    .then(token => {
      if (typeof token !== 'undefined') {
        console.log(`Token`)
        console.log(token)
        changeStream = collection.watch([pipeline], {
          fullDocument: 'updateLookup'
        }, {
          resumeAfter: token
        })
      } else {
        changeStream = collection.watch([pipeline])
        changeStream.on('change', document => {
          console.log(document)
          const token = document._id
          saveToken(token)
        })
      }
    })
})

const saveToken = async (token) => {
  try {
    const resumeToken = EJSON.stringify(token)
    await storage.setItem('resumetoken', resumeToken)
  } catch (err) {
    console.log(`Error writing token to file`)
  }
}

const getToken = async () => {
  try {
    const resumeToken = await storage.getItem('resumetoken')
      .then
    if (typeof resumeToken !== `undefined`) {
      return EJSON.parse(resumeToken)
    } else {
      return 'undefined'
    }
  } catch (err) {
    console.log(`Error reading token file`)
  }
}

const newStream = (cs, storage) => {
  console.log(`New stream started`)
  cs.on('change', document => {
    console.log(document)
    const token = document._id
    saveToken(token)
    console.log(`++++++++++++++++++++`)
    // newStream(cs, storage)
  })
}
