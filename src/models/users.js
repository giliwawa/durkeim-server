import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const {Schema} = mongoose;


mongoose.Promise = global.Promise

const userSchema = new Schema({
  "user_info":{
    "email" : {
      type:String,
      index: true
    },
    "first_name": String,
    "last_name" : String,
    "occupation": String,
    "company"   : String,
    "bio"       : String,
    "social"    : [Schema.Types.Object],
    "profile_img": String
  },
  "interests"   : [{type: Schema.ObjectId, ref: "tags"}],
  "general_info":{
    "education" : [Schema.Types.Object],
    "experience": [Schema.Types.Object]
  },
  "password"  : String,
  "created_at": {
    "contacts"  : [{type : Schema.ObjectId, ref: "users"}],
    type : Date,
    default : Date.now
  },
  "isDeleted" : {
    type: Boolean,
    default : false
  }
});
// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const users = mongoose.model('users', userSchema);
export default users;
