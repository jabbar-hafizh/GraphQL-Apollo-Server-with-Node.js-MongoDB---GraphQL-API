const moment = require('moment');
const nodemailer = require('nodemailer');

const UserModel = require('../graphql/users/user.model');

async function BIRTHDAY_GREETING() {
  try {
    return new Promise(async (resolve) => {
      const today = moment.utc();
      let counter = 0;
      const aggregateQuery = [
        {
          $match: {
            status: 'active',
            birth_date: { $exists: true, $ne: null },
          },
        },
      ];

      const users = await UserModel.aggregate(aggregateQuery);

      if (users && users.length) {
        users.forEach((each_user) => {
          if (!each_user.birth_date) {
            return;
          }
          const birth_date_today = moment.utc(each_user.birth_date, 'DD/MM/YYYY');
          if (today.format('DD/MM') !== birth_date_today.format('DD/MM')) {
            return;
          }
          console.log(`Happy birhth day ${each_user.first_name} ${each_user.last_name}`);
          counter += 1;
        });

        console.log(`Cron counters: ${counter}`);
        resolve(`Cron counters: ${counter}`);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function IBE_REMINDER() {
  return new Promise(async (resolve) => {
    console.log('IBE REMINDER STARTS');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: 'mubarok.ibrahim18@gmail.com',
      subject: 'TOKPED GRAPHQL REMINDER',
      text: `HI IBE, DON'T FORGET TO CONTINUE TOKPED MINI PROJECT`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    console.log('IBE REMINDER END');
    resolve('IBE REMINDER END');
  });
}

module.exports = { BIRTHDAY_GREETING, IBE_REMINDER };
