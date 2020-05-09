import React, { useState } from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper";
import { Link } from "react-router-dom";
import { createCategory } from "./helper/adminapicall";

export default function AddCategory() {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, token } = isAuthenticated();

  //function to go back to the admin dashboard
  const goBack = () => {
    return (
      <div className="mt-5">
        <Link className="btn btn-sm btn-dark mb-3" to="/admin/dashboard">
          Admin Home
        </Link>
      </div>
    );
  };

  //function to get data from input field
  const handleChange = (event) => {
    setError("");
    setName(event.target.value);
  };

  //function to be call when you admin hit the create category button
  const onSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    //backend req fired
    createCategory(user._id, token, { name })
      .then((data) => {
        if (data.error) {
          setError(true);
        } else {
          setError("");
          setSuccess(true);
          setName("");
        }
      })
      .catch((err) => console.log(err));
  };

  //success message alert
  const successMessage = () => {
    if (success) {
      return (
        <alert className="alert-success">
          New category created successfully
        </alert>
      );
    }
  };

  //warning message alert
  const warningMessage = () => {
    if (error) {
      return (
        <alert className="alert-danger">Failed to create the category</alert>
      );
    }
  };

  //function for user to see category form and create a category
  const categoryForm = () => {
    return (
      <form>
        <div className="form-group">
          <p className="lead">Enter the category</p>
          <input
            type="text"
            className="form-control my-3"
            autofocus
            required
            value={name}
            onChange={handleChange}
            placeholder="For ex. Summer"
          />
          <button onClick={onSubmit} className="btn btn-outline-info">
            Create Category
          </button>
        </div>
      </form>
    );
  };

  return (
    <Base
      title="Create a category"
      description="Add a new category for T-Shirt"
      className="container bg-info p-4"
    >
      <div className="row bg-white rounded">
        <div className="col-md-8 offset md-2">
          {categoryForm()}
          {successMessage()}
          {warningMessage()}
          {goBack()}
        </div>
      </div>
    </Base>
  );
}
