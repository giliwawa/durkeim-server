import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const commentSchema = new Schema (
  {
      user_id: ,
      body: {},
      upvotes: 5
      parent : null || comment_id
  }
)
