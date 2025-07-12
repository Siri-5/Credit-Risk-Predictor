from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from flask_cors import cross_origin
import joblib
import pandas as pd
import shap
import numpy as np
import matplotlib
matplotlib.use('Agg')
import base64
from io import BytesIO
import matplotlib.pyplot as plt

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

# CORS(app)

# Load model and scaler
model = joblib.load("C:/Users/Chandana/OneDrive/Desktop/cc - Copy/xgb_model.pkl")
# model=joblib.load("C:/Users/Chandana/Untitled Folder 3/xgb_credit_model.pkl")
# scaler=joblib.load("C:/Users/Chandana/Untitled Folder 3/scaler.pkl")
scaler = joblib.load("C:/Users/Chandana/OneDrive/Desktop/cc - Copy/scaler.pkl")

# Your categorical mappings (same as before)
categorical_mappings = {
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
}

custom_labels = {
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
}

# Maintain feature order
feature_order = list(categorical_mappings.keys())

# def generate_shap_bar_plot(feature_importance):
#     features, values = zip(*feature_importance)
#     plt.figure(figsize=(2,2))
#     bars = plt.barh(features, values, color=['green' if v >= 0 else 'red' for v in values])
#     plt.xlabel('SHAP Value (Impact on Model Output)')
#     plt.title('Feature Contribution to Prediction')
#     plt.gca().invert_yaxis()
#     plt.tight_layout()

#     buf = BytesIO()
#     plt.savefig(buf, format="png")
#     plt.close()
#     buf.seek(0)
#     return base64.b64encode(buf.read()).decode("utf-8")

def generate_shap_bar_plot(feature_importance, top_n=10):
    # Get top N features
    top_features = feature_importance[:top_n]
    features, values = zip(*top_features)

    plt.figure(figsize=(2, 2))  # Resize here
    bars = plt.barh(features, values, color=['green' if v >= 0 else 'red' for v in values])
    plt.xlabel('SHAP Value (Impact on Model Output)')
    plt.title('Top Feature Contributions')
    plt.gca().invert_yaxis()
    plt.tight_layout()

    buf = BytesIO()
    plt.savefig(buf, format="png")
    plt.close()
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")


