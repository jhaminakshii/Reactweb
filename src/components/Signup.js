import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const navigate = useNavigate();
  const[credentials,setCredentials] = useState({name:"",email:"",password:"",cPassword:""});
    const onChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
  const handleSignup= async (e)=>{
    const {name,email,password} = credentials;
    e.preventDefault();
    const response = await fetch("http://localhost:5000/auth/creatuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }), // body data type must match "Content-Type" header
    });
    const json = await response.json();
    console.log(json);
    if(json.success){
        //save the auth token & redirect
        localStorage.setItem('token',json.authToken);
        navigate("/");  
        props.showAlert("Account Created Successfully", "success");
    }else{
         props.showAlert("Invalid Details", "danger");
    }
    //setNotes(json);
        console.log(json);
    console.log("logout")
  }
  return (
    <>
     <div className = "container my-4">
     <h2 className ="my-2">Create an Account to use iNotebook</h2>
      <form onSubmit={handleSignup} >
      <div className="mb-3">
    <label htmlFor="name" className="form-label">Name</label>
    <input type="text" className="form-control" id="name" name="name"  onChange={onChange} aria-describedby="emailHelp"/>
  </div>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" name="email"  onChange={onChange} aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" id="password" name="password"  onChange={onChange} minlengt={5} required/>
  </div>
  <div className="mb-3">
    <label htmlFor="cPassword" className="form-label">Confirm Password</label>
    <input type="password" className="form-control" id="cPassword" name="cPassword"  onChange={onChange} minlengt={5} required/>
  </div>
  <button type="submit" className="btn btn-primary" >Submit</button>
</form>
    </div>  
    </>
  )
}

export default Signup
