// MUTATION
const TriggerCronJobManual = async (parent, { cron_job_name }) => {
  const cron = require('../../cron');
  let job = await cron.trigger(cron_job_name.trim());
  return job;
};

module.exports = {
  Mutation: {
    TriggerCronJobManual,
  },
};
