import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import store from './redux/store.js'

import { Provider } from 'react-redux';
import {Route, RouterProvider, createRoutesFromElements} from 'react-router'
import {createBrowserRouter} from 'react-router-dom'
import Login from "./pages/Auth/Login.jsx"
import Register from "./pages/Auth/Register.jsx"
import PrivateRoute from './pages/Auth/PrivateRoute.jsx'
//Auth

import Home from './pages/Home.jsx'
import Profile from './pages/User/Profile.jsx'
import CreditStatusForm from './pages/Form.jsx';
import Records from './pages/Records.jsx';




const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element = {<App />}>
            <Route index={true} path='/' element={<Home />} />
            <Route path='/login' element={<Login />}/>
            <Route path='/register' element={<Register />}/>
            <Route path='' element={<PrivateRoute />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/form" element={<CreditStatusForm />}></Route>
            <Route path='/records' element={<Records />}></Route>
        </Route>
    )
)

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <RouterProvider router={router}/>
    </Provider>
)
// createRoot(document.getElementById('root')).render(
//   // <StrictMode>
//     <App />
//   // </StrictMode>,
// )
