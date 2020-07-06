import React,{useState} from 'react'
import Base from "../core/Base";

import {Link,Redirect} from "react-router-dom";
import {signin,authenticate,isAutheticated} from "../auth/helper";


 const Signin=()=> {
      
    const [values,setValues] =useState({
        email:'aa@dipesh.com',
        password:"12345",
        error:"",
        loading:false,
        didRedirect:false
    })
    
    const {email,password,error,loading,didRedirect} = values
    const { user } = isAutheticated()

    const handleChange = name => event=>{
        setValues({...values,error:false,[name]:event.target.value})
     } 

     const performRedirect = ()=>{
         //TODO : do a redirect here
         if(didRedirect){
             if(user && user.role === 1){
                 return <Redirect to="/admin/dashboard" />
             }else{
                return <Redirect to="/user/dashboard" />
             }
         }
         if(isAutheticated()){
            return <Redirect to="/" />
         }
     }

     const onSubmit =event=>{
         event.preventDefault()
         setValues({...values,error:false,loading:true})
         signin({email,password})
         .then(data =>{
             if(data.error){
                 setValues({...values,error:data.error,loading:false})
             }else{
                 authenticate(data,()=>{
                     setValues({
                         ...values,
                         didRedirect:true
                     })
                 })
             }
         })
         .catch(console.log("Sign In Request Failed."))
     }

     const loadingMessage=()=>{
        return(
           loading && (
               <div className="alert alert-info">
                   <h4>Loading ...</h4>

               </div>
           )
        )
    }

    const errorMessage=()=>{
        return(
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
        <div className="alert alert-danger"
        style={{display: error ? "":"none"}}
        >
            {error}
        </div>
        </div>
        </div>
        )
    }

    const signInForm = () =>{
        return(
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form>
                        <div className="form-group">
                           <label className="text-light">Email</label>
                           <input onChange={handleChange("email")} className="form-control" value={email} type="email"/>
                        </div>
                        <div className="form-group">
                           <label className="text-light">Password</label>
                           <input onChange={handleChange("password")} className="form-control" value={password} type="password"/>
                        </div>
                        <button onClick={onSubmit} className="btn btn-success btn-block">Submit</button>
                    </form>
                </div>
            </div>
        )
    }
    return (
        <Base title="Sign in Page" description="A Page for user to Sign in!">
            {loadingMessage()}
            {errorMessage()}
            {signInForm()}
            {performRedirect()}
            <p className="text-white text-center">{JSON.stringify(values)}</p>
        </Base>
    )
}

export default Signin