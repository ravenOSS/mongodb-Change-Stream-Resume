const conn = new Mongo('mongodb://localhost:27017/demo?replicaSet=rs')
const db = conn.getDB('demo')
const collection = db.stock

const sleepFor = (delay) => {
  var start = new Date().getTime()
  while (new Date().getTime() < start + delay);
}

const changeStreamCursor = collection.watch()
resumeStream(changeStreamCursor, true)

function resumeStream (changeStreamCursor, forceResume = false) {
  let resumeToken
  while (!changeStreamCursor.isExhausted()) {
    if (changeStreamCursor.hasNext()) {
      const change = changeStreamCursor.next()
      console.log(JSON.stringify(change))
      resumeToken = change._id
      if (forceResume === true) {
        console.log('\r\nSimulating app failure for 10 seconds...')
        sleepFor(10000)
        changeStreamCursor.close()
        const newChangeStreamCursor = collection.watch([], {
          resumeAfter: resumeToken
        })
        console.log('\r\nResuming change stream with token ' + JSON.stringify(resumeToken) + '\r\n')
        resumeStream(newChangeStreamCursor)
      }
    }
  }
  resumeStream(changeStreamCursor, forceResume)
}
