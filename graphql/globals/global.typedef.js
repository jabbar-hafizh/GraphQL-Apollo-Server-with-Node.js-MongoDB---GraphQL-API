const { gql } = require('apollo-server-express');

const globalTypeDef = gql`
  extend type Mutation {
    TriggerCronJobManual(cron_job_name: String!): String
  }
`;

module.exports = globalTypeDef;
