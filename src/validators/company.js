// {
//   "logo"        : String,
//   "name"        : String,
//   "description" : String,
//   "website"     : String,
//   "social"      : [Schema.Types.Object],
//   "metrics"     : [Schema.Types.Object],
//   "owner_id"    : { type: Schema.ObjectId, ref: "users" },
//   "pitch"       : String,
//   "location"    : { type: Schema.ObjectId, ref: "tags" },
//   "markets"     : [
//     {type: Schema.ObjectId, ref: "tags" }
//   ]
//
// }

const entityValidator = {

  'logo': {
    notEmpty: true,
    // isURL:{
    //   protocols: ['http', 'https'],
    //   allow_underscores: true
    // }
  },
  'website':{
    notEmpty: true,
    // isURL: {
    //   protocols: ['http', 'https'],
    //   allow_underscores: true
    // }
  },
  'description':{
    notEmpty: true
  },
  'pitch':{
    notEmpty: true
  }

}


export default {
  entityValidator
}
