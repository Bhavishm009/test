const asyncHandler = require("../helpers/catch-async")
const resp = require('../helpers/response');
const con = require('../constants/index');
const commonServices = require('../services/common');
const nodemailer = require("nodemailer");


const tables = {
  users: "users",
  wb: "website_visits"
}

const account = {

  addVisits: asyncHandler(async (req, res) => {
    const body = req.body;

    const company_id = body.company_id || null;
    const page_visited = body.page_visited || null;
    const visitor_ip = req.socket._peername.address.replace(/^.*:/, '');

    console.log(visitor_ip)

    const data = {
      company_id,
      visitor_ip,
      page_visited
    }

    const visit = await commonServices.dynamicInsert(req, tables.wb, data);
    
    return resp.cResponse(req, res, resp.SUCCESS, con.account.CREATED, { visitId: visit.insertId })

  }),

  login: asyncHandler(async (req, res) => {
    const body = req.body;
    let loginResults = await commonServices.readSingleData(req, tables.users, '*', { 'mobile_no': body.phone_number, });
    if (loginResults.length == 0) {
      return resp.cResponse(req, res, resp.FORBIDDEN_ERROR, con.account.NO_ACCOUNT);
    }
    return resp.cResponse(req, res, resp.SUCCESS, con.account.CREATED, { loginResults })
  }),

  sendMail: asyncHandler(async (req, res) => {
    const body = req.body;
    const from = body.from ? body.from : null;
    const to = body.to ? body.to : null;
    const subject = body.subject ? body.subject : null;
    const description = body.description ? body.description : null;
    const html = body.html ? body.html : null;
    const user = body.user ? body.user : null;
    const password = body.password ? body.password : null;

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