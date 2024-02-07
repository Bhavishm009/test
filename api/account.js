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
    console.log(body);
    const userData = {
      name: body.name,
      last_name: body.last_name,
      mobile_no: body.mobile_no,
    }
    let user = await commonServices.dynamicInsert(req, tables.users, userData);

    return resp.cResponse(req, res, resp.SUCCESS, con.account.CREATED, { user_id: user.insertId})
  }),
  users: asyncHandler(async (req, res) => {
    const body = req.body;
    console.log(body);
    return resp.cResponse(req, res, resp.SUCCESS, con.account.RECORD_SUCCESS, dummyUsers);
  })
}

module.exports = account;