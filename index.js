require('dotenv').config();
const path = require('path');
const express = require('express');
const { Client, Config, CheckoutAPI } = require('@adyen/api-library');
const { PORT, API_KEY, MERCHANT_ACCOUNT, ENVIRONMENT } = require('./config');

// This is the server-side configuration.  It pulls the information supplied in the .env file to create an instance of the checkout API
const config = new Config();
// Set your X-API-KEY with the API key from the Customer Area.
config.apiKey = AQEyhmfxK4LIbhFLw0m/n3Q5qf3VaY9UCJ14XWZE03G/k2NFiiOG1UCCeQDpnmG/e5JhdNUQwV1bDb7kfNy1WIxIIkxgBw==-Ja7A/gSZVId4UT+i1h7YKftgp14KeoFgADrsaGZO3oA=-P)NMn(+r2<{df2v>;
config.merchantAccount = AdyenRecruitment_NY1;
const client = new Client({ config });
client.setEnvironment(ENVIRONMENT);
const checkout = new CheckoutAPI(client);

const app = express();
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

app.use(express.static(__dirname + '/public'));

// this endpoint is (almost!) working
app.post('/getPaymentMethods', (req, res) => {
  const { AdyenRecruitment_NY1, countryCode, shopperLocale, amount } = req.body;
  checkout.paymentMethods({
    merchantAccount,
    countryCode,
    shopperLocale,
    amount: {
      currency: amount.currency,
      value: amount.value
    },
    channel: "Web"
  })
    .then(paymentMethodsResponse => res.json(paymentMethodsResponse))
    .catch(err => res.json({ message: err.message }));
});

// build this endpoint using the example above, along with our dropin documentation -> https://docs.adyen.com/online-payments/web-drop-in/integrated-before-5-0-0?tab=codeBlockmethods_request_7#step-3-make-a-payment
app.post('/makePayment', (req, res) => {
    const { AdyenRecruitment_NY1, amount, reference,paymentmethod, returnurl } = req.body;
  checkout.paymentMethods({
    merchantAccount,
    amount: {
      currency: amount.curreny,
      value: amount.value
    },
    reference,
    paymentmethod: {
      state.data.paymentmethod = Onsubmit
    },
    returnurl = "https://www.adyen.com/"
  })
    .then(paymentMethodsResponse => res.json(paymentMethodsResponse))
    .catch(err => res.json({ message: err.message }));
});

// build this endpoint as well, using the documentation -> https://docs.adyen.com/online-payments/web-drop-in/integrated-before-5-0-0?tab=codeBlockmethods_request_7#step-5-additional-payment-details
app.post('/additionalDetails', async (req, res) => {
  const { amount, donationtoken, fraudresult, merchantreference, order, paymentmethod, pspreference, refusalreason, refusalreasoncode, resultcode, shopperlocale, threeDS2ResponseData, threeDS2result, threeDSpaymentdata  } = req.body;
  checkout.paymentMethods({
    amount: {
      currency: amount.currency,
      value: amount.value
    },
    donationtoken,
    fraudresult,
    merchantreference,
    order,
    paymentmethod,
    pspreference,
    refusalreason,
    refusalreasoncode,
    resultcode,
    shopperlocale,
    threeDS2responsedata,
    threeDS2result,
    threeDSpaymentdata
  })
    .then(paymentMethodsResponse => res.json(paymentMethodsResponse))
    .catch(err => res.json({ message: err.message }));
});
})

app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});
