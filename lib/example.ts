import { Multipass } from "./index"


const multipass = new Multipass("secret")
multipass.withRedirect("products/shoe");
multipass.withDomain("example.myshopify.com");
multipass.withCustomerData({
    email: "woojoo@softmarshmallow.com"
})

const url = multipass.url();

console.log(url)

console.log(multipass.token())
