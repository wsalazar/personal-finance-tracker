const fs = require('fs');
const path = require('path');
const express = require('express');
const { createApp } = require('./dist/js/app.js');
const { renderToString } = require('@vue/server-renderer');

const app = express();

const template = fs.readFileSync(
  path.resolve(__dirname, './dist/index.html'),
  'utf-8',
);

app.use('/dist', express.static(path.resolve(__dirname, './dist')));

app.get('*', async (req, res) => {
  try {
    const { app: vueApp } = await createApp();
    const appHtml = await renderToString(vueApp);

    const html = template.replace('<!--vue-ssr-outlet-->', appHtml);
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
