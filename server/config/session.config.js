const FileStoreFactory = require('session-file-store');
const session = require('express-session');
const path = require('path');

const FileStore = FileStoreFactory(session);

const sessionConfig = {
      store: new FileStore({
            path: path.join(__dirname, '..', 'data', 'session'),
      }),
      secret: 'SSPS', // It is used to sign the session ID cookie. This is typically a secret passphrase that is known only to the server. It is used to prevent tampering with the cookie

      resave: false,
      /*
      Purpose: Forces the session to be saved back to the session store, even if the session was not modified during the request.
      Explanation: The session store is a place where session data is stored (e.g., in-memory, database). If resave is set to false, the session will only be saved if changes are made to the session data during the request.
      */

      saveUninitialized: false,
      /*
      Purpose: Forces a session that is "uninitialized" to be saved to the store.
      Explanation: A session is uninitialized when it is new but not modified during the request. If saveUninitialized is set to false, sessions that are not modified (new, but not saved) will not be stored.
      */

      cookie: {
            secure: false, // Ensures that the session cookie is only sent over HTTPS connections
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            maxAge: 3600000 * 24 * 3, // Sessions will persist for 3 days
      }
};

module.exports = sessionConfig;