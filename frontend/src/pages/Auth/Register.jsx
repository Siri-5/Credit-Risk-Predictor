import React from 'react'
import {useState, useEffect} from "react"
import {Link, useLocation, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import Loader from '../../component/Loader'
import { setCredentials } from '../../redux/features/auth/authSlice'

import { useRegisterMutation } from '../../redux/api/users'
import {toast} from 'react-toastify'
import "./Register.css"; 
import creditImage from '../../assets/credit-image.jpg';


const Register = () => {
    const[username, setUsername] = useState('')
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    
    
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const[register, {isLoading}]=useRegisterMutation();
    const{userInfo} = useSelector((state) => state.auth);

    const {search} = useLocation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

    useEffect(() => {

        if (userInfo){
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

  const submitHandler=async(e)=>{
    e.preventDefault()
    if (password !== confirmPassword)
    {
      toast.error("Password do not match")
    }
    else{
      try{

        const res=await register({username, email, password}).unwrap()
        dispatch(setCredentials({...res}))
        navigate(redirect)
        toast.success("User successfully registered")
      }
      catch(err)
      {
        toast.error(err.data.message)
      }
    }
  }
  return (
    <div className="register-container">
      <div className="register-header">
        <h3 className="register-title">Register</h3>
      <form onSubmit={submitHandler}className="register-form-container">
      <div className="form-group">
        <label htmlFor="name" className="form-label">Name</label>
        <input type="text" id="name" className="form-input" placeholder="Enter Name" value={username} 
        onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="email" className="form-label">Email Address</label>
        <input type="email" id="email" className="form-input" placeholder="Enter Email" value={email}
         onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="password" className="form-label">Password</label>
        <input type="password" id="password" className="form-input" placeholder="Enter Password" value={password}
          onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
        <input type="password" id="confirmPassword" className="form-input" placeholder="Confirm Password" value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}   />
      </div>
      <button disabled={isLoading} type="submit" className="submit-button" >
        {isLoading ? "Registering...": "Register"}
      </button>

      {isLoading && <Loader/>} 
    </form>

    <div className="cls1">
      <p className="text-after-form">
        Already have an account?{" "}
        <Link to={redirect ? `/login?redirect=${redirect}` :"/login"}>Login</Link>
      </p>
    </div>
    </div>
    {/* <div className="form-image-wrapper"> */}
    {/* <img 

    src={creditImage}
    className="form-image"
    /> */}
    {/* </div> */}
    </div>
  );
}

export default Register