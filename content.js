console.log("Page has finished loading.")

var body = document.body.innerHTML

function sendData(data) {
			// Creating a new request to the server that contains the data
			var req = new XMLHttpRequest();

			// Opening up a connection with the server to 'POST' data
				req.open('POST', 'mongodb://joosting:pronetosheep@geekformers.com:27018/knowledge?authSource=admin', true);

			// Explain to the server that we are sending the data in json format
				req.setRequestHeader('content-type', 'application/json')
				// Alert the user to any errors from the server
				function readyStateChange() {
					if(req.readyState !== 4) return;
					if(req.status !== 200) return;
					data = JSON.parse(req.responseText);
					if(data.error) {
						alert(data.error);
					}
				}
req.onreadystatechange = readyStateChange;

			// Sending the data in JSON format
				req.send(JSON.stringify({data}));
			}

sendData(body)
