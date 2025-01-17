// This is the drop-in config object.  It is used when initializing an instance of drop-in
const config = {
  clientKey: 'test_CTOT7ZHBDVAHBHIABJ63CUQW7QMVDQFD',
  merchantAccount: 'MyTestAccount',
  countryCode: "NL",
  shopperLocale: "en_US",
  amount: { currency: "USD", value: 1000 }
};

const postRequest = async (url, payload) => {
  try {
    const response = await fetch(url, {
      url,
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(payload),
      json: true
    });

    return response.json();
  } catch (err) {
    console.error(err.message);
  };
};

const showFinalResult = (response) => {
  const container = document.getElementById("container");
  container.innerHTML = (`
    <div id="results">
      <h1 class="results-message">
        Result: ${response.resultCode}
      </h1>
      <h1 class="results-message"> pspReference: ${response.pspReference} </h1>
    </div>
  `);
};

const createDropinConfig = paymentMethodsResponse => {
  return {
    paymentMethodsResponse,
    clientKey: config.clientKey,
    merchantAccount: config.merchantAccount,
    locale: config.shopperLocale,
    removePaymentMethods: ["paypal", "ideal", "sepadirectdebit", "alipay", "unionpay"],
    environment: "test",
    onSubmit: async (state, dropin) => {
      const response = await postRequest('/makePayment', state.data);
      if (response.action) {
        dropin.handleAction(response.action);
      } else {
        showFinalResult(response);
      };
    },
    onAdditionalDetails: async (state, dropin) => {
      const response = await postRequest('/additionalDetails', state.data);
      if (response.action) {
        dropin.handleAction(response.action);
      } else {
        showFinalResult(response);
      };
    }
  };
};

window.addEventListener('load', async e => {
  const paymentMethodsResponse = await postRequest('/getPaymentMethods', {
    merchantAccount: config.merchantAccount,
    countryCode: config.countryCode,
    shopperLocale: config.shopperLocale,
    amount: config.amount
  });

  const checkout = new AdyenCheckout(createDropinConfig(paymentMethodsResponse));

  checkout.create('dropin').mount('#dropin-container')
});