import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send(`
  <!doctype html>
  <head>
  <title>Our Funky HTML Page</title>
  <meta name="description" content="Our first page">
  <meta name="keywords" content="html tutorial template">
  <script src="/index.bundle.js"></script>
  </head>
  <body>
  <main>
  </main>
  </body>
  </html>
`);
});

app.get("/app", (req, res) => {
    res.send(`
  <!doctype html>
  <head>
  <title>Vue ui</title>
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
