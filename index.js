import express from "express";

// basis url voor de api
const url = "https://api.vinimini.fdnd.nl/api/v1";

// Maak een nieuwe express app
const app = express();

// Stel in hoe we express gebruiken
app.set("view engine", "ejs");
app.set("views", "./views");

// Stel de public map in
app.use(express.static("public"));

// Stel afhandeling van formulieren inzx
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Maak een route voor de index
app.get("/", (request, response) => {
  let categoriesUrl = url + "/categories";

  fetchJson(categoriesUrl).then((data) => {
    response.render("index", data);
  });
});

//stel de views in
app.set("view engine", "ejs");
app.set("views", "./views");

// Stel afhandeling van formulieren in
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//hier komen de routes (Hulp van krijn om zo beide endpoints te kunnen gebruiken)
app.get("/", (request, response) => {
  const baseUrl = "https://api.vinimini.fdnd.nl/api/v1";
  const samId = "/notities?id=clemozv3c3eod0bunahh71sx7";
  const notitiesUrl = `${baseUrl}${samId}`;
  fetchJson(notitiesUrl).then((notitiesData) => {
    let categoriesUrl = baseUrl + "/categories";
    fetchJson(categoriesUrl).then((categoriesData) => {
      response.render("index", {
        categories: categoriesData.categories,
        notities: notitiesData.notities,
      });
    });
  });
});

// Dit is de data uit de notitie api // Met dit stuk code willen we de data roepen uit de notitie api
app.post("/", function (req, res, next) {
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
      res.redirect("/");
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

/**
 * Wraps the fetch api and returns the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error);
}

app.get("/kalender", (request, response) => {
  response.render("kalender");
});

app.get("/test", (request, response) => {
  response.render("test");
});

export async function postJson(url, body) {
  return await fetch(url, {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .catch((error) => error);
}
