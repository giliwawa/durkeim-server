import mongoose from 'mongoose';
import map from 'async/map'


const Tag = mongoose.model('tags');

export function saveNewTagsFromSignal(tags){
  return new Promise((resolve, reject) => {
    map(tags,(tag,cb) => {
      if(tag._id == -1){
        const {value} = tag
        let _tag = new Tag({value});
        _tag.save(err => {
          cb(err,_tag._id)
        })
      }else cb(null, tag._id)

    }, (err, result) => {
      if(err){
        reject(err);
        return;
      }
      resolve(result)
    })
  })
}
