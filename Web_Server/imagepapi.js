/* LOADING THE MODULES NEEDED TO RUN THE WEBSERVER */
const express = require('express')			// module used to create the web server
	, path = require('path')				// module used to get the absolute path of a file
	, bodyParser = require('body-parser')	// module used to parse what the cliend sent
	, http = require('http')				// module used to talk to a client
	, cors = require('cors')				// module used to allow cross origin requests
	, fs = require('fs')
	;


/* GLOBAL CONSTANTS */
const app = express()						// Creating a variable: app, to receive and respond to client's requests
	, port = 8081							// Defining what port to use to talk to the client
	, server = http.createServer(app)		// Creating the web server and storing it in a variable: app
	, corsOptions = {						// Setting up the server to accept requests from other domain names
		'origin': '*',
		'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
		'preflightContinue': false,
		'optionsSuccessStatus': 204
	}
	;

/* MIDDLEWARE TO LOOK AT THE REQUEST BEFORE HANDLING IT */
app.use(bodyParser.json({					// Limiting the amount of data the client can send to 50mb
	limit: '50mb'
}));

app.use(cors(corsOptions));					// Allowing any API route to accept requests from any domain

app.use(bodyParser.urlencoded({ 			// Allowing the body parser to parse many different types of requests
	extended: true
}));

/* ROUTES TO HANDLE THE REQUEST */

app.get('/', (req, res, next) => {
})

app.options('/saveimage/:name(orange|notorange)', cors(corsOptions))
app.post('/saveimage/:name(orange|notorange)', cors(corsOptions), (req, res, next) => {

	const image = req.body.image;
	if (!image) return res.send({ error: 'not good' });

	const match = image.match(/^data\:image\/([a-zA-Z0-9]*);base64,(.*)/);
	if (!match || match.length !== 3) return res.send({ error: 'not good' });

	const type = (match[1] + '').toLowerCase();
	const imageData = match[2];

	if (!type || !imageData || !['png', 'jpg', 'jpeg', 'tiff',
		'tif', 'gif', 'bmp'].includes(type)) {
		return res.send({ error: `invalid file type: ${type}` });
	}
	const img = Buffer.from(imageData, 'base64');
	const filepath = path.join(__dirname, `./${req.params.name}s/${new Date() * 1}.${type}`);

	fs.writeFileSync(filepath, img);
	res.send('OK');

});

server.on('listening', () => {				// Calling a function when the server starts listening for requests
	var addr = server.address()
		, bind = typeof addr === 'string'
			? 'pipe ' + addr
			: 'port ' + addr.port
		;
	console.log('Listening on ' + bind);	// Logging a message to terminal
});
server.listen(port);						// Telling the server to start listening
