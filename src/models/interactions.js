import mongoose from 'mongoose';

let Schema = mongoose.Schema;

const interactionSchema = new Schema(
  {
    signal_id: {
      type : Schema.ObjectId,
      ref  : "signals"
    },
    matched_users: [{type : Schema.ObjectId, ref: "users"}],
    comments:[{type : Schema.ObjectId, ref: "comments"}]
  }
)
