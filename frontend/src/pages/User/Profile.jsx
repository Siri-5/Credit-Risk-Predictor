import React from 'react'
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from 'react-redux'
import {toast} from 'react-toastify'
import Loader from "../../component/Loader"
import {setCredentials} from "../../redux/features/auth/authSlice"

import {useProfileMutation} from "../../redux/api/users"
import './Profile.css'

const Profile = () => {
    const[username, setUsername]=useState('')
    const [email, setEmail]=useState("")
    const[password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const {userInfo}=useSelector((state)=>state.auth)

    const[updateProfile, {isLoading: loadingUpdateProfile}] = useProfileMutation()

    useEffect(()=>{
        setUsername(userInfo.username)
        setEmail(userInfo.email)
    }, [userInfo.email, userInfo.username])

    const dispatch=useDispatch();


    const submitHandler=async(e)=>{
        e.preventDefault()

        if (password !== confirmPassword)
        {
            toast.error("Passwords do not match")
        }
        else{
            try{
                
                const res = await updateProfile({
                    _id: userInfo._id,
                    username,
                    email,
                    password,
                }).unwrap()
                dispatch(setCredentials({...res}))
                toast.success("profile updated successfully")
            }
            catch(err){
                toast.error(err?.data?.message || err.error)
            }
        }
    }

  return (
    <div >
        <div className="profile-container">
            <div className="profile-form-container">
                <div className="profile-form-header">
                    <h3 className="update-profile"> Update Profile </h3>

            <form onSubmit={submitHandler}>

                <div className="">
                    <label className="block">Name</label>
                    <input type="text" placeholder="Enter name" className="form-input" value={username} onChange={(e) =>setUsername(e.target.value)} />
                </div>
                
                <div className="">
                    <label className="block">Email Address</label>
                    <input type="email" placeholder="Enter email" className="form-input" value={email} onChange={(e) =>setEmail(e.target.value)} />
                </div>

                <div className="">
                    <label className="block">Password</label>
                    <input type="password" placeholder="Enter password" className="form-input" value={password} onChange={(e) =>setPassword(e.target.value)} />
                </div>

                <div className="">
                    <label className="block">Confirm Password</label>
                    <input type="password" placeholder="Confirm Passowrd" className="form-input" value={confirmPassword} onChange={(e) =>setConfirmPassword(e.target.value)} />
                </div>

            <div className="button">
                <button type="submit">Update</button>

                {loadingUpdateProfile && <Loader />}
            </div>
            </form>
                </div>
            </div>
        </div>
    </div>
    
  )
}

export default Profile