import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Signup = (props) => {
  const [credentials, setCredentials] = useState({name:"",email: "", password: "",cpassword:"" });
  const navigate=useNavigate();
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value }); //use of spread operator
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name,email,password}=credentials;
    const response = await fetch(`http://localhost:5000/api/auth/createUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,email,password
      }),
    });
    const json = await response.json();
    if(json.success)
    {
        //save the auth-token and redirect;
        localStorage.setItem('token',json.authtoken);
        props.showAlert("signed in successfully","success")
        navigate('/');
        
    }
    else{
      props.showAlert("inavlid details","danger")
    }
    console.log(json);
  };
  return (
    <div className="container">
         <form onSubmit={handleSubmit}>
         <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            value={credentials.name}
            id="name"
            name="name"
            aria-describedby="emailHelp"
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            value={credentials.email}
            id="email"
            name="email"
            aria-describedby="emailHelp"
            onChange={onChange}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            value={credentials.password}
            id="password"
            name="password"
            onChange={onChange}
            minLength={8} required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            value={credentials.cpassword}
            id="cpassword"
            name="cpassword"
            onChange={onChange}
            minLength={8} required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
        </div>
  )
}

export default Signup