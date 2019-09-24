Project to demonstrate live streaming of IoT sensor data from Mongodb and display with Plotly.js

Creating changeStreams from Mongodb is relatively simple. However, there are few examples of how to start a changeStream with a resume capability. When the program starts for the first time, there is no stored resumeToken. Therefore, the program has to start and capture a resume token. However, because the changeStream has been started without the "resumeAfter : resumeToken" option, it will not be resumable in the case of network failure or program crash.

Therefore, the program executes a two stage start-up. The first stage starts a changeStream, captures and stores a token and then closes. Immediately a new changeStream is opened with the "resumeAfter : resumeToken" option. Upon each change event the new resumeToken is stored. The resumeToken is the document _id

Program logic tests whether a readable resumeToken store exists. If it does NOT, start the "startStream" process to capture and store a resumeToken in local file storage. Close the process and call the "resumeStream" process that will continuously process new events and store new resumeTokens.

Node.js file system handling is used to check for a token store and to write/read the resumeToken.

The code is fairly verbose in outputs to aid in understanding what processes are being executed.

