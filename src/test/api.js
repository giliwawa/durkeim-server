import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

let should = chai.should();
let db = mongoose.connection;
let Company = db.model('companies');
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
            user_info:{
              email: 'alaa.ksontini@gmail.com',
              first_name: 'alaa',
              last_name: 'ksontini'
            },
          	password : bcrypt.hashSync('Azerty123', bcrypt.genSaltSync(8), null)
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
        user_info:{
          email: 'alaa.ksontini@gmail.com',
          first_name: 'alaa',
          last_name: 'ksontini'
        }
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
      	"email":"alaa.ksontini@gmail.com",
      	"password" : "Azerty123"
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
      console.log(`user: ${user_id}`)
      console.log(`token: ${token}`)
      chai.request(app)
      .get('/api/users/'+user_id)
      .set('x-access-token', token)
      .end((err, res) => {
        if(err) done(err);
        else {
          res.should.have.status(200);
          res.body.should.have.property('user_info');
          // res.body.should.have.property('first_name');
          // res.body.should.have.property('last_name');
          res.body.should.have.property('password');
          done();
        }
      })
    });



  })

  describe('Company api endpoint Tests begin', () => {
    before((done) => {
      Company.deleteMany({},(err) => {
        if(err) {
          done(err);
        }
        else{
          // TODO: Add a company for tests
          done();
        }
      });
    });

    it('should add a company', done => {

      const body = {
        "logo"        : "https://d1ts43dypk8bqh.cloudfront.net/v1/avatars/247193a9-33a1-4cc8-a997-9af62dd8da61",
        "name"        : "Slack",
        "description" : "Chat and do less work because fuck you, that's why",
        "website"     : "https://slack.thefuck.com",
        "pitch"       : "String",
        "owner_id"    : user_id
      };

      chai.request(app)
      .post('/api/companies')
      .set('x-access-token', token)
      .send(body)
      .end((err, res) => {
        if(err){
          console.log(res);
          done(err);
        }
        else {
          res.should.have.status(201)
          done();
        }
      })
    });

    it('should add a signal', done => {

      const body = {
        "title"       : "Looking for advice about butter spreading",
        "body"        : "butter spreading is realy hard nowadays can someone give me the in and outs of this industry",
        "owner_id"    : user_id
      };

      chai.request(app)
      .post('/api/signals')
      .set('x-access-token', token)
      .send(body)
      .end((err, res) => {
        if(err){
          console.log(res);
          done(err);
        }
        else {
          res.should.have.status(201)
          done();
        }
      })
    })

    it('should add a tag', done => {

      const body = {
        "title"       : "Looking for advice about butter spreading",
        "body"        : "butter spreading is realy hard nowadays can someone give me the in and outs of this industry",
        "owner_id"    : user_id
      };

      chai.request(app)
      .post('/api/signals')
      .set('x-access-token', token)
      .send(body)
      .end((err, res) => {
        if(err){
          console.log(res);
          done(err);
        }
        else {
          res.should.have.status(201)
          done();
        }
      })
    })


  })
})
