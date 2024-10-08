import { Company } from '../models/company.model.js';

export const registerCompany = async (req, res) => {
     try {
          const { companyName } = req.body;
          if (!companyName) {
               return res.status(400).json({
                    message: "Company name is required!",
                    success: false
               });
          };

          let company = await Company.findOne({ name: companyName });
          if (company) {
               res.status(400).json({
                    message: "You cannot register same company again!",
                    success: false,
               });
          };

          company = await Company.create({
               name: companyName,
               userId: req.id
          });

          return res.status(201).json({
               message: "Company registered successfully!",
               success: true,
          });

     } catch (error) {
          console.log(error)
     };
};