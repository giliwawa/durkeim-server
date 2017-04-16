import Pusher from 'pusher'

let instance = null

export default class PusherSingleton {
  constructor(config){
    if(!instance){
      instance = new Pusher(config);
    }
    this.time = Date.now()
    return instance
  }
}
