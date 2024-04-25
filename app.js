const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  let fileData = [];
  fs.readdir("./files", (err, files) => {
    files.forEach((file) => {
      const data = fs.readFileSync(`./files/${file}`, "utf-8");
      fileData.push({ title: file, description: data });
    });
    res.render("index", { files: fileData });
  });
});

app.get("/read/:filename", (req, res) => {
  const fileName = req.params.filename;
  const fileData = fs.readFileSync(`./files/${fileName}`, "utf-8");
  res.render("read", { fileData, fileName });
});

app.get("/delete/:filename", (req, res) => {
  const filename = req.params.filename;
  fs.unlink(`./files/${filename}`, (err) => {
    res.redirect("/");
  });
});

app.get("/edit/:filename", (req, res) => {
  const filename = req.params.filename;
  const fileData = fs.readFileSync(`./files/${filename}`, "utf-8");
  res.render("edit", { filename, fileData });
});

app.post("/update/:filename", (req, res) => {
  fs.writeFile(
    `./files/${req.params.filename}`,
    `${req.body.description}`,
    (err) => {
      if (err) {
        res.send(err);
      }
      res.redirect("/");
    }
  );
});

app.post("/create", (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const filePath = path.join(
    __dirname,
    `./files/${title.split(" ").join("")}.txt`
  );

  fs.writeFile(`${filePath}`, `${description}`, (err) => {
    if (err) {
      res.send(err);
    }
    res.redirect("/");
  });
});

app.listen(3000);
