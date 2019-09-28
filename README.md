Project to demonstrate live streaming of IoT sensor data from Mongodb and display with Plotly.js

Creating changeStreams from Mongodb is relatively simple. However, there are few examples of how to start a changeStream with a resume capability. When the program starts for the first time, there is no stored resumeToken. Therefore, the program has to start and capture a resume token. However, because the changeStream has been started without the "resumeAfter : resumeToken" option, it will not be resumable in the case of network failure or program crash.

Therefore, the program executes a two stage start-up. The first stage starts a changeStream, captures and stores a token and then closes. Immediately a new changeStream is opened with the "resumeAfter : resumeToken" option. Upon each change event the new resumeToken is stored. The resumeToken is the document _id.

Program logic tests whether a readable resumeToken store exists. If it does NOT, start the "startStream" process to capture and store a resumeToken in local file storage. Close the process and call the "resumeStream" process that will continuously process new events and store new resumeTokens. File testing naively accepts that if the file is readable, then the resumeToken is also readable.
// todo: change to test for read and write
// todo: move database handling to separate file

Node.js file system handling is used to check for a token store and to write/read the resumeToken.

The code is fairly verbose in outputs to aid in understanding what processes are being executed.

changeStreamBasic.js // changeStream without resume capability
changeStreamVerbose.js // lots of console.logs
changeStreamQuiet.js // remove most console.logs

These files use the corresponding resumeStream code.

Note that we are working with the document(data) returned from the changestream and not the stored mongo document that is BSON.

The resume token is the document id (_id: "data": "value") returned from the changestream and not the document stored in the database (the _oid).

Note the use of synchronous method to retrieve the resume token. Using async method resulted in too long a time for resuming the changestream.

However, writing the resumeToken to store is async since this is a continuous process that we do not want to block the nodejs program.

Q: Will this setup work at high data rates?
Since this is targeted at datavisualization for IoT applications, it may not matter. High data display rates are probably impossible to recognize with the human eye and therefore not particularly useful.

A strategy to get a better UX is to possibly aggregate data at the endpoint, take a mean, and transmit this value at a lower frequency thus saving on data transmission costs. Local processing could calculate mean and standard deviation and get rid of outliers for more filtered data.

The generator.js code is a very simple timestamp:randomNumber data source for testing. It just stuffs some streaming data into a database to create 'insert' events.

You will have to create a .env file with the Mongodb connection string. For simplicity, I would suggest using a free Mongodb Atlas account to get a three node replicaset for testing (or even production with a higher capability). You can obtain the application connection string from the Mongo cloud console.

Alternatively, you can set up a local three node replicaset or a single node configured as a replicaset. See the docs.