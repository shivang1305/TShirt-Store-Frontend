import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { getAllProducts, deleteProduct } from "./helper/adminapicall";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);

  const { user, token } = isAuthenticated();

  //function to preload the products
  const preloadProducts = () => {
    getAllProducts().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setProducts(data);
      }
    });
  };

  useEffect(() => {
    preloadProducts();
  }, []);

  //function to go back to the admin dashboard
  const goBack = () => {
    return (
      <div className="mt-5">
        <Link className="btn btn-sm btn-info mb-3" to="/admin/dashboard">
          Admin Home
        </Link>
      </div>
    );
  };

  //function to delete the product
  const deleteThisProduct = (productId) => {
    deleteProduct(productId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        preloadProducts();
      }
    });
  };

  return (
    <Base title="Welcome admin" description="Manage products here">
      {goBack()}
      <h2 className="mb-4">All products:</h2>
      <div className="row">
        <div className="col-12">
          <h2 className="text-center text-white my-3">Products List</h2>
          {products.map((product, index) => {
            return (
              <div className="row text-center mb-2 " key={index}>
                <div className="col-4">
                  <h3 className="text-white text-left">{product.name}</h3>
                </div>
                <div className="col-4">
                  <Link
                    className="btn btn-success"
                    to={`/admin/product/update/${product._id}`}
                  >
                    <span className="">Update</span>
                  </Link>
                </div>
                <div className="col-4">
                  <button
                    onClick={() => {
                      deleteThisProduct(product._id);
                    }}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Base>
  );
}
