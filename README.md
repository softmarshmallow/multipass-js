# multipass-js
a typesafe shopify multipass token generator, written in 100 pure typescript

> [Shopify](http://shopify.com) provides a mechanism for single sign-on known as Multipass.  Multipass uses an AES encrypted JSON hash and multipassify provides functions for generating tokens

> More details on Multipass with Shopify can be found [here](http://docs.shopify.com/api/tutorials/multipass-login).



## installation

```shell
# isntall with yarn
yarn add multipass-js

# install with npm
npm install multipass-js
```



## usages
``` typescript
import { Multipass } from "multipass-js"
const multipass = new Multipass(SHOPIFY_STORE_MULTIPASS_SECRET);

// Create your customer data hash
const email = `universe@grida.co`
const customerData = {
    email: email,
    user: "your database user id",
    customer: "any custom data you want"
    // ...
};


const url = multipass
    .withCustomerData(customerData)
    .withDomain("mystore.shopify.com")
    .withRedirect("products/primary").url();


// client may access shopify with `url`
// will give you URL like:  https://store.myshopify.com/account/login/multipass/<MULTIPASS-TOKEN>
// with optional redirection

// Generate token
const token = multipass.withCustomerData(customerData).token();
```


## Shopify docs
https://shopify.dev/docs/admin-api/rest/reference/plus/multipass


## Todo
- [support webpack5](https://github.com/softmarshmallow/multipass-js/issues/5)
