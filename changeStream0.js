const resume = require('./resumeStore')
const dotenv = require('dotenv').config()
const server = require('http').createServer()
const io = require('socket.io')(server)
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const BSON = require('bson')
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

  let changeStream
  let streamWatch
  // const resumeToken
  // let token = ''

  const gotIt = (data) => {
    // const token = JSON.stringify(data)
    // const token = data
    // const token = EJSON.parse(data)
    // console.log(`gotIt0: ${(data)}`)
    console.log(`gotIt1: ${JSON.stringify(data)}`)
    return data
  }

  const sleep = (delay) => {
    var start = new Date().getTime()
    while (new Date().getTime() < start + delay);
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
      sleep(10000)
      console.log(`Sleep ended`)
      resumeStream()
    })
  }

  const resumeStream = () => {
    console.log(`resumeStream`)
    streamWatch = collection.watch([pipeline], {
      fullDocument: 'updateLookup'
    }, {
      // resumeAfter: resume.getToken(gotIt)
      resumeAfter: resume.getToken()
    })
    streamWatch.on('change', document => {
      console.log(`csChange: ${`${EJSON.stringify(document._id)}`}`)
      console.log(`${document.fullDocument.TimeStamp} : ${document.fullDocument.Data}`)
      resume.storeToken(EJSON.stringify(document._id))
    })
    resumeStream()
  }

  // startStream()
  // resumeStream()

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
