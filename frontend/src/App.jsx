import React from 'react'
import {Outlet, useLocation} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navigation from "./pages/Auth/Navigation";
import './App.css' 

const App = () => {
  const location = useLocation()
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register"

  return (
    // <div>App</div>
    // <h1 >
    //   Hello world!
    // </h1>
    <>
    <ToastContainer/>
    { !hideNavbar && <Navigation /> }
    <main>
    <Outlet />
    </main>
    </>
  );
};

export default App
// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
