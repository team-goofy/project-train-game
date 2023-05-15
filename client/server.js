const express = require('express');
const pjson = require('./package.json');
const app = express();

app.use(express.static(`./dist/${pjson.name}`));

app.get('/*', (req, res) =>
  res.sendFile('index.html', {root: `dist/${pjson.name}`}),
);

console.log(`${pjson.name} running`)

app.listen(process.env.PORT || 8080);
