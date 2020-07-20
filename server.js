const { createOrLoginUser } = require('./rocketchat');

const express = require('express');
const app = express();

// init middleware
app.use(express.json({ extended: false }));

app.post('/login', async (req, res) => {
  // ....CODE TO LOGIN USER

  // Creating or login user into Rocket chat
  try {
    const response = await createOrLoginUser(
      user.username,
      user.firstName,
      user.email,
      user.password
    );
    req.session.user = user;
    // Saving the rocket.chat auth token and userId in the database
    user.rocketchatAuthToken = response.data.authToken;
    user.rocketchatUserId = response.data.userId;
    await user.save();
    res.send({ message: 'Login Successful' });
  } catch (ex) {
    console.log('Rocket.chat login failed');
  }
});

// This method will be called by Rocket.chat to fetch the login token
app.get('/rocket_chat_auth_get', (req, res) => {
  if (req.session.user && req.session.user.rocketchatAuthToken) {
    res.send({ loginToken: ctx.session.user.rocketchatAuthToken });
    return;
  } else {
    res.status(401).json({ message: 'User not logged in' });
    return;
  }
});

// This method will be called by Rocket.chat to fetch the login token
// and is used as a fallback
app.get('/rocket_chat_iframe', (req, res) => {
  const rocketChatServer = 'https://chat.telkomuniversity.ac.id:3000';
  if (req.session.user && req.session.user.rocketchatAuthToken) {
    // We are sending a script tag to the front-end with the RocketChat Auth Token that will be used to authenticate the user
    return res.send(`<script>
      window.parent.postMessage({
        event: 'login-with-token',
        loginToken: '${req.session.user.rocketchatAuthToken}'
      }, '${rocketChatServer}');
    </script>
    `);
    return;
  } else {
    return res.status(401).send('User not logged in');
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
