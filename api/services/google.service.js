const axios = require("axios");
const querystring = require("querystring");
require('dotenv').config()

const client_id = process.env.CLIENT_ID,
      client_secret = process.env.CLIENT_SECRET

var redirect_uri = `https://evening-inlet-22984.herokuapp.com/api/google/callback`;

const getGoogleAuthURL = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: `${redirect_uri}`,
    client_id: client_id,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://mail.google.com/",
    ].join(" "),
  };

  return `${rootUrl}?${querystring.stringify(options)}`;
};

const getGoogleUserTokens = async ({
  code,
  redirect_uri,
}) => {
  const url = "https://accounts.google.com/o/oauth2/token";
  const values = {
    code,
    client_id,
    client_secret,
    redirect_uri,
    grant_type: "authorization_code",
  };
  try {
    const { data } = await axios.post(url, querystring.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return data;
  } catch (error) {
    return { error, error_message: `Failed to fetch Google auth tokens` };
  }
};

// Fetch the user's profile with the access token and bearer
const getGoogleUser = async ({ access_token, id_token }) => {
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return data;
  } catch (error) {
    return { error, error_message: `Failed to fetch Google user` };
  }
};

const refreshToken = async ({
  refresh_token,
}) => {
  const url = "https://accounts.google.com/o/oauth2/token";
  const values = {
    client_id,
    client_secret,
    refresh_token,
    grant_type: "refresh_token",
  };
  try {
    const { data } = await axios.post(url, querystring.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return data;
  } catch (error) {
    return { error, error_message: `Failed to fetch Google access token` };
  }
};

module.exports = { getGoogleAuthURL, getGoogleUserTokens, getGoogleUser, refreshToken };
