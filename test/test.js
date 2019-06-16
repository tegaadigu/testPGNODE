const chai = require('chai')
const chaiHttp = require('chai-http');
const portfinder = require('portfinder');
const uniqueId = require('lodash/uniqueId');

chai.should();

chai.use(chaiHttp);

const { cleanUp } = require('../database/');


describe('API TEST', () => {
  let app = null;
  let email = uniqueId('axiom');
  let token = '';
  before(async function() {
    //set new port since app is runing in default port already.
    process.env.DEFAULT_HTTP_PORT = await portfinder.getPortPromise({port: 10002});
    app = require('../server');
  });
    it('Sign up with incomplete field (no Last Name)', (done) => {
      chai.request(app)
        .post('/signup')
        .send({
          "email": `${email}@axiomzen.co`,
          "password": "axiomzen",
          "firstName": "Alex",
        })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(422);
        done()
      })
    });
    it('Sign up with complete field and return token', (done) => {
      chai.request(app)
        .post('/signup')
        .send({
          "email": `${email}@axiomzen.co`,
          "password": "axiomzen",
          "firstName": "Alex",
          "lastName": "Zimmerman"
        })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200);
        res.body.should.have.a.property('token').to.not.equal('');
        done()
      })
    });
    it('login with newly created user credentials and get login token', (done) => {
      chai.request(app)
        .post('/login')
        .send({
          "email": `${email}@axiomzen.co`,
          "password": "axiomzen",
        })
        .end((err, res) => {
          if (err) { console.error(err) }
          res.should.have.status(200);
          res.body.should.have.a.property('token').to.not.equal('');
          token = res.body.token;
          done()
        })
    });
    it('login with newly created user credentials without a password field', (done) => {
      chai.request(app)
        .post('/login')
        .send({
          "email": `${email}@axiomzen.co`,
        })
        .end((err, res) => {
          if (err) { console.error(err) }
          res.should.have.status(422);
          done()
        })
    });
    it('should retrieve all users based on derived login token', (done) => {
      chai.request(app)
        .get('/users')
        .set('access-token', token)
        .end((err, res) => {
          if (err) { console.error(err) }
          res.should.have.status(200);
          res.body.should.have.a.property('users').to.be.an('array').with.length.greaterThan(0);
          done()
        })
    });
  it('should retrieve all users based on fake login token', (done) => {
    chai.request(app)
      .get('/users')
      .set('access-token', 'testing token')
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(422);
        res.body.should.have.a.property('message').to.be.a('string').to.be.equal("Invalid token");
        done()
      })
  });

    it('should update user detail with derived login token', (done) => {
      chai.request(app)
        .put('/users')
        .set('access-token', token)
        .send({
          "firstName": 'Mark',
          "lastName": 'Jones',
        })
        .end((err, res) => {
          if (err) { console.error(err) }
          res.should.have.status(200);
          res.body.should.have.a.property('message').to.be.a('string').to.be.equal("Successfully updated");
          done()
        })
    });

    it('should update user detail with invalid login token', (done) => {
      chai.request(app)
        .put('/users')
        .set('access-token', 'faketoken-fake')
        .send({
          "firstName": 'Mark',
          "lastName": 'Jones',
        })
        .end((err, res) => {
          if (err) { console.error(err) }
          res.should.have.status(422);
          done()
        })
    });
    after(async () => {
      await cleanUp();
    })
});
