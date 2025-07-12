import asyncHandler from 'express-async-handler';
import CreditStatus from '../models/CreditStatusModel.js';

// @desc   Save Credit Status form data
// @route  POST /api/credit-status
// @access Public or Protected (adjust as needed)

const saveForm = asyncHandler(async (req, res) => {
  const {
    userId,
    age,
    amount,
    current_account,
    value_saving_stocks,
    install_rate,
    marital_status_sex,
    debtor_guarantors,
    living_at_current_address,
    valueable_assets,
    other_credits,
    apartment_type,
    credits_at_bank,
    occupation,
    num_dependents,
    broadband,
    foreign_worker,
    tenure,
    previous_credit,
    purpose,
    prediction,
    suggestions
    // shap_plot,

  } = req.body;
// console.log(req.body)
//   Basic required fields validation
//   if (
//     !age ||
//     !amount ||
//     !current_account ||
//     !value_saving_stocks ||
//     !install_rate ||
//     !marital_status_sex ||
//     !debtor_guarantors ||
//     !living_at_current_address ||
//     !valueable_assets ||
//     !other_credits ||
//     !apartment_type ||
//     !credits_at_bank ||
//     !occupation ||
//     !num_dependents ||
//     !broadband ||
//     !foreign_worker ||
//     !tenure ||
//     !previous_credit ||
//     !purpose ||
//     !prediction ||
//     !suggestions ||
//     !userId
//   ) {
//     res.status(400);
//     throw new Error('Please fill all required fields');
//   }

  const newForm = await CreditStatus.create({
    userId,
    age,
    amount,
    current_account,
    value_saving_stocks,
    install_rate,
    marital_status_sex,
    debtor_guarantors,
    living_at_current_address,
    valueable_assets,
    other_credits,
    apartment_type,
    credits_at_bank,
    occupation,
    num_dependents,
    broadband,
    foreign_worker,
    prediction,
    suggestions,
    tenure,
    previous_credit,
    purpose
    // shap_plot,
  });

  res.status(201).json(newForm);
});
const getRecords = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    res.status(400);
    throw new Error("Invalid seller ID");
  }
  const rec = await CreditStatus.find({ userId });
  // if (!crops || crops.length === 0) {
  //   res.status(404);
  //   throw new Error("No crops found for this seller");
  // }

  res.status(200).json(rec||[]);
;
});

export {saveForm, getRecords}