import config from '../config.json'
import Pusher from '../lib/PusherSingleton'
import { Router } from 'express';


let pusher = new Pusher(config.pusherIDS)

export default (req,res,next) => {
  pusher.trigger('my-channel', 'my-event', {
    "message": "hello world"
  });
  next();
}
