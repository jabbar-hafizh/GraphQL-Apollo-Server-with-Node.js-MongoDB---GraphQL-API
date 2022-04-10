const { UserLoader } = require('../graphql/users/user.loader');

module.exports = {
  loaders: () => {
    return {
      UserLoader: UserLoader(),
    };
  },
};
