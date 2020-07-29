# multipass-js
a shopify multipass url generator

## installation

`yarn add multipass-js`


## usages
``` typescript
const multipass = new Multipass(SHOPIFY_STORE_MULTIPASS_SECRET);

// Create your customer data hash
const email = `woojoo@softmarshmallow.com`
const customerData = {
    email: email,
    user: "your database user id",
    customer: "any custom data you want"
    // ...
};


const url = multipass.withCustomerData(customerData).withdomain("mystore.shopify.com").withRedirect("products/primary").url();

// client may access shopify with `url`
```


## Shopify docs
https://shopify.dev/docs/admin-api/rest/reference/plus/multipass