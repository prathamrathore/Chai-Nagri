const server = require("../app");
const supertest = require("supertest");
const process = require('process');
const { log } = require("console");
const mongoose = require("mongoose");

 
beforeEach(() => {
    // timeout of 1 min added so that jest don't exits before DB connection get established
    jest.setTimeout(60000);
  });
   
  afterAll(() => {
    mongoose.connection.close();
    server.close();
  });
   
  describe("SERVER REACHABILITY TEST", () => {
    test("GET /", (done) => {
      supertest(app)
        .get("/")
        .send()
        .expect(200)
        .then((res) => {
          done();
        })
        .catch(done);
    });
   
    // test("GET /wrongendpoint", (done) => {
    //   supertest(app)
    //     .get("/wrongendpoint")
    //     .send()
    //     .expect(404)
    //     .then((res) => {
    //       done();
    //     })
    //     .catch(done);
    // });
   
    // test("GET /api/user/get-users", (done) => {
    //   supertest(app)
    //     .get("/api/user/get-users")
    //     .send()
    //     .expect(200)
    //     .then((res) => {
    //       expect(res.body).toHaveLength(1);
    //       done();
    //     })
    //     .catch(done);
    // });
  });