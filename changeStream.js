const server = require('http').createServer()
const io = require('socket.io')(server)
const Storage = require('node-storage')

const store = new Storage('/.resumeStore')

io.on('connection', client => {
  console.log(`Client connected: ${client}`)
  // client.on('event', data => { /* … */ })
  // client.on('disconnect', () => { /* … */ })
})
server.listen(3000)

const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const url = 'mongodb+srv://moscaThree:ZK6jyQ5RGqo1DQpZ@fridayone-1ptbu.mongodb.net/test?retryWrites=true&w=majority'

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
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

  const pipeline = [
    { $match: { operationType: 'insert' } }
  ]

  const changeStream = collection.watch(pipeline)
  changeStream.on('change', change => console.log(`Time: ${change.fullDocument.TimeStamp}, Data: ${change.fullDocument.Data}, Token: ${change.fullDocument._id}`))
  store.put('resumeToken', 'change.fullDocument._id')
})
