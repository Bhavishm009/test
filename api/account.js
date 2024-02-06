const asyncHandler = require("../helpers/catch-async")
const resp = require('../helpers/response');
const con = require('../constants/index');

const dummyUsers = [

  {
    id: 2,
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    age: 30,
  },
  {
    id: 3,
    username: 'bob_jackson',
    email: 'bob.jackson@example.com',
    age: 28,
  },
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
    age: 28,
  },

];

const account = {
  login: asyncHandler(async (req, res) => {
    const body = req.body;
    console.log(body);
    return res.json({
      message: "Hello"
    })
  }),
  users: asyncHandler(async (req, res) => {
    const body = req.body;
    console.log(body);
    return resp.cResponse(req, res, resp.SUCCESS, con.account.RECORD_SUCCESS, dummyUsers);
  })
}

module.exports = account;