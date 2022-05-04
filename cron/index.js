const CronJob = require('cron').CronJob;

const exceptionDateList = require('../utils/exceptionDatesCron').dates;

const cronEnabled = process.env.ENABLE_CRON;
const timeZone = process.env.CRON_TIME_ZONE;
const runImmediately = false;

// Require functions from different file here.
// Note that each of this function should return a promise in order to be use here.
// Also each of this job should have first parameters as options.

const { BIRTHDAY_GREETING, IBE_REMINDER, TEST_MIDTRANS } = require('./USER_NX');

// schedule cron time for each day here.
// json values:
// {
//   when: ''         // description for when the cron job should run. describing the cron time.
//   CRON_TIME: '',   // valid cron time format
//   JOBS_TO_RUN: [{  // array of jobs to be executed.
//     func: func,    // Actual function to execute. Refer below template
//     params: '',    // Parameters to pass if any.
//     blocked: false,// Set to true if want to block this notification.
//   }],
// }

let schedules = [
  {
    when: 'Every day 00.00 am.',
    CRON_TIME: '0 0 * * *',
    JOBS_TO_RUN: [{ func: BIRTHDAY_GREETING, params: {} }],
  },
  {
    when: 'Every day 05.00 am.',
    CRON_TIME: '0 05 * * *',
    JOBS_TO_RUN: [{ func: IBE_REMINDER, params: {} }],
  },
  {
    when: 'Every day 00.00 am.',
    CRON_TIME: '0 12 * * *',
    JOBS_TO_RUN: [{ func: TEST_MIDTRANS, params: {} }],
  },
];

async function start() {
  if (cronEnabled === 'true') {
    console.log('Cron Job Enabled');

    for (const schedule of schedules) {
      new CronJob(
        schedule.CRON_TIME,
        async () => {
          let todayStart = new Date();
          // get date in format of '2019-12-25'
          let date = todayStart.toISOString().split('T')[0];

          if (todayStart.getDay() === 6 || todayStart.getDay() === 0 || exceptionDateList.indexOf(date) > -1) {
            // do not send notifications on saturday, sunday or holiday.
            console.log('Today is holiday in france so no need to send notifications');
          } else {
            // loop over each jobs that needs to be run at scheduled time.
            for (const job of schedule.JOBS_TO_RUN) {
              let { func, params = {}, blocked = false } = job;

              // execute the job.
              try {
                // execute function only if not blocked.
                if (!blocked) {
                  await func(params);
                }
              } catch (e) {
                console.error(e);
              }
            } // end of loop over schedule.JOBS_TO_RUN
          }
        },
        null,
        true, // "start" - if set to false, then need to execute job.start()- refer to https://www.npmjs.com/package/cron#api
        timeZone,
        null,
        runImmediately // run cron jobs immediately.
      );
    }
  } else {
    // log a message if cron job are disabled.
    console.log('Not running cron jobs. To enable, set ENABLE_CRON env variable to "true".');
  }
}

async function trigger(cronName) {
  try {
    let cron = await eval(cronName)({});
    return cron;
  } catch (err) {
    return err;
  }
}

module.exports = {
  start,
  trigger,
};
