import React, { useEffect, useState } from 'react';
// import { useSelector } from "react-redux";
import { useSelector } from "react-redux";
import './CreditStatusForm.css'; // Extract the CSS to a separate file

const categoricalMappings = {
    'current_account': {'0_to_200_DM': 0, 'more_than_200_DM': 1, 'no_balance_or_debit': 2, 'no_running_account': 3},
    'duration': {'<06': 0, '>54': 1, 'from_06_to_12': 2, 'from_12_to_18': 3, 'from_18_to_24': 4, 'from_24_to_30': 5, 'from_30_to_36': 6, 'from_36_to_42': 7, 'from_42_to_48': 8, 'from_48_to_54': 9},
    'previous_credit': {'hesitant_pmt_of_previous_credit': 0, 'no_previous_credit_or_paid_back_all_previous_credits': 1, 'no_problems_current_credit_at_bank': 2, 'paid_back_previous_credits_at_this_bank': 3, 'problematic_running_account': 4},
    'purpose': {'business': 0, 'furniture': 1, 'household_appliances': 2, 'new_car': 3, 'other': 4, 'radio_television': 5, 'repair': 6, 'retraining': 7, 'used_car': 8, 'vacation': 9},
    'amount': {'from_0.5K_to_1K': 0, 'from_1.5K_to_2.5K': 1, 'from_10K_to_15K': 2, 'from_15K_to_20K': 3, 'from_1K_to_1.5K': 4, 'from_2.5K_to_5K': 5, 'from_5K_to_7.5K': 6, 'from_7.5K_to_10K': 7, 'less_than_0.5K': 8},
    'value_saving_stocks': {'from_100_to_500_DM': 0, 'from_500_to_1000_DM': 1, 'less_than_100_DM': 2, 'more_than_1000_DM': 3, 'not_available_or_no_savings': 4},
    'tenure': {'from_1_to_4_years': 0, 'from_4_to_7_years': 1, 'less_than_1_year': 2, 'more_than_7_years': 3, 'unemployed': 4},
    'install_rate': {'from_20_to_25_percent': 0, 'from_20_to_35_percent': 1, 'less_than_20_percent': 2, 'more_than_35_percent': 3},
    'marital_status_sex': {'female_not_single_or_male_single': 0, 'female_single': 1, 'male_divorced_or_separated': 2, 'male_married_or_widowed': 3},
    'debtor_guarantors': {'Co-Applicant': 0, 'Guarantor': 1, 'none': 2},
    'living_at_current_address': {'from_1_to_4_years': 0, 'from_4_to_7_years': 1, 'less_than_1_year': 2, 'more_than_7_years': 3},
    'valueable_assets': {'car_or_other': 0, 'house_or_land': 1, 'not_available_or_no_assets': 2, 'saving_contract_or_life_insurance': 3},
    'age': {'from_26_to_39': 0, 'from_40_to_59': 1, 'from_60_to_64': 2, 'less_than_25': 3, 'more_than_65': 4},
    'other_credits': {'at_department_stores': 0, 'at_other_banks': 1, 'no_further_running_credits': 2},
    'apartment_type': {'free_apartment': 0, 'owner_occupied_flat': 1, 'rented_flat': 2},
    'credits_at_bank': {'four_or_five': 0, 'one': 1, 'six_or_more': 2, 'two_or_three': 3},
    'occupation': {'executive': 0, 'skilled_worker': 1, 'unemployed_or_unskilled_with_no_permanent_residence': 2, 'unskilled_with_permanent_residence': 3},
    'num_dependents': {'three_or_more': 0, 'up_to_two': 1},
    'broadband': {'no': 0, 'yes': 1},
    'foreign_worker': {'no': 0, 'yes': 1}
};

