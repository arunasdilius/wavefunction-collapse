const express = require("express");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send(`
  <!doctype html>
  <head>
  <title>Wave function collapse</title>
  <meta name="description" content="Our first page">
  <meta name="keywords" content="html tutorial template">
  </head>
  <body>
  <div id="app">
  </div>
  </body>
  <script src="/WaveFunctionCollapseUI.bundle.js"></script>
  </html>
`);
});

app.use(express.static("dist"));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
