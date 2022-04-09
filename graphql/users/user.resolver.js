const users = [];

// QUERY
async function GetAllUsers(parent) {
  return users;
}

async function GetOneUser(parent, { last_name }) {
  return users.find((user) => user.last_name === last_name);
}

// MUTATION
async function AddUser(parent, { user_input }) {
  if (users.length) {
    const userExist = users.some((user) => user.last_name === user_input.last_name);
    if (userExist) {
      throw new Error(`user with last name ${user_input.last_name} already exist`);
    }
  }
  users.push(user_input);
  return user_input;
}

async function UpdateUser(parent, { id, user_input }) {
  let userExist;
  if (users.length) {
    userExist = users.find((user) => String(user.id) === String(id));
    if (userExist) {
      const userIndex = users.findIndex((user) => String(user.id) === String(id));
      users.splice(userIndex, 1);
      users.push({ ...userExist, ...user_input });
    }
  }
  return users[users.length - 1];
}

async function DeleteUser(parent, { id }) {
  let userDeleted;
  if (users.length) {
    userDeleted = users.find((user) => String(user.id) === String(id));
    if (userDeleted) {
      const userIndex = users.findIndex((user) => String(user.id) === String(id));
      users.splice(userIndex, 1);
    }
  }
  return userDeleted;
}

module.exports = {
  Query: {
    GetAllUsers,
    GetOneUser,
  },
  Mutation: {
    AddUser,
    UpdateUser,
    DeleteUser,
  },
};