const customLabels = {
    "age": {
        "less_than_25": "Below 25 years",
        "from_26_to_39": "26 – 39 years",
        "from_40_to_59": "40 – 59 years",
        "from_60_to_64": "60 – 64 years",
        "more_than_65": "Above 65 years"
    },
    "amount": {
        "less_than_0.5K": "Less than ₹12,500",
        "from_0.5K_to_1K": "₹12,500 – ₹25,000",
        "from_1K_to_1.5K": "₹25,000 – ₹37,500",
        "from_1.5K_to_2.5K": "₹37,500 – ₹62,500",
        "from_2.5K_to_5K": "₹62,500 – ₹1.25L",
        "from_5K_to_7.5K": "₹1.25L – ₹1.87L",
        "from_7.5K_to_10K": "₹1.87L – ₹2.5L",
        "from_10K_to_15K": "₹2.5L – ₹3.75L",
        "from_15K_to_20K": "₹3.75L – ₹5L"
    },
    "current_account": {
"0_to_200_DM": "₹0 – ₹5,000 balance",
"more_than_200_DM": "More than ₹5,000 balance",
"no_balance_or_debit": "No balance / Overdrawn",
"no_running_account": "No current account"
},
"value_saving_stocks": {
"less_than_100_DM": "Less than ₹2,500 in savings",
"from_100_to_500_DM": "₹2,500 – ₹12,500 in savings",
"from_500_to_1000_DM": "₹12,500 – ₹25,000 in savings",
"more_than_1000_DM": "More than ₹25,000 in savings",
"not_available_or_no_savings": "Not available / No savings"
},

"install_rate": {
"from_20_to_25_percent": "20% – 25%",
"from_20_to_35_percent": "25% – 35%",
"less_than_20_percent": "Less than 20%",
"more_than_35_percent": "More than 35%"
}
};

const CreditStatusForm = () => {
  const [formData, setFormData] = useState({});
  const [prediction, setPrediction] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  // const [shapPlotUrl, setShapPlotUrl] = useState('');

  useEffect(() => {
    // Initialize with default values
    const initialData = {};
    Object.keys(categoricalMappings).forEach(key => {
      const firstKey = Object.keys(categoricalMappings[key])[0];
      initialData[key] = firstKey;
    });
    setFormData(initialData);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const { userInfo } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const encodedData = {};
    for (const field in formData) {
      const selectedLabel = formData[field];
      encodedData[field] = categoricalMappings[field][selectedLabel]; }
    console.log(encodedData)
    console.log("Sending data to backend...")
    console.log(formData)
    const response = await fetch("http://localhost:8000/predict", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(encodedData)
    });

    const result = await response.json();
    const userId = userInfo?._id;

if (!userId) 
{
  console.log("User not found in localStorage. Please log in.");
  // Handle the case when user is not found in localStorage
}
else{

  // const parsedUser = JSON.parse(storedUser);
  // const userId = parsedUser.userInfo?._id;

  console.log("User ID:", userId);  // 👉 Output: 68145165d2a2de0ac232747f


    
    const res = await fetch("/api/v1/credit-status/submit-form", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        ...formData,
        
        // encodedData,
        prediction: result.prediction,
        suggestions: result.suggestions,
        // shapPlotUrl: result.shap_plot
      })
    });
    console.log(result)
    setPrediction(result.prediction || '');
    setSuggestions(result.suggestions || []);
    // setShapPlotUrl(result.shap_plot || '');
  }
};

  return (
    <div className="form-container">
      <h2>Credit Status Prediction Form</h2>

      <form onSubmit={handleSubmit} id="prediction-form">
        {Object.keys(categoricalMappings).map((field) => (
          <div key={field}>
            <label htmlFor={field}>{field}</label>
            <select name={field} value={formData[field] || ''} onChange={handleChange}>
              {Object.entries(categoricalMappings[field]).map(([label, value]) => (
                <option key={label} value={label}>
                  {customLabels[field]?.[label] || label}
                </option>
              ))}
            </select>
          </div>
        ))}
        <input type="submit" value="Predict Credit Status" />
      </form>

      {prediction && <h2 id="prediction-result">{prediction}</h2>}

      {suggestions.length > 0 && (
        <div id="suggestions-container" className="suggestions-container">
          <h3>🛠 Suggestions to Improve:</h3>
          <ul>
            {suggestions.map((s, i) => (
              <li key={i}><strong>{s}</strong></li>
            ))}
          </ul>
        </div>
      )}

{prediction=="Good Credit" && (
        <div id="suggestions-container" className="good-container">
          <h3>Maintain this credit</h3>
        </div>
      )}
      {/* {shapPlotUrl && (
        <>
          <h3 id="shap-values-heading">Feature Impact (SHAP VALUES)</h3>
          <img id="shap-plot" src={shapPlotUrl} alt="SHAP Feature Impact" />
        </>
      )} */}
    </div>
  );
};

export default CreditStatusForm;