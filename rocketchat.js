// curl https://chat.telkomuniversity.ac.id:3000/api/v1/login -d "username=adminmlss&password=MLSSTelU2020"

// import request from 'request-promise-native';
const request = require('request-promise-native');

const rocketChatServer = 'https://chat.telkomuniversity.ac.id:3000';
const rocketChatAdminUserId = 'ZqGb8v3PhikndvbgJ';
const rocketChatAdminAuthToken = '59bDFy2m2dzVDmePDPRv5nBfepnpIIF966W0V3ICpT-';

const fetchUser = async (username) => {
  const rocketChatUser = await request({
    url: `${rocketChatServer}/api/v1/users.info`,
    method: 'GET',
    qs: {
      username: username,
    },
    headers: {
      'X-Auth-Token': rocketChatAdminAuthToken,
      'X-User-Id': rocketChatAdminUserId,
    },
  });
  return rocketChatUser;
};

const loginUser = async (email, password) => {
  const response = await request({
    url: `${rocketChatServer}/api/v1/login`,
    method: 'POST',
    json: {
      user: email,
      password: password,
    },
  });
  return response;
};

const createUser = async (username, name, email, password) => {
  const rocketChatUser = await request({
    url: `${rocketChatServer}/api/v1/users.create`,
    method: 'POST',
    json: {
      name,
      email,
      password,
      username,
      verified: true,
    },
    headers: {
      'X-Auth-Token': rocketChatAdminAuthToken,
      'X-User-Id': rocketChatAdminUserId,
    },
  });
  return rocketChatUser;
};

const createOrLoginUser = async (username, name, email, password) => {
  try {
    await fetchUser(username);
    // Perfom login
    return await loginUser(email, password);
  } catch (ex) {
    if (ex.statusCode === 400) {
      // User does not exist, creating user
      await createUser(username, name, email, password);
      // Perfom login
      return await loginUser(email, password);
    } else {
      throw ex;
    }
  }
};

module.exports = createOrLoginUser;
