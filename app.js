var express = require("express");
var exphbs = require("express-handlebars");

// ADDING DEPENDECIES
const mercadopago = require('mercadopago')
const cors = require('cors')
const { config } = require("./config");
const { sendEmail } = require("./mailer");
var port = process.env.PORT || 3000;

var app = express();

mercadopago.configure({
  access_token: config.ACCESS_TOKEN,
  integrator_id: "671571646",
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


// ADDING ROUTES



app.post("/create_preference", (req, res) => {
  const preference = {
    items: [...req.body.items],
    back_urls: {
      success: `${config.payserverDomain}/feedback`,
      failure: `${config.payserverDomain}/feedback`,
      pending: `${config.payserverDomain}/feedback`,
    },
    auto_return: "approved",
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
  if (data) {
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
app.get("/feedback", (req, res) => {
  const data = {
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id,
  };
  if (data.Payment) {
    sendEmail(data);
    res.json(data);
  }
});

app.listen(port);
