
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { FaChartLine, FaHistory } from "react-icons/fa";
import './Home.css'; 

const Home = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const handlePredictClick = () => {
    if (userInfo) {
      navigate("/form");
    } else {
      alert("Please log in first!");
      navigate("/login");
    }
  };

  const handlePrevRecordsClick = () => {
    if (userInfo) {
      navigate("/records");
    } else {
      alert("Please log in first!");
      navigate("/login");
    }
  };

  return (
    <div className="home-container">
      <div className="overlay">
        <h1>Welcome to Credit Risk Predictor</h1>
        <div className="button-group">
          <button onClick={handlePredictClick}>
            <FaChartLine /> Predict Credit Risk
          </button>
          <button onClick={handlePrevRecordsClick}>
            <FaHistory /> View Past Records
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from "react-redux";

// const Home = () => {
//   const navigate = useNavigate();
//   const { userInfo } = useSelector((state) => state.auth);

//   const handlePredictClick = () => {
//     if (userInfo) {
//       navigate("/form");
//     } else {
//       alert("Please log in first!");
//       navigate("/login");
//     }
//   };
//   const handlePrevRecordsClick = () => {
//     if (userInfo) {
//       navigate("/records");
//     } else {
//       alert("Please log in first!");
//       navigate("/login");
//     }
//   };

//   return (
//     <div style={{ color: 'black' }}>
//       Homeee
//       <br />
//       <button onClick={handlePredictClick}>Predict</button>
//       <br />
//       <button onClick={handlePrevRecordsClick}>Prev Records</button>
//     </div>
//   );
// };

// export default Home;

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from "react-redux";

// const Home = () => {
//   const navigate = useNavigate();

//   // Check if user is logged in (example using localStorage)
//   // const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
//   const { userInfo } = useSelector((state) => state.auth)

//   const handlePredictClick = () => {

//     if (userInfo) {
//       navigate("/form");
//     } else {
//       alert("Please log in first!");
//       navigate("/login"); // Navigate to login page
//     }
//   };

//   return (
//     <div style={{ color: 'black' }}>
//       Homeee
//       <br />
//       <button onClick={handlePredictClick}>Predict</button>
//     </div>
//   );
// };

// export default Home;

// import React from 'react';
// // import { Navigate } from 'react-router';
// import { useNavigate } from 'react-router-dom';


// const Home = () => {
//   const navigate=useNavigate();
//   const handlePredictClick = () => {
//     // window.location.href = '/ind.html'; // Ensure it's an absolute path
//     navigate("/form");

//   };

//   return (
//     <div style={{ color: 'black' }}>
//       Homeee
//       <br />
//       <button onClick={handlePredictClick}>Predict</button>
//     </div>
//   );
// };

// export default Home;

// import React from 'react'

// const Home = () => {
//   return (
//     <div style={{ color: 'black' }}>Homeee</div>
//   )
// }

// export default Home
// import React from 'react';

// const Home = () => {
//   const handlePredictClick = () => {
//     window.location.href = 'ind.html';
//   };

//   return (
//     <div style={{ color: 'black' }}>
//       Homeee
//       <br />
//       <button onClick={handlePredictClick}>Predict</button>
//     </div>
//   );
// };

// export default Home;
