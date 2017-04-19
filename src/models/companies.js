import mongoose from 'mongoose';


const {Schema} = mongoose;

/**************
 * Company:   *
	logo        *
	name        *
	description *
	website     *
	social      *
	metrics:{   *
	updates:    *
	}           *
 **************/


mongoose.Promise = global.Promise

const companySchema = new Schema({
  "logo"        : String,
  "name"        : String,
  "description" : String,
  "website"     : String,
  "social"      : [Schema.Types.Object],
  "metrics"     : [Schema.Types.Object],
  "owner_id"    : { type: Schema.ObjectId, ref: "users" },
  "pitch"       : String,
  "location"    : { type: Schema.ObjectId, ref: "tags" },
  "markets"     : [
    {type: Schema.ObjectId, ref: "tags" }
  ]

});
// methods ======================


const companies = mongoose.model('companies', companySchema);
export default companies;
