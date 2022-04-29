const cors = require('cors');
const express = require('express');
const fs = require('fs');

/**
 * This makes use of the Express web framework for Node.js
 * see https://expressjs.com/ for documentation
 */

const app = express();
app.use(cors());  // enable cross-origin requests
const port = process.env.PORT || 8080;

let stats = {};


/**
 * Deliver all the stats to the client
 * 
 * Available under: /
 */
app.get('/', async function(req, res) {
	res.json(stats);
});

/**
 * Add a new vote for an image
 * 
 * Available under: /vote?image=image1.jpg&result=machine
 */
app.get('/vote', async function(req, res) {
	console.log(req);
	let image = req.query.image;
	let result = req.query.result;

	/**
	 * 	{
			'file1.jpg': {
				'human': 1,
				'machine': 5
			},
			'file2.jpg': {
				'human': 1,
				'machine': 5
			}
		}
	 */

	if (!stats[image]) {
		stats[image] = {};
	}

	if (stats[image][result]) {
		stats[image][result]++;
	} else {
		stats[image][result] = 1;
	}

	saveStats();

	res.json(stats);
});


app.listen(port, async function() {
	console.log('Web server listening at http://localhost:' + port);
});

loadStats();


/**
 * Helper functions
 */

/**
 * Load stats.json and update the global stats object with its data
 */
async function loadStats() {
	try {
		const data = fs.readFileSync('stats.json', 'utf8');
		let json = JSON.parse(data);
		stats = json;
	} catch (e) {
		console.error('loadStats', e);
	}
}

/**
 * Save the global stats object to stats.json
 */
async function saveStats() {
	try {
		const data = JSON.stringify(stats, null, '\t');
		fs.writeFileSync('stats.json', data);
	} catch (e) {
		console.error('saveStats', e);
	}
}