@app.route("/predict", methods=["POST", "OPTIONS"])
@cross_origin(origins="http://localhost:5173")
def predict():
    if request.method == "OPTIONS":
        return '', 200
    try:
        user_input = request.json
        # encoded_input = {k: categorical_mappings[k].get(v, 0) for k, v in user_input.items()}
        df = pd.DataFrame([user_input])
        df_scaled = scaler.transform(df)

        prediction_label = model.predict(df_scaled)[0]
        prediction = "Good Credit" if prediction_label == 1 else "Bad Credit"
        print("Prediction:", prediction)
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(df_scaled)
        values = shap_values[0]
        flattened_values = [float(np.ravel(v)[0]) for v in values]
        feature_importance = list(zip(feature_order, flattened_values))
        feature_importance.sort(key=lambda x: x[1], reverse=True)

        suggestions = []
        if prediction_label in [0, 2]:
            i = 0
            while len(suggestions) < 5 and i < len(feature_importance):
                feature, value = feature_importance[i]
                if feature.lower() not in ["age", "num_dependents", "occupation", "marital_status_sex"]:
                    suggestions.append(feature.replace('_', ' ').title())
                i += 1
        print("Suggestions:", suggestions)
        print("Feature Importance:", feature_importance)
        return jsonify({
            "prediction": prediction,
            "suggestions": suggestions,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=8000, debug=True)
    
# from flask import Flask, render_template, request
# from flask_cors import CORS
# import joblib
# import pandas as pd
# import shap
# import numpy as np
# import matplotlib 

# import logging

# matplotlib.use('Agg')
# import base64
# from io import BytesIO
# import matplotlib.pyplot as plt


# app = Flask(__name__)
# CORS(app)
# # app.logger.debug("Debugging message")
# # Load the model and scaler


# model = joblib.load("C:/Users/Chandana/OneDrive/Desktop/cc - Copy/xgb_model.pkl")
# scaler = joblib.load("C:/Users/Chandana/OneDrive/Desktop/cc - Copy/scaler.pkl")

# # Your categorical mappings
# categorical_mappings = {
#     'current_account': {'0_to_200_DM': 0, 'more_than_200_DM': 1, 'no_balance_or_debit': 2, 'no_running_account': 3},
#     'duration': {'<06': 0, '>54': 1, 'from_06_to_12': 2, 'from_12_to_18': 3, 'from_18_to_24': 4, 'from_24_to_30': 5, 'from_30_to_36': 6, 'from_36_to_42': 7, 'from_42_to_48': 8, 'from_48_to_54': 9},
#     'previous_credit': {'hesitant_pmt_of_previous_credit': 0, 'no_previous_credit_or_paid_back_all_previous_credits': 1, 'no_problems_current_credit_at_bank': 2, 'paid_back_previous_credits_at_this_bank': 3, 'problematic_running_account': 4},
#     'purpose': {'business': 0, 'furniture': 1, 'household_appliances': 2, 'new_car': 3, 'other': 4, 'radio_television': 5, 'repair': 6, 'retraining': 7, 'used_car': 8, 'vacation': 9},
#     'amount': {'from_0.5K_to_1K': 0, 'from_1.5K_to_2.5K': 1, 'from_10K_to_15K': 2, 'from_15K_to_20K': 3, 'from_1K_to_1.5K': 4, 'from_2.5K_to_5K': 5, 'from_5K_to_7.5K': 6, 'from_7.5K_to_10K': 7, 'less_than_0.5K': 8},
#     'value_saving_stocks': {'from_100_to_500_DM': 0, 'from_500_to_1000_DM': 1, 'less_than_100_DM': 2, 'more_than_1000_DM': 3, 'not_available_or_no_savings': 4},
#     'tenure': {'from_1_to_4_years': 0, 'from_4_to_7_years': 1, 'less_than_1_year': 2, 'more_than_7_years': 3, 'unemployed': 4},
#     'install_rate': {'from_20_to_25_percent': 0, 'from_20_to_35_percent': 1, 'less_than_20_percent': 2, 'more_than_35_percent': 3},
#     'marital_status_sex': {'female_not_single_or_male_single': 0, 'female_single': 1, 'male_divorced_or_separated': 2, 'male_married_or_widowed': 3},
#     'debtor_guarantors': {'Co-Applicant': 0, 'Guarantor': 1, 'none': 2},
#     'living_at_current_address': {'from_1_to_4_years': 0, 'from_4_to_7_years': 1, 'less_than_1_year': 2, 'more_than_7_years': 3},
#     'valueable_assets': {'car_or_other': 0, 'house_or_land': 1, 'not_available_or_no_assets': 2, 'saving_contract_or_life_insurance': 3},
#     'age': {'from_26_to_39': 0, 'from_40_to_59': 1, 'from_60_to_64': 2, 'less_than_25': 3, 'more_than_65': 4},
#     'other_credits': {'at_department_stores': 0, 'at_other_banks': 1, 'no_further_running_credits': 2},
#     'apartment_type': {'free_apartment': 0, 'owner_occupied_flat': 1, 'rented_flat': 2},
#     'credits_at_bank': {'four_or_five': 0, 'one': 1, 'six_or_more': 2, 'two_or_three': 3},
#     'occupation': {'executive': 0, 'skilled_worker': 1, 'unemployed_or_unskilled_with_no_permanent_residence': 2, 'unskilled_with_permanent_residence': 3},
#     'num_dependents': {'three_or_more': 0, 'up_to_two': 1},
#     'broadband': {'no': 0, 'yes': 1},
#     'foreign_worker': {'no': 0, 'yes': 1}
# }
# custom_labels = {
#            "age": {
#     "less_than_25": "Below 25 years",
#     "from_26_to_39": "26 – 39 years",
#     "from_40_to_59": "40 – 59 years",
#     "from_60_to_64": "60 – 64 years",
#     "more_than_65": "Above 65 years"
# },

#         "amount": {
#     "less_than_0.5K": "Less than ₹12,500",
#     "from_0.5K_to_1K": "₹12,500 – ₹25,000",
#     "from_1K_to_1.5K": "₹25,000 – ₹37,500",
#     "from_1.5K_to_2.5K": "₹37,500 – ₹62,500",
#     "from_2.5K_to_5K": "₹62,500 – ₹1.25L",
#     "from_5K_to_7.5K": "₹1.25L – ₹1.87L",
#     "from_7.5K_to_10K": "₹1.87L – ₹2.5L",
#     "from_10K_to_15K": "₹2.5L – ₹3.75L",
#     "from_15K_to_20K": "₹3.75L – ₹5L"
# },

# "current_account": {
#     "0_to_200_DM": "₹0 – ₹5,000 balance",
#     "more_than_200_DM": "More than ₹5,000 balance",
#     "no_balance_or_debit": "No balance / Overdrawn",
#     "no_running_account": "No current account"
# },
# "value_saving_stocks": {
#     "less_than_100_DM": "Less than ₹2,500 in savings",
#     "from_100_to_500_DM": "₹2,500 – ₹12,500 in savings",
#     "from_500_to_1000_DM": "₹12,500 – ₹25,000 in savings",
#     "more_than_1000_DM": "More than ₹25,000 in savings",
#     "not_available_or_no_savings": "Not available / No savings"
# },

#  "install_rate": {
#         "from_20_to_25_percent": "20% – 25%",
#         "from_20_to_35_percent": "25% – 35%",
#         "less_than_20_percent": "Less than 20%",
#         "more_than_35_percent": "More than 35%"
#     }

#     }
# # Input feature order
# feature_order = list(categorical_mappings.keys())




# def generate_shap_bar_plot(feature_importance):
#     features, values = zip(*feature_importance)

#     plt.figure(figsize=(10, 6))
#     bars = plt.barh(features, values, color=['green' if v >= 0 else 'red' for v in values])
#     plt.xlabel('SHAP Value (Impact on Model Output)')
#     plt.title('Feature Contribution to Prediction')
#     plt.gca().invert_yaxis()  
#     plt.tight_layout()

#     buf = BytesIO()
#     plt.savefig(buf, format="png")
#     plt.close()
#     buf.seek(0)
#     return base64.b64encode(buf.read()).decode("utf-8")

# # print("app.py is running ")
# @app.route("/predict", methods=["GET", "POST"])
# def index():
#     prediction = None
#     suggestions = []
#     feature_importance = []
#     shap_plot = None

#     if request.method == "POST":
#         user_input = {feature: request.form.get(feature) for feature in categorical_mappings}
#         encoded_input = {k: categorical_mappings[k].get(v, 0) for k, v in user_input.items()}
#         df = pd.DataFrame([encoded_input])
#         df_scaled = scaler.transform(df)

#         prediction_label = model.predict(df_scaled)[0]
#         prediction = "Good Credit" if prediction_label == 1 else "Bad Credit"
#         explainer = shap.TreeExplainer(model)
#         shap_values = explainer.shap_values(df_scaled)
#         values = shap_values[0]
#         flattened_values = [float(np.ravel(v)[0]) for v in values]
#         feature_importance = list(zip(feature_order, flattened_values))
#         feature_importance.sort(key=lambda x: x[1], reverse=True)

#         shap_plot = generate_shap_bar_plot(feature_importance)

#         if prediction_label == 2 or prediction_label == 0:
#             suggestions = []
#             i = 0
#             while len(suggestions) < 5 and i < len(feature_importance):
#                 feature, value = feature_importance[i]
#                 if feature.lower() not in ["age", "num_dependents","occupation", "martal_status_sex", "income"]:
#                     suggestions.append(f"{feature.replace('_', ' ').title()}")
#                 i += 1
#                 print(feature)

#     return render_template(
#         # "ind.html",
#         prediction=prediction,
#         mappings=categorical_mappings,
#         custom_labels=custom_labels,
#         suggestions=suggestions,
#         feature_importance=feature_importance,
#         shap_plot=shap_plot
#     )    # return render_template("index.html", prediction=prediction, mappings=categorical_mappings)

# if __name__ == "__main__":
#     app.run(port=5000, debug=True)
