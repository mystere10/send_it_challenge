
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';


const should = chai.should();

describe('/GET parcels ', () => {
  it('it should return an order with a given id', (done) => {
    const id = '1';
    chai.request(app).get(`/api/v1/parcels/${id}`).end((error, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      done();
    });
  });
  it('it should return all orders created ', (done) => {
    chai.request(app).get('/api/v1/parcels').end((error, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      done();
    });
  });

  it('it should return orders by a user id', (done) => {
    const id = '1';
    chai.request(app).get(`/api/v1/users/${id}/parcels`).end((error, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      done();
    });
  });
});
