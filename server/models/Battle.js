import mongoose from "mongoose";

const battleSchema = new mongoose.Schema(
  {
    blog1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    blog2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    blog1Votes: {
      type: Number,
      default: 0,
    },
    blog2Votes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "finished", "archived"],
      default: "active",
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      default: null,
    },
    round: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const Battle = mongoose.models.Battle || mongoose.model("Battle", battleSchema);

export default Battle;
