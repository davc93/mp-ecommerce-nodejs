var express = require("express");
var exphbs = require("express-handlebars");

// ADDING DEPENDECIES
const mercadopago = require("mercadopago");
const cors = require("cors");
const { config } = require("./config");
const { sendEmail } = require("./mailer");
var port = process.env.PORT || 3000;

var app = express();

mercadopago.configurations.setAccessToken(config.ACCESS_TOKEN);

mercadopago.configure({
  access_token: config.ACCESS_TOKEN,
  integrator_id: "dev_24c65fb163bf11ea96500242ac130004",
});

app.set("trust proxy", true);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/detail", function (req, res) {
  res.render("detail", req.query);
});
// PAYMENTS URLS

app.get("/payments/success", function (req, res) {
  res.render("success", req.query);
});
app.get("/payments/pending", function (req, res) {
  res.render("pending", req.query);
});
app.get("/payments/failure", function (req, res) {
  res.render("failure", req.query);
});

// ADDING ROUTES

app.post("/create_preference", (req, res) => {

  const preference = {
    ...req.body,
    back_urls: {
      success: `${config.payserverDomain}/payments/success`,
      failure: `${config.payserverDomain}/payments/failure`,
      pending: `${config.payserverDomain}/payments/pending`,
    },
    auto_return: "approved",

    notification_url: `${config.payserverDomain}/notification_url`,
    payment_methods: {
      excluded_payment_methods: [
        {
          id: "visa",
        },
      ],
      installments: 6
    },
    external_reference: "davc93@gmail.com"

  };

  mercadopago.preferences
    .create(preference)
    .then((response) => {
      res.json({
        id: response.body.id,
      });
    })
    .catch((error) => {
      throw new Error(error);
    });


});

app.post("/notification_url", (req, res) => {
  const data = {
    body: req.body,
    query: req.query,
    headers: req.header,
  };
  if (data.body) {
    res.json({
      message: "its all done",
    });
    sendEmail(data);
  } else {
    res.json({
      message: "No vienen datos",
    });
  }
});

app.listen(port);
