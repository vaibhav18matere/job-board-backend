import { Application } from '../models/application.model.js';
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
     try {
          const userId = req.id;
          const jobId = req.params.id;

          if (!jobId) {
               return res.status(400).json({
                    message: "Job ID is required!",
                    success: false
               });
          };

          // check if user is already applied for this job 

          const existingApplication = await Application.findOne({
               job: jobId,
               applicant: userId
          });

          if (existingApplication) {
               return res.status(400).json({
                    message: "You have already applied for this job!",
                    success: false,
               });
          };

          // check if the job exists or not

          const job = await Job.findById(jobId);

          if (!job) {
               return res.status(400).json({

                    message: "Job not found!",
                    success: false
               });
          };

          // apply for new job if all above checks are okay

          const newApplication = await Application.create({
               job: jobId,
               application: userId
          });

          job.applications.push(newApplication._id);

          await job.save();

          return res.status(201).json({
               message: "Job applied successfully!",
               success: true
          });

     } catch (error) {
          console.log(error);
     }
};


export const getAppliedJobs = async (req, res) => {
     try {
          const userId = req.id;

          const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
               path: 'job',
               options: { sort: { createdAt: -1 } },
               populate: {
                    path: 'company',
                    option: { sort: { createdAt: -1 } },
               }
          });

          if (!application) {
               return res.status(404).json({
                    message: "No application found!",
                    success: false,
               });
          };

          return res.status(200).json({
               application,
               success: true
          });

     } catch (error) {
          console.log(error);
     }
};