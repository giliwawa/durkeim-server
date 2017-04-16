import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

let should = chai.should();
let db = mongoose.connection;
let User = db.model('users');
let token = '';
let user_id

chai.use(chaiHttp);

describe('api tests', ()=>{
  describe('should pass all user api methods', () => {

    before((done) => {
      User.deleteMany({},(err) => {
        if(err) {
          done(err);
        }
        else{
          let user = new User({
          	email:'alaa.ksontini@jawhra.fr',
          	first_name:'validation',
          	last_name:'test',
          	password : bcrypt.hashSync('Atralal289', bcrypt.genSaltSync(8), null)
          });
          user.save((err) => {
            if(err) done(err);
            else {
              user_id = user._id;
              done();
            }
          });
        }

      });

    })

    it('should not add user',(done)=>{
      let user = new User({
        email: 'alaa.ksontini@gmail.com',
        first_name: 'alaa',
        last_name: 'ksontini'
      });
      chai.request(app)
      .post('/api/users')
      .send(user)
      .end((err,res)=>{
        res.should.have.status(400);
        done();
      })
    });

    it('returning a list of users should be authenticated', (done)=>{

      chai.request(app)
      .get('/api/users')
      .end((err, res)=>{
        res.should.have.status(401);
        done();
      })
    });

    it('should return a token', (done) => {

      let login = {
      	"email":"alaa.ksontini@jawhra.fr",
      	"password" : "Atralal289"
      };
      chai.request(app)
      .post('/api/auth/login')
      .send(login)
      .end((err, res) => {
        if(err) done(err);
        else {
          res.body.should.have.property('token');
          token = res.body.token;
          done();
        }

      })

    });

    it('should get a list of users', (done) => {

      chai.request(app)
      .get('/api/users')
      .set('x-access-token', token)
      .end((err, res) => {
        if(err) done(err);
        else {
          //res.should.have.status(200);
          res.body.should.be.a('Array');
          done();
        }
      })
    });

    it('should get a list of users', (done) => {
      
      chai.request(app)
      .get('/api/users/'+user_id)
      .set('x-access-token', token)
      .end((err, res) => {
        if(err) done(err);
        else {
          res.should.have.status(200);
          res.body.should.have.property('email');
          res.body.should.have.property('first_name');
          res.body.should.have.property('last_name');
          res.body.should.have.property('password');
          done();
        }
      })
    });



  })
})
