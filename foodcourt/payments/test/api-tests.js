'use strict';
const supertest = require('supertest');
const chai = require('chai');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const it = require('mocha').it;

const {server,shutdown} = require('../index');

describe('API Tests: ', () => {
    after(function () {
        shutdown();
    });
    it('Can access POST item /', function(done){
        const data = {service: "iowafried", item: 'burger', amount: 3.25};
        supertest(server)
            .post('/')
            .set('Accept', 'application/json')
            .send(data)
            .then((res) => {
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.equal('PAID');
                console.log(res.body);
                done();
            })
            .catch(done);
    });
});