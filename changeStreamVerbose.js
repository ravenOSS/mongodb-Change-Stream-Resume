const resume = require('./resumeStoreVerb')
const dotenv = require('dotenv').config()
const server = require('http').createServer()
const io = require('socket.io')(server)
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const EJSON = require('mongodb-extjson')

io.on('connection', client => {
  console.log(`Client connected: ${client}`)
  // client.on('event', data => { /* … */ })
  // client.on('disconnect', () => { /* … */ })
})

server.listen(3000)

const url = process.env.atlasURL

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true,
  connectTimeoutMS: 60000,
  socketTimeoutMS: 60000
})

client.connect(err => {
  assert.strictEqual(null, err)
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

  let changeStream
  let streamWatch

  const sleep = (delay) => { // for testing
    console.log(`Sleeping`)
    var start = new Date().getTime()
    while (new Date().getTime() < start + delay);
    console.log(`csSleep ended`)
  }

  const startStream = () => {
    console.log(`startStream`)
    changeStream = collection.watch([pipeline], {
      fullDocument: 'updateLookup' })
    changeStream.on('change', document => {
      console.log(`csStartToken:  ${EJSON.stringify(document._id)}`)
      resume.storeToken(EJSON.stringify(document._id))
      console.log(`${document.fullDocument.TimeStamp} : ${document.fullDocument.Data}`)
      changeStream.close()
      // sleep(6000) // testing
      resumeStream()
    })
  }

  const resumeStream = () => {
    console.log(`resumeStream`)
    // sleep(12000)
    streamWatch = collection.watch([pipeline], {
      resumeAfter: resume.getToken()
    })
    streamWatch.on('change', document => {
      console.log(`csChangeId: ${JSON.stringify(document._id)}`)
      console.log(`${document.fullDocument.TimeStamp} :: ${document.fullDocument.Data}`)
      resume.storeToken(EJSON.stringify(document._id))
    })
  }

  resume.readfile(readable => {
    if (!readable) {
      console.log(`Readable: NO - ${readable} `)
      startStream()
    } else {
      console.log(`Readable: YES - ${readable} `)
      resumeStream()
    }
  })
})
