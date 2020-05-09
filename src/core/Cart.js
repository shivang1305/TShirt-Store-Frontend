import React, { useState, useEffect } from "react";
import Base from "./Base";
import Card from "./Card";
import { loadCart } from "./helper/CartHelper";
import StripeCheckout from "./StripeCheckout";
import Payment from "./Payment";

export default function Cart() {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  //function to load product into cart
  const loadCartProducts = (products) => {
    return (
      <div>
        <h2>Wishlist of products</h2>
        {products.map((product, index) => {
          return (
            <Card
              key={index}
              product={product}
              removeFromCart={true}
              addToCart={false}
              reload={reload}
              setReload={setReload}
            />
          );
        })}
      </div>
    );
  };

  //function to load checkout
  const loadCheckout = () => {
    return (
      <div>
        <h2>Checkout Section</h2>
      </div>
    );
  };

  //function to calculate the final price and show it in checkout
  const getFinalPrice = () => {
    let amount = 0;
    products.map((p) => {
      amount = amount + p.price;
    });
    return amount;
  };

  return (
    <Base title="Your Cart" description="Ready to checkout">
      <div className="row text-center">
        <div className="col-6">
          {products.length > 0 ? (
            loadCartProducts(products)
          ) : (
            <h3>No products in the cart</h3>
          )}
        </div>
        <div className="col-6">
          <h3>Your bill is : ${getFinalPrice()}</h3>
          <Payment products={products} setReload={setReload} />
          <br />
          <br />
          <StripeCheckout products={products} setReload={setReload} />
        </div>
      </div>
    </Base>
  );
}
