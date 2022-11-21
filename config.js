
require('dotenv').config()
const config = {
  ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  GMAIL_APIKEY: process.env.GMAIL_APIKEY,
  payserverDomain:'https://davc93-mp-commerce-nodejs.herokuapp.com'
  
};

module.exports = {
    config
}
