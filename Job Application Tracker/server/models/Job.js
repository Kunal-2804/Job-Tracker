import mongoose from "mongoose";

const jobSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    companyName: {
      type: String,

      required: [true, "Please add a company name"],
    },
    jobRole: {
      type: String,
      required: [true, "Please add a job role"],
    },
    status: {
      type: String,
      required: true,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Job", jobSchema);
