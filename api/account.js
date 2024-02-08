const asyncHandler = require("../helpers/catch-async")
const resp = require('../helpers/response');
const con = require('../constants/index');
const commonServices = require('../services/common');
const dummyUsers = [
  {
    id: 4,
    username: 'Bob jackson',
    email: 'bob.jackson@example.com',
    age: 28,
  },
  {
    id: 5,
    username: 'Harshad Kajale',
    email: 'Harshad_Kajale@example.com',
    age: 28,
  },
  {
    id: 6,
    username: 'Harsh Jaiswal',
    email: 'Harsh@example.com',
    age: 28
  },

];

const tables = {
  users: "users"
}

const account = {
  login: asyncHandler(async (req, res) => {
    const body = req.body;
    let loginResults = await commonServices.readSingleData(req, tables.users, '*', {'mobile_no': body.mobile_no,});
     if (loginResults.length == 0) {
      return resp.cResponse(req, res, resp.FORBIDDEN_ERROR, con.account.NO_ACCOUNT);
    }
    return resp.cResponse(req, res, resp.SUCCESS, con.account.CREATED, { user_id: user.insertId })
  }),
  users: asyncHandler(async (req, res) => {
    const body = req.body;
    const users = await commonServices.readAllData(req, tables.users, '*', {});
    return resp.cResponse(req, res, resp.SUCCESS, con.account.RECORD_SUCCESS, users);
  }),
  sendMail: asyncHandler(async (req, res) => {
    const body = req.body;

  })
}

module.exports = account;