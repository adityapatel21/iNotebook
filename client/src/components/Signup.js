import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function Signup() {
  const [credentials, setCredentials] = useState({
    email: "",
    name: "",
    password: "",
    cpassword: "",
  });
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, name, password } = credentials;
    const response = await fetch(`http://localhost:5000/api/auth/createUser`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",

        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    const json = await response.json();

    console.log(json);
    localStorage.setItem("token", json.authtoken);
    navigate("/");
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };
  return (
    <div>
      <form style={{ margin: "auto", width: "50%" }} onSubmit={handleSubmit}>
        <h2 className="text-center">Sign Up</h2>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            onChange={onChange}
            name="email"
            className="form-control"
            id="email"
            aria-describedby="email"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            email="name"
            onChange={onChange}
            className="form-control"
            id="name"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            onChange={onChange}
            className="form-control"
            id="password"
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            name="cpassword"
            onChange={onChange}
            className="form-control"
            id="cpassword"
            minLength={5}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Signup;
