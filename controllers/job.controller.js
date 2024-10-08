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

export const getAllJobs = async (req, res) => {
     try {
          const keywords = req.query.keyword | "";

          const query = {
               $or: [
                    { titel: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
               ]
          };

          const jobs = await Job.find(query);

          if (!jobs) {
               res.status(404).json({
                    message: "Jobs not found!",
                    success: false
               });
          };

          return res.status(200).json({
               jobs,
               success: true
          });

     } catch (error) {
          console.log(error);
     };
};