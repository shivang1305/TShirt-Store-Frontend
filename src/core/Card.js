import React, { useState } from "react";
import ImageHelper from "./helper/ImageHelper";
import { Redirect } from "react-router-dom";
import { addItemToCart, removeItemFromCart } from "./helper/CartHelper";

export default function Card({
  product,
  addToCart = true,
  removeFromCart = false,
  reload = undefined,
  setReload = (f) => f, //anonymous function returning the value passed into it
}) {
  const cardTitle = product ? product.name : "Default Title";
  const cardDescription = product ? product.description : "Default Description";
  const cardPrice = product ? product.price : "Default Price";

  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  //function to add a product to cart
  const addIntoCart = () => {
    addItemToCart(product, () => {
      setRedirect(true);
    });
  };

  //function to redirect user to cart page once user add a product to cart
  const redirectToCart = () => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  //conditional rendering of addtocart & removefromcart buttons
  const showAddToCart = (addToCart) => {
    return (
      addToCart && (
        <button
          onClick={addIntoCart}
          className="btn btn-block btn-outline-success mt-2 mb-2"
        >
          Add to Cart
        </button>
      )
    );
  };
  const showRemoveFromCart = (removeFromCart) => {
    return (
      removeFromCart && (
        <button
          onClick={() => {
            removeItemFromCart(product._id);
            setReload(true);
          }}
          className="btn btn-block btn-outline-danger mt-2 mb-2"
        >
          Remove from cart
        </button>
      )
    );
  };

  return (
    <div className="card text-white bg-dark border border-info ">
      <div className="card-header lead">{cardTitle}</div>
      <div className="card-body">
        {redirectToCart(redirect)}
        <ImageHelper product={product} />
        <p className="lead bg-success font-weight-normal text-wrap">
          {cardDescription}
        </p>
        <p className="btn btn-success rounded  btn-sm px-4">$ {cardPrice}</p>
        <div className="row">
          <div className="col-12">{showAddToCart(addToCart)}</div>
          <div className="col-12">{showRemoveFromCart(removeFromCart)}</div>
        </div>
      </div>
    </div>
  );
}
