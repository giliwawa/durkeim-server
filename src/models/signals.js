import mongoose from 'mongoose';


const {Schema} = mongoose;

mongoose.Promise = global.Promise

const signalSchema = new Schema({

  "title"           : String,
  "body"            : String,
  "matched_users"   : [{type : Schema.ObjectId, ref: "users"}],
  "tags"            : [{type: Schema.ObjectId, ref: "tags"}],
  "owner_id"        : {type: Schema.ObjectId, ref: "users"},
  "created_at"      : {
    type : Date,
    default : Date.now
  },
  "isDeleted"       : {
    type: Boolean,
    default : false
  }
});
// methods ======================


const signals = mongoose.model('signals', signalSchema);
export default signals;
