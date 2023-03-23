require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// route that generates short url
const urls = [];

app.post("/api/shorturl", function (req, res) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$", // fragment locator
    "i"
  );

  if (!pattern.test(req.body.url)) res.json({ error: "invalid url" });

  urls.push({ original: req.body.url, id: urls.length + 1 });
  res.json({ original_url: req.body.url, short_url: urls.length });
});

// route that redirects to original url
app.get("/api/shorturl/:shortPath", function (req, res) {
  const originalPath = urls.find(
    (item) => item.id === Number(req.params.shortPath)
  );
  res.redirect(originalPath.original);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
