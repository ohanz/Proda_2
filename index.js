const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Parse JSON requests
app.use(bodyParser.json());

// const filePath = __dirname + '/quotes.json';
const filePath = __dirname + '/public/quotes.json';
