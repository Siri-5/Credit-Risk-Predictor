import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './RecordList.css';

const customLabels = {
  "age": {
    "less_than_25": "Below 25 years",
    "from_26_to_39": "26–39 years",
    "from_40_to_59": "40–59 years",
    "from_60_to_64": "60–64 years",
    "more_than_65": "Above 65 years",
  },
  "amount": {
    "less_than_0.5K": "Less than ₹12,500",
    "from_0.5K_to_1K": "₹12,500–₹25,000",
    "from_1K_to_1.5K": "₹25,000–₹37,500",
    "from_1.5K_to_2.5K": "₹37,500–₹62,500",
    "from_2.5K_to_5K": "₹62,500–₹1.25L",
    "from_5K_to_7.5K": "₹1.25L–₹1.87L",
    "from_7.5K_to_10K": "₹1.87L–₹2.5L",
    "from_10K_to_15K": "₹2.5L–₹3.75L",
    "from_15K_to_20K": "₹3.75L–₹5L",
  },
  "current_account": {
    "0_to_200_DM": "₹0–₹5,000 balance",
    "more_than_200_DM": "More than ₹5,000 balance",
    "no_balance_or_debit": "No balance / Overdrawn",
    "no_running_account": "No current account",
  },
  "value_saving_stocks": {
    "less_than_100_DM": "Less than ₹2,500 in savings",
    "from_100_to_500_DM": "₹2,500–₹12,500 in savings",
    "from_500_to_1000_DM": "₹12,500–₹25,000 in savings",
    "more_than_1000_DM": "More than ₹25,000 in savings",
    "not_available_or_no_savings": "Not available / No savings",
  },
  "install_rate": {
    "from_20_to_25_percent": "20%–25%",
    "from_20_to_35_percent": "25%–35%",
    "less_than_20_percent": "Less than 20%",
    "more_than_35_percent": "More than 35%",
  },
  //  "num_dependents": {
  //   "three_or_more": "Three or more dependents",
  //   "up_to_two": "Up to two dependents",
  // },
  // "apartment_type": {
  //   "free_apartment": "Free apartment",
  //   "owner_occupied_flat": "Owner-occupied flat",
  //   "rented_flat": "Rented flat",
  // },
  // "credits_at_bank": {
  //   "four_or_five": "4-5 credits at bank",
  //   "one": "1 credit at bank",
  //   "six_or_more": "6 or more credits at bank",
  //   "two_or_three": "2-3 credits at bank",
  // },
  // "marital_status_sex": {
  //   "female_not_single_or_male_single": "Female (not single) or Male (single)",
  //   "female_single": "Female (single)",
  //   "male_divorced_or_separated": "Male (divorced/separated)",
  //   "male_married_or_widowed": "Male (married/widowed)",
  // },
  // "living_at_current_address": {
  //   "from_1_to_4_years": "1–4 years",
  //   "from_4_to_7_years": "4–7 years",
  //   "less_than_1_year": "Less than 1 year",
  //   "more_than_7_years": "More than 7 years",
  // },
  // "valueable_assets": {
  //   "car_or_other": "Car or other assets",
  //   "house_or_land": "House or land",
  //   "not_available_or_no_assets": "No assets or not available",
  //   "saving_contract_or_life_insurance": "Saving contract or life insurance",
  // },
};

const getCustomLabel = (key, value) => {
  return customLabels[key] && customLabels[key][value]
    ? customLabels[key][value]
    : value;
};

