import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const {Schema} = mongoose;

mongoose.Promise = global.Promise

const userSchema = new Schema({
  "email" : {
    type:String,
    index: true
  },
  "first_name": String,
  "last_name" : String,
  "password"  : String,
  "friends"   : [{type : Schema.ObjectId, ref: "users"}],
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
