import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth/helper";
import { getPaymentToken, processPayment } from "./helper/PaymentHelper";
import DropIn from "braintree-web-drop-in-react";
import { cartEmpty } from "./helper/CartHelper";
import { createOrder } from "./helper/OrderHelper";

export default function Payment({
  products,
  setReload = (f) => f,
  reload = undefined,
}) {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null, //can't set it to undefined because a very big value will come from backend
    error: "",
    instance: {}, //automatically fills up with the request
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getMeToken = (userId, token) => {
    getPaymentToken(userId, token).then((info) => {
      console.log("INFORMATION", info);
      if (info.error) {
        setInfo({ ...info, error: info.error });
      } else {
        const clientToken = info.clientToken;
        setInfo({ clientToken });
      }
    });
  };

  useEffect(() => {
    getMeToken(userId, token); //can't directly call getToken here becoz it coming from some other file so it will keep on reloading again & again
  }, []);

  const showBraintreeDropIn = () => {
    return (
      <div>
        {info.clientToken !== null && products.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={(instance) => (info.instance = instance)}
            />
            <button className="btn btn-success" onClick={onPurchase}>
              Pay Now
            </button>
          </div>
        ) : (
          <h3>Please add something to cart or login</h3>
        )}
      </div>
    );
  };

  const getAmount = () => {
    let amount = 0;
    products.map((p) => {
      amount += p.price;
    });
    return amount;
  };

  const onPurchase = () => {
    setInfo({ loading: true });
    let nonce;
    let getNonce = info.instance.requestPaymentMethod().then((data) => {
      nonce = data.nonce;
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getAmount(),
      };
      processPayment(userId, token, paymentData)
        .then((response) => {
          setInfo({ ...info, success: response.success, loading: false });

          const orderData = {
            products,
            transaction_id: response.transaction.id,
            amount: response.transaction.amount,
          };

          createOrder(userId, token, orderData); //to create the order in backend

          cartEmpty(() => {
            console.log("WORKING");
          });
          setReload(!reload);
        })
        .catch((err) => {
          setInfo({ success: false, loading: false });
        });
    });
  };

  return <div>{showBraintreeDropIn()}</div>;
}
