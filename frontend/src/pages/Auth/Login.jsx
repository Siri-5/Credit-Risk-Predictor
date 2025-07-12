import React from 'react'
import {useState, useEffect} from "react"
import {Link, useLocation, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import Loader from '../../component/Loader'
import { setCredentials } from '../../redux/features/auth/authSlice'

import { useLoginMutation } from '../../redux/api/users'
import {toast} from 'react-toastify'
import './Login.css'

const Login = () => {
  const [email, setEmail]=useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate=useNavigate()
  const[login, {isLoading}]= useLoginMutation()

  const {userInfo} = useSelector((state)=>state.auth)
  const {search} = useLocation()
  const sp= new URLSearchParams(search)
  const redirect = sp.get('redirect') || '/'

  useEffect(()=>{
    if (userInfo){
      navigate(redirect);
    }

  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e)=>{
    e.preventDefault()
    try{
      const res = await login({email, password}).unwrap()
      dispatch(setCredentials({...res}))
      navigate(redirect);
    } catch(err){
      toast.error(err?.data?.message || err.error)
    } }
  return (
    <div className="register-container">
    <div className="reg-con">
      <section >
        <div className="login-form-container">
          <h3 className="login-header" style={{ color: "black" }}>Sign in</h3>
          <form  onSubmit={submitHandler} className= "login-form">

          <div className="login-form-group">
            <label htmlFor="email" className="login-form-email">Email Address</label>
            <input type="email" id="email" className="login-form-input" placeholder="Enter your email"
            value={email} onChange={(e)=>setEmail(e.target.value)} required/>
          </div>
          <div className="login-form-group">
            <label htmlFor="password" className="login-form-password">Password</label>
            <input type="password" id="password" className="login-form-input" placeholder="Enter your password"
            value={password} onChange={(e)=>setPassword(e.target.value)} required/>
          </div>
          <button disabled={isLoading} type="submit" className="login-form-button" >
            {isLoading ? "Signing In...": "Sign In"}
          </button>
          {isLoading && <Loader />}
          </form>

            <div>
              <p className="Login-form-text">
                New User? {" "}
                <Link to={redirect ? `/register?redirect=${redirect}` :"/register"}>
                 Register
                </Link> 
                </p>
            </div>

        </div>
      </section>
    </div>
    </div>
  )
}

export default Login