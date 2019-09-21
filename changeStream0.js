const resume = require('./resumeStore')
const dotenv = require('dotenv').config()
const server = require('http').createServer()
const io = require('socket.io')(server)
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

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
  // const resumeToken
  // const token

  const gotIt = (data) => {
    const token = JSON.stringify(data)
    console.log(`gotIt: ${token}`)
    return data
  }

  const startStream = () => {
    console.log(`startStream`)
    changeStream = collection.watch([pipeline], {
      fullDocument: 'updateLookup' })
    changeStream.on('change', document => {
      console.log(`${document.fullDocument.TimeStamp} : ${document.fullDocument.Data}`)
      const token = document._id
      resume.storeToken(token)
      changeStream.close()
      resumeStream()
    })
  }

  const resumeStream = () => {
    console.log(`resumeStream`)
    changeStream = collection.watch([pipeline], {
      fullDocument: 'updateLookup'
    }, {
      resumeAfter: resume.getToken(gotIt)
    })
    changeStream.on('change', document => {
      console.log(`${document.fullDocument.TimeStamp} : ${document.fullDocument.Data}`)
      const token = document._id
      resume.storeToken(token)
    })
  }

  const decide = resume.readfile(readable => {
    if (!readable) {
      console.log(`Readable: NO - ${readable} `)
      startStream()
    } else {
      console.log(`Readable: YES - ${readable} `)
      resumeStream()
    }
  })

  // const decide = resume.readfile(err => {
  //   if (err) {
  //     console.log(`Error: YES - ${err} `)
  //     startStream()
  //   } else {
  //     console.log(`Error: NO - ${err} `)
  //     resumeStream()
  //   }
  // })
  // decide()
})
