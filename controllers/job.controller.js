import { Job } from "../models/job.model.js";

export const postJob = async (req, res) => {
     try {
          const { title, description, requirements, salary, experience, location, jobType, position, companyId } = req.body;

          const userId = req.id;

          if (!title || !description || !requirements || !salary || !experience || !location || !jobType || !position || !companyId) {
               return res.status(400).json({
                    message: "Something is missing!",
                    success: false
               });
          };

          const job = await Job.create({
               title,
               description,
               requirements: requirements.split(","),
               salary: Number(salary),
               experienceLevel: experience,
               location,
               jobType,
               position,
               company: companyId,
               created_by: userId
          });

          res.status(201).json({
               job,
               message: "New job created successfully!",
               success: true,
          });

     } catch (error) {
          console.log(error)
     };
};