const Records = () => {
  const [records, setRecords] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      alert("Please log in first!");
      navigate("/login");
      return;
    }

    const fetchRecords = async () => {
      try {
        const response = await fetch("/api/v1/credit-status/get-form", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          }
        });

        if (!response.ok) {
          throw new Error("Couldn't fetch your records.");
        }

        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchRecords();
  }, [userInfo, navigate]);

  return (
    <div style={{
      // Height: '100vh',
      // display: 'flex',
      // justifyContent: 'center',
      // alignItems: 'center',
      // flexDirection: 'column',
      // padding: '20px',
      // color: 'black',
    }} className="records-container">
    <div style={{ padding: '20px', color: 'black' }}>
      <h2>Your Past Credit Predictions</h2>
      {records.length === 0 ? (
        <p>There's nothing to show yet.</p>
      ) : (
        <ul className="record-list">
          {records.map((record, index) => (
            <li
              key={index}
              className={`record-card ${record.prediction === "Bad Credit" ? "bad-credit" : "good-credit"}`} >
              <strong>#{index + 1}</strong><br />
              <strong>Age:</strong> {getCustomLabel("age", record.age)}<br />
              <strong>Amount:</strong> {getCustomLabel("amount", record.amount)}<br />
              <strong>Apartment Type:</strong> {record.apartment_type}<br />
              <strong>Broadband:</strong> {record.broadband}<br />
              <strong>Credits at Bank:</strong> {record.credits_at_bank}<br />
              <strong>Current Account:</strong> {getCustomLabel("current_account", record.current_account)}<br />
              <strong>Debtor/Guarantors:</strong> {record.debtor_guarantors}<br />
              <strong>Foreign Worker:</strong> {record.foreign_worker}<br />
              <strong>Installment Rate:</strong> {getCustomLabel("install_rate", record.install_rate)}<br />
              <strong>Living at Current Address:</strong> {record.living_at_current_address}<br />
              <strong>Marital Status & Sex:</strong> {record.marital_status_sex}<br />
              <strong>Dependents:</strong> {record.num_dependents}<br />
              <strong>Occupation:</strong> {record.occupation}<br />
              <strong>Other Credits:</strong> {record.other_credits}<br />
              <strong>Previous Credit:</strong> {record.previous_credit}<br />
              <strong>Purpose:</strong> {record.purpose}<br />
              <strong>Tenure:</strong> {record.tenure}<br />
              <strong>Value Saving Stocks:</strong> {getCustomLabel("value_saving_stocks", 
                record.value_saving_stocks)}<br />
              <strong>Valuable Assets:</strong> {record.valueable_assets}<br />
              <div className="result">
                <strong>Prediction:</strong> {record.prediction}<br />
              </div>
              {record.prediction === "Bad Credit" && (
                <div className="suggestions">
                  <strong>Suggestions:</strong> {record.suggestions?.join(', ')}<br />
                </div>
              )}
              <strong>Predicted At:</strong> {new Date(record.createdAt).toLocaleString()}<br />
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
};


export default Records;


// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import './RecordList.css';


// const Records = () => {
//   const [records, setRecords] = useState([]);
//   const { userInfo } = useSelector((state) => state.auth);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!userInfo) {
//       alert("Please log in first!");
//       navigate("/login");
//       return;
//     }

//     const fetchRecords = async () => {
//       try {
//         const response = await fetch("/api/v1/credit-status/get-form", {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${userInfo.token}`,
//           }
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch records");
//         }

//         const data = await response.json();
//         console.log(data);
//         setRecords(data);
//       } catch (error) {
//         console.error("Error fetching records:", error);
//       }
//     };

//     fetchRecords();
//   }, [userInfo, navigate]);

//   return (
//     <div style={{ padding: '20px', color: 'black' }}>
//       <h2>Previous Credit Predictions</h2>
//       {records.length === 0 ? (
//         <p>No records to display.</p>
//       ) : (
//         <ul className="record-list">
//   {records.map((record, index) => (
//     <li
//       key={index}
//       className={`record-card ${record.prediction === "Bad Credit" ? "bad-credit" : "good-credit"}`}
//     >
//       <strong>#{index + 1}</strong><br />
//       <strong>Age:</strong> {record.age}<br />
//       <strong>Amount:</strong> {record.amount}<br />
//       <strong>Apartment Type:</strong> {record.apartment_type}<br />
//       <strong>Broadband:</strong> {record.broadband}<br />
//       <strong>Credits at Bank:</strong> {record.credits_at_bank}<br />
//       <strong>Current Account:</strong> {record.current_account}<br />
//       <strong>Debtor/Guarantors:</strong> {record.debtor_guarantors}<br />
//       <strong>Foreign Worker:</strong> {record.foreign_worker}<br />
//       <strong>Installment Rate:</strong> {record.install_rate}<br />
//       <strong>Living at Current Address:</strong> {record.living_at_current_address}<br />
//       <strong>Marital Status & Sex:</strong> {record.marital_status_sex}<br />
//       <strong>Number of Dependents:</strong> {record.num_dependents}<br />
//       <strong>Occupation:</strong> {record.occupation}<br />
//       <strong>Other Credits:</strong> {record.other_credits}<br />
      
//       <strong>Previous Credit:</strong> {record.previous_credit}<br />
//       <strong>Purpose:</strong> {record.purpose}<br />
      
//       <strong>Tenure:</strong> {record.tenure}<br />
//       <strong>Value Saving Stocks:</strong> {record.value_saving_stocks}<br />
//       <strong>Valuable Assets:</strong> {record.valueable_assets}<br />
//       <div className="result">
//       <strong >Prediction:</strong> {record.prediction}<br />
//       </div>
//       {record.prediction === "Bad Credit" && (
//         <div className="suggestions">
//           <strong>Suggestions:</strong> {record.suggestions?.join(', ')}<br />
//         </div>
//       )}
//       <strong>Predicted At:</strong> {new Date(record.createdAt).toLocaleString()}<br />
//     </li>
//   ))}
// </ul>

//       )}
//     </div>
//   );
// };

// export default Records;


// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

// const Records = () => {
//   const [records, setRecords] = useState([]);
//   const { userInfo } = useSelector((state) => state.auth);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!userInfo) {
//       alert("Please log in first!");
//       navigate("/login");
//     } else {
//       // Simulated data – replace with API call later
//       const response = await fetch("/api/v1/credit-status/get-form", {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(encodedData)
        
//       });
//       setRecords(dummyData);
//     }
//   }, [userInfo, navigate]);

//   return (
//     <div style={{ padding: '20px', color: 'black' }}>
//       <h2>Previous Credit Predictions</h2>
//       {records.length === 0 ? (
//         <p>No records to display.</p>
//       ) : (
//         <ul>
//           {records.map((record, index) => (
//             <li key={index} style={{ marginBottom: '10px' }}>
//               <strong>Status:</strong> {record.status} <br />
//               <strong>Predicted At:</strong> {new Date(record.createdAt).toLocaleString()}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Records;

// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Records = () => {
//   const [records, setRecords] = useState([]);
//   const { userInfo } = useSelector((state) => state.auth);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!userInfo) {
//       alert("Please log in first!");
//       navigate("/login");
//       return;
//     }

//     const fetchRecords = async () => {
//       try {
//         const { data } = await axios.get("/api/creditstatuses", {
//           headers: {
//             Authorization: `Bearer ${userInfo.token}`, // if using JWT
//           },
//         });

//         // Assuming backend returns all and we filter here
//         const userRecords = data.filter(
//           (rec) => rec.email === userInfo.email // or use rec.user === userInfo._id
//         );

//         setRecords(userRecords);
//       } catch (err) {
//         console.error("Error fetching records:", err);
//       }
//     };

//     fetchRecords();
//   }, [userInfo, navigate]);

//   return (
//     <div style={{ padding: "20px", color: "black" }}>
//       <h2>Your Previous Credit Predictions</h2>
//       {records.length === 0 ? (
//         <p>No records found.</p>
//       ) : (
//         <ul>
//           {records.map((rec, index) => (
//             <li key={rec._id || index} style={{ marginBottom: "10px" }}>
//               <strong>Status:</strong> {rec.status} <br />
//               <strong>Predicted At:</strong> {new Date(rec.createdAt).toLocaleString()}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Records;
