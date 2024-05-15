const path = require('path');
const fs = require('fs');
const { checkUserID, loginQuery } = require('../model/authentication.model');

function Login(req, res)
{
      const email = req.body.params.email;
      const password = req.body.params.password;

      loginQuery(email, password, (result, role, err) =>
      {
            if (err)
            {
                  console.log(err);
                  res.status(500);
            }
            else
            {
                  if (!result.length)
                        res.status(401).send({ message: 'User not found!' });
                  else
                  {
                        req.session.userID = result[0].ID;
                        req.session.save(() =>
                        {
                              // Session saved
                              res.status(200).send({ userRole: role });
                        });
                  }
            }
      });
}

function IsLoggedIn(req, res)
{
      if (!req.session || !req.session.userID)
            res.status(400).send({ message: "Session cookie not present!" });
      else
      {
            checkUserID(req.session.userID, (result, role, err) =>
            {
                  if (err)
                  {
                        console.log(err);
                        res.status(500);
                  }
                  else
                  {
                        if (!result.length)
                              res.status(401).send({ message: 'Not logged in!' });
                        else
                              res.status(200).send({ userRole: role });
                  }
            });
      }
}

function Logout(req, res)
{
      if (!req.session || !req.session.userID)
            res.status(400).send({ message: "Session cookie not present!" });
      else
      {
            // Specify the session file directory
            const sessionDir = path.join(__dirname, '..', "data", "session");

            // Define the session ID or session file name for which you want to delete its additional files
            const sessionID = req.sessionID;

            // Regular expression pattern for matching the additional session files
            const additionalFilesPattern = new RegExp(
                  `^${ sessionID }.json.\\d+$`
            );
            req.session.destroy((err) =>
            {
                  if (!err)
                  {
                        res.clearCookie("connect.sid");
                        res.status(200).send({ message: "Logged out successfully!" });

                        // Get a list of files in the session directory
                        fs.readdir(sessionDir, (err, files) =>
                        {
                              if (err)
                              {
                                    console.error("Error reading session directory:", err);
                                    return;
                              }

                              // Filter the list to include only the additional session files for the specified session
                              const additionalFiles = files.filter((file) =>
                                    additionalFilesPattern.test(file)
                              );

                              // Delete each additional session file
                              additionalFiles.forEach((file) =>
                              {
                                    const filePath = `${ sessionDir }/${ file }`;
                                    fs.unlink(filePath, (err) =>
                                    {
                                          if (err)
                                          {
                                                console.error(
                                                      "Error deleting additional session file:",
                                                      filePath,
                                                      err
                                                );
                                          } else
                                          {
                                                console.log("Additional session file deleted:", filePath);
                                          }
                                    });
                              });
                        });
                  }
            });
      }
}

module.exports = { Login, Logout, IsLoggedIn }