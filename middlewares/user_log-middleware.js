const UserLogModel = require('../graphql/userLogs/user_log.model');

const { getUserId } = require('../utils/common');

const userLog = async function (req, res, next) {
  if (req.body.operationName === 'IntrospectionQuery') {
    return next();
  }

  const userLogData = { url: req.url };

  if (Object.keys(req.body).length < 1) {
    await UserLogModel.create(userLogData);

    return next();
  }

  userLogData.query_or_mutation = req.body.query;
  userLogData.variable = JSON.stringify(req.body.variables);

  let Authorization = req.get('Authorization');

  if (Authorization) {
    let token = Authorization.replace('Bearer ', '');

    token = token.replace(/"/g, '');

    try {
      let userId = getUserId(token);
      userLogData.user_id = userId;
    } catch (e) {}
  }

  await UserLogModel.create(userLogData);

  return next();
};

module.exports = userLog;
