const dotenv = require('dotenv').config()
// const sock = require('./socketConn')
const MongoClient = require('mongodb').MongoClient
const io = require('socket.io')
const assert = require('assert')
const EJSON = require('mongodb-extjson')

const atlasURL = process.env.atlasURL

const client = new MongoClient(atlasURL, {
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

  const startStream = () => {
    console.log(`startStream`)
    changeStream = collection.watch([pipeline], {
      fullDocument: 'updateLookup' })
    changeStream.on('change', document => {
      console.log(`JSON.stringify(document.fullDocument.TimeStamp): JSON.stringify(document.fullDocument.Data)`)
      const packet = []
      packet[0] = document.fullDocument.TimeStamp
      packet[1] = document.fullDocument.Data
      console.log(packet)
    })
  }
  startStream()

  // const transmit = (data) => {
  //   console.log(`packet: ${data}`)
  // }
})

// const transmit = data => {
//   io.emit('serverMsg', data)
// }
// module.exports = { transmit }
