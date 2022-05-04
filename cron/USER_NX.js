const moment = require('moment');

const UserModel = require('../graphql/users/user.model');

const EmailUtilities = require('../utils/emails/index');

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
          if (today.format('DD/MM') !== birth_date_today.format('DD/MM') || !each_user.email) {
            return;
          }
          let mailOptions = Object.assign({}, EmailUtilities.mailOptions);

          mailOptions.to = each_user.email;
          mailOptions.subject = `Happy birhth day ${each_user.first_name ? each_user.first_name : ''} ${
            each_user.last_name ? each_user.last_name : ''
          }`;
          mailOptions.text = `Happy birhth day ${each_user.first_name ? each_user.first_name : ''} ${
            each_user.last_name ? each_user.last_name : ''
          }`;

          EmailUtilities.sendEmail(mailOptions);

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

    let mailOptions = Object.assign({}, EmailUtilities.mailOptions);

    mailOptions.to = 'mubarok.ibrahim18@gmail.com';
    mailOptions.subject = 'TOKPED GRAPHQL REMINDER';
    mailOptions.text = `HI IBE, DON'T FORGET TO CONTINUE TOKPED MINI PROJECT`;

    EmailUtilities.sendEmail(mailOptions);

    console.log('IBE REMINDER END');
    resolve('IBE REMINDER END');
  });
}

module.exports = { BIRTHDAY_GREETING, IBE_REMINDER };
