const express = require('express');
const bodyParser = require('body-parser');
const path = require('node:path');

const db = require('./utils/db');
const errorHandler = require('./middlewares/errorHandler');
const trails = require('./middlewares/trails');

const router = require('./routes');

const PORT = process.env.PORT ?? 8443;

db();

const app = express();

app.use(bodyParser.json());
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, '../mock/assets')));

app.use(trails);

app.use(router);

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Mock DSS Server running at port ${PORT}`);
});
