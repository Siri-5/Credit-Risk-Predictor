import React from 'react'
import { useState } from 'react'
import {
    AiOutlineHome,
    AiOutlineLogin,
    AiOutlineUserAdd,

} from "react-icons/ai"
import { MdOutlineLocalMovies } from "react-icons/md";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/users";
import { logout } from "../../redux/features/auth/authSlice";
import './Navigation.css';


const Navigation = () => {
    const { userInfo } = useSelector((state) => state.auth)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen)
    }

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [logoutApiCall] = useLogoutMutation();
    const [showText, setShowText] = useState(true); // or false, based on need
    // const [dropdownOpen, setDropdownOpen] = useState(false);

    const logoutHandler = async () => {
        try{
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate("/login");
        } catch(error){
            console.error(error);
        }
    }

    return (
        <div className="navigation-container">
            <section className="section-wrapper">
                <div className="nav-section">
                    <Link to='/' className="nav-link">
                        <AiOutlineHome className="nav-icon" size={26} />
                        <span className="nav-text">Home</span>
                    </Link>
                    {/* <Link to='/page' className="nav-link">
                        <MdOutlineLocalMovies className="icon-style" />
                        <span className={`nav-item-name ${showText ? 'show' : ''}`}>SHOP</span>
                    </Link> */}
                </div>
                <div className="relative">
                    <button onClick={toggleDropdown} className="dropdown-btn">
                        {userInfo ? (
                            <span className="username-text">{userInfo.username}</span>
                        ) : null}

                        {userInfo && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`dropdown-arrow ${dropdownOpen ? 'rotated' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                                />
                            </svg>
                        )}
                    </button>

                    {dropdownOpen && userInfo && (
                        <ul
                            className={`dropdown-menu ${!userInfo.isAdmin ? 'top-user' : 'top-admin'}`}  >
                            {userInfo.isAdmin && (
                                <li>
                                    <Link to="/admin/movies/dashboard" className="dropdown-item">
                                        Dashboard  </Link>
                                </li>
                            )}
                            <li>
                                <Link to="/profile" className="dropdown-item">
                                    Profile </Link>
                            </li>
                            <li>
                                <button onClick={logoutHandler} className="dropdown-item logout-btn">
                                    Logout
  </button>
                            </li>
                        </ul>
                    )}
                    {!userInfo && (
                        <ul className="auth-links">
                            <li>
                                <Link to="/login" className="auth-link">
                                    <AiOutlineLogin className="auth-icon" size={26} />
                                    <span className="nav-item-name">LOGIN</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="auth-link ml-1rem">
                                    <AiOutlineUserAdd size={26} />
                                    <span className="nav-item-name">REGISTER</span>
                                </Link>
                            </li>
                        </ul>
                    )}

                </div>
            </section>
        </div>
    );

};


export default Navigation;