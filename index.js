// Express uit de nodemodules map
import { log } from "console";
import express from "express";
import { ppid } from "process";

const url = "https://api.vinimini.fdnd.nl/api/v1/producten"; // URL naar Json data
const url2 = "https://api.vinimini.fdnd.nl/api/v1";

// Maak een nieuwe express app aan
const app = express();

//  Stel in hoe we express gebruiken
app.set("view engine", "ejs");
app.set("views", "./views");

// Gebruik maken van de "public" map
app.use(express.static("public"));

// Maak een route voor de index

app.get("/", (request, response) => {
  response.render("index");
});

app.get("/alleproducten", (request, response) => {
  let productenUrl = url;
  fetchJson(productenUrl).then((data) => {
    response.render("alleproducten", data);
  });
});

app.get("/inloggen", (request, response) => {
  response.render("inloggen");
});

app.get("/ingelogd", (request, response) => {
  response.render("ingelogd");
});

app.get("/kalender", (request, response) => {
  response.render("kalender");
});

app.get("/speciaalvoormini", (request, response) => {
  response.render("speciaalvoormini");
});

app.get("/test", (request, response) => {
  response.render("test");
});

// Dit is de data uit de notitie api // Met dit stuk code willen we de data roepen uit de notitie api
app.post("/kalender", function (req, res, next) {
  const baseurl = "https://api.vinimini.fdnd.nl/api/v1/";
  const url = `${baseurl}`;
  req.body.afgerond = false;
  req.body.persoonId = "clemozv3c3eod0bunahh71sx7";
  req.body.datum = req.body.datum + ":00Z";
  req.body.herinnering = [req.body.herinnering + ":00Z"];
  console.log(req.body);

  //Nieuwe notite kunnen maken
  postJson(url + "/notities", req.body).then((data) => {
    console.log(JSON.stringify(data));
    let newNotitie = { ...req.body };

    if (data.success) {
      res.redirect("/kalender");
      // /(shlash) Verwijst naar de homepage
    } else {
      const errormessage = `${data.message}: Mogelijk komt dit door de slug die al bestaat.`;
      const newdata = { error: errormessage, values: newData };

      res.render("index", newdata);
    }
  });
});

// Stel het poortnummer in en start express
app.set("port", process.env.PORT || 8000);
app.listen(app.get("port"), function () {
  console.log(`Application started on http://localhost:${app.get("port")}`);
});

async function fetchJson(url, payload = {}) {
  return await fetch(url, payload)
    .then((response) => response.json())
    .catch((error) => error);
}
