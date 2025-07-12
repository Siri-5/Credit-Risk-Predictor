import mongoose from 'mongoose';

// Define the schema for the CreditStatusForm data
const creditStatusSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
  age: {
    type: String,
    enum: ['less_than_25', 'from_26_to_39', 'from_40_to_59', 'from_60_to_64', 'more_than_65'],
    // required: true,
  },
  amount: {
    type: String,
    enum: [
      'less_than_0.5K', 'from_0.5K_to_1K', 'from_1K_to_1.5K', 'from_1.5K_to_2.5K',
      'from_2.5K_to_5K', 'from_5K_to_7.5K', 'from_7.5K_to_10K', 'from_10K_to_15K', 'from_15K_to_20K'
    ],
    // required: true,
  },
  // Add the rest of your schema fields here
  current_account: {
    type: String,
    enum: ['0_to_200_DM', 'more_than_200_DM', 'no_balance_or_debit', 'no_running_account'],
    // required: true,
  },
  value_saving_stocks: {
    type: String,
    enum: ['less_than_100_DM', 'from_100_to_500_DM', 'from_500_to_1000_DM', 'more_than_1000_DM', 'not_available_or_no_savings'],
    // required: true,
  },
  install_rate: {
    type: String,
    enum: ['from_20_to_25_percent', 'from_20_to_35_percent', 'less_than_20_percent', 'more_than_35_percent'],
    // required: true,
  },
  marital_status_sex: {
    type: String,
    enum: ['female_not_single_or_male_single', 'female_single', 'male_divorced_or_separated', 'male_married_or_widowed'],
    // required: true,
  },
  debtor_guarantors: {
    type: String,
    enum: ['Co-Applicant', 'Guarantor', 'none'],
    // required: true,
  },
  living_at_current_address: {
    type: String,
    enum: ['from_1_to_4_years', 'from_4_to_7_years', 'less_than_1_year', 'more_than_7_years'],
    // required: true,
  },
  valueable_assets: {
    type: String,
    enum: ['car_or_other', 'house_or_land', 'not_available_or_no_assets', 'saving_contract_or_life_insurance'],
    // required: true,
  },
  other_credits: {
    type: String,
    enum: ['at_department_stores', 'at_other_banks', 'no_further_running_credits'],
    // required: true,
  },
  apartment_type: {
    type: String,
    enum: ['free_apartment', 'owner_occupied_flat', 'rented_flat'],
    // required: true,
  },
  credits_at_bank: {
    type: String,
    enum: ['four_or_five', 'one', 'six_or_more', 'two_or_three'],
    // required: true,
  },
  occupation: {
    type: String,
    enum: ['executive', 'skilled_worker', 'unemployed_or_unskilled_with_no_permanent_residence', 'unskilled_with_permanent_residence'],
    // required: true,
  },
  num_dependents: {
    type: String,
    enum: ['three_or_more', 'up_to_two'],
    // required: true,
  },
  broadband: {
    type: String,
    enum: ['no', 'yes'],
    // required: true,
  },
  foreign_worker: {
    type: String,
    enum: ['no', 'yes'],
    // required: true,
  },
  previous_credit: {
    type: String,
    enum: [
      'hesitant_pmt_of_previous_credit',
      'no_previous_credit_or_paid_back_all_previous_credits',
      'no_problems_current_credit_at_bank',
      'paid_back_previous_credits_at_this_bank',
      'problematic_running_account',
    ],
    // required: true,
  },
  purpose: {
    type: String,
    enum: [
      'business', 'furniture', 'household_appliances', 'new_car', 'other',
      'radio_television', 'repair', 'retraining', 'used_car', 'vacation'
    ],
    // required: true,
  },
  tenure: {
    type: String,
    enum: [
      'from_1_to_4_years',
      'from_4_to_7_years',
      'less_than_1_year',
      'more_than_7_years',
      'unemployed',
    ],
    // required: true,
  },
  prediction: {
    type: String,
    // required: false,
  },
  suggestions: {
    type: [String],
    // required: false,
  },
  // shap_plot: {
  //   type: String,
  //   required: false,
  // },
}, { timestamps: true });

// Create and export the model
export default mongoose.model('CreditStatus', creditStatusSchema);

