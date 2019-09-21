/* This program is for streaming data to MongoDB
to test charting code.
*/
// atlas djr@raveniot.com
const dotenv = require('dotenv').config()
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const moment = require('moment')

const url = process.env.atlasURL

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

  setInterval(() => {
    const now = moment().format('MMM Do, h:mm:ss')
    console.log(`Time: ${now}`)
    const data = Math.round(Math.random() * 100)
    console.log(`Data: ${data}`)
    insertData(now, data)
  }, 5000)

  const insertData = (time, data) => {
    // Set the collection
    const collection = db.collection('streamTest')
    // Insert data
    collection.insertOne({
      TimeStamp: time,
      Data: data
    }, function (err, result) {
      assert.strictEqual(err, null)
      assert.strictEqual(1, result.result.n)
      assert.strictEqual(1, result.ops.length)
    })
  }
})
