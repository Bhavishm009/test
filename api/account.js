const asyncHandler = require("../helpers/catch-async")
const resp = require('../helpers/response');
const con = require('../constants/index');
const commonServices = require('../services/common');
const nodemailer = require("nodemailer");


const tables = {
  users: "users"
}

const account = {
  login: asyncHandler(async (req, res) => {
    const body = req.body;
    let loginResults = await commonServices.readSingleData(req, tables.users, '*', { 'mobile_no': body.phone_number, });
    if (loginResults.length == 0) {
      return resp.cResponse(req, res, resp.FORBIDDEN_ERROR, con.account.NO_ACCOUNT);
    }
    return resp.cResponse(req, res, resp.SUCCESS, con.account.CREATED, { loginResults })
  }),
  users: asyncHandler(async (req, res) => {
    const body = req.body;
    const users = await commonServices.readAllData(req, tables.users, '*', {});
    return resp.cResponse(req, res, resp.SUCCESS, con.account.RECORD_SUCCESS, users);
  }),
  sendMail: asyncHandler(async (req, res) => {
    const body = req.body;
    const mailInfo = body.mail_info ? body.mail_info : null;
    const from = body.from ? body.from : null;
    const to = body.to ? body.to : null;
    const subject = body.subject ? body.subject : null;
    const description = body.description ? body.description : null;
    const html = body.html ? body.html : null;
    let user = '';
    let password = '';

    if (body.email_config) {
      user = body.email_config.user ? body.email_config.user : null;
      password = body.email_config.pass ? body.email_config.pass : null;
    }

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: user,
        pass: password,
      },
    });

    let info = {
      from: from,
      to: to,
      subject: subject,
      text: description,
      html: html,
    };

    transporter.sendMail(info, (err) => {
      if (err) {
        console.log(err);
      } else {
        return resp.cResponse(req, res, resp.SUCCESS, con.account.EMAIL_SUCCESS, { user_email: to });
      }
    });
  })
}

module.exports = account;