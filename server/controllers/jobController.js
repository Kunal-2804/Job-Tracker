import Job from "../models/Job.js";

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    let query = { user: req.user.id };

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { jobRole: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status && status !== 'All') {
      query.status = status;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Public
export const createJob = async (req, res) => {
  try {
    const { companyName, jobRole, status, applicationDate, notes } = req.body;

    if (!companyName || !jobRole) {
      return res.status(400).json({ message: "Please provide company name and job role" });
    }

    const job = await Job.create({
      companyName,
      jobRole,
      status,
      applicationDate,
      notes,
      user: req.user.id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Public
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check for user
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Make sure the logged in user matches the job user
    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Public
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check for user
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Make sure the logged in user matches the job user
    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await job.deleteOne();

    res.status(200).json({ id: req.params.id, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
