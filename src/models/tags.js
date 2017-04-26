import mongoose from 'mongoose';


const {Schema} = mongoose;

mongoose.Promise = global.Promise

const tagSchema = new Schema({

  "value" : String,
  "type"  : String,
  "created_at": {
    type : Date,
    default : Date.now
  },
  "isDeleted" : {
    type: Boolean,
    default : false
  }
});
// methods ======================

const tags = mongoose.model('tags', tagSchema);
export default tags;
