
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const LogIn = (props) => {
    const navigate = useNavigate();
    const[credentials,setCredentials] = useState({email:"",password:""});
    const onChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handlesubmit = async (e)=>{
        e.preventDefault();
        const response = await fetch("http://localhost:5000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({email: credentials.email, password :credentials.password}), // body data type must match "Content-Type" header
        });
    const json = await response.json();
    if(json.success){
        //save the auth token & redirect
        localStorage.setItem('token',json.authToken);
        props.showAlert("Logged In Successfully", "success");
        navigate("/");
        
    }else{
      props.showAlert("Invalid Credentials", "danger");
    }
    //setNotes(json);
        console.log(json.authToken);
    }
  return (
    <div className="container my-4">
    <h2 className ="my-2">LogIn to continue to iNotebook</h2>
      <form onSubmit={handlesubmit} >
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" name="email" value={credentials.email} onChange={onChange} aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={onChange}/>
  </div>
  <button type="submit" className="btn btn-primary" >Submit</button>
</form>
    </div>
  )
}

export default LogIn
