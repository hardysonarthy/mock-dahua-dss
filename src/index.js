const express = require('express');
const bodyParser = require('body-parser');

const db = require('./utils/db');
const errorHandler = require('./middlewares/errorHandler');

const router = require('./routes');

const PORT = process.env.PORT ?? 8443;

db();

const app = express();

app.use(bodyParser.json());
app.use(express.json());

app.use(router);

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Mock DSS Server running at port ${PORT}`);
});
