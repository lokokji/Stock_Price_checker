const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);
const { expect } = chai;

describe('Stock Price Checker', () => {
  it('Viewing one stock: GET request to /api/stock-prices/', (done) => {
    chai
      .request(server)
      .get('/api/stock-prices?stock=GOOG')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.stockData).to.have.property('stock', 'GOOG');
        expect(res.body.stockData).to.have.property('price');
        done();
      });
  });

  it('Viewing one stock and liking it: GET request to /api/stock-prices/', (done) => {
    chai
      .request(server)
      .get('/api/stock-prices?stock=GOOG&like=true')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.stockData).to.have.property('likes', 1);
        done();
      });
  });

  it('Viewing the same stock and liking it again: GET request to /api/stock-prices/', (done) => {
    chai
      .request(server)
      .get('/api/stock-prices?stock=GOOG&like=true')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.stockData).to.have.property('likes', 1); // Should not increment
        done();
      });
  });

  it('Viewing two stocks: GET request to /api/stock-prices/', (done) => {
    chai
      .request(server)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.stockData).to.be.an('array').with.lengthOf(2);
        done();
      });
  });

  it('Viewing two stocks and liking them: GET request to /api/stock-prices/', (done) => {
    chai
      .request(server)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.stockData[0]).to.have.property('rel_likes');
        expect(res.body.stockData[1]).to.have.property('rel_likes');
        done();
      });
  });
});