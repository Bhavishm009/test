const asyncHandler = require("../helpers/catch-async")
const resp = require('../helpers/response');
const con = require('../constants/index');
const commonServices = require('../services/common');
const nodemailer = require("nodemailer");
const moment = require('moment');

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
        const user_agent = req.headers['user-agent'];

        const isVisited = await commonServices.readSingleData(req, tables.wb, '*', { user_agent: user_agent, page_visited: page_visited, company_id: company_id });
        console.log(isVisited)
        const data = {
            company_id,
            visitor_ip,
            page_visited,
            user_agent,
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
    }),
    sendMailSheerji: asyncHandler(async (req, res) => {
        console.log(req.body)
        const body = req.body;

        const name = body.name;
        const email = body.email;
        const message = body.message;
        const mobile = body.number;

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "harikrushnamultimedia@gmail.com",
                pass: "mvdzyawjmysmtbtc",
            },
        });
        let info = {
            from: '"harikrushnamultimedia@gmail.com"',
            to: email,
            subject: ` Hello,Mr/Mrs : ${name}, /n Your Chat App Verification Code`,
            text: `Hello,Mr/Mrs : ${name}, We Are Happy Have You On Board 👌😀`,
            html: `
            <body style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
                <div style="background-color: #ffffff; max-width: 600px; margin: auto; border-radius: 10px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    <h1 style="color: #333;">Email Verification</h1>
                    <p style="color: #555; font-size: 16px;">Dear ${name},</p>
                    <p style="color: #555; font-size: 16px;">Thank you for registering with our platform. To get started, please click the link below to verify your email address:</p>
                    <p style="color: #555; font-size: 16px; margin-top: 20px;">If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
                    <p style="color: #555; font-size: 16px;">Thank you for using our platform!</p>
                </div>
            </body>`,
        };

        let info2 = {
            from: email,
            to: 'harikrushnamultimedia@gmail.com',
            subject: ` Hello, Shreeji - Graphics, /n You Have Got New Contact Us Request.`,
            text: `From: ${name},`,
            html: `
            <body style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
                <div style="background-color: #ffffff; max-width: 600px; margin: auto; border-radius: 10px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    <h1 style="color: #333;">Message</h1>
                    <p style="color: #555; font-size: 16px;">${message}</p>
                    <p style="color: #555; font-size: 16px;">User Email : ${email}, /n User Contact No : ${mobile}</p>
                </div>
            </body>`,
        };
        transporter.sendMail(info2, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log("email send........")
            }
        })
        transporter.sendMail(info, (err) => {
            if (err) {
                return resp.cResponse(req, res, resp.SUCCESS, con.account.SOMETHING_WRONG, { Message: err });
            } else {
                return resp.cResponse(req, res, resp.SUCCESS, con.account.EMAIL_SUCCESS, { email: email });
            }
        });
    })

}

module.exports = account;