const express = require("express");
const {
    getGoogleAuthURL,
    getGoogleUser,
    getGoogleUserTokens,
    refreshToken,
} = require("../services/google.service");

const { client_id_google, client_secret_google, port } = require('../../config.json');

var redirect_uri = `http://localhost:8082/api/google/callback`;

const router = express.Router();

router.get("/login", (req, res) => {
    const googleOAuthUrl = getGoogleAuthURL();
    res.status(301).redirect(googleOAuthUrl);
});
  
// Google Web App callback /oauth/google
router.get("/callback", async (req, res, next) => {
    const code = req.query.code;
    const userTokens = await getGoogleUserTokens({
        // get google user tokens
        code,
        client_id: client_id_google,
        client_secret: client_secret_google,
        redirect_uri: `${redirect_uri}`,
    });
    if (userTokens.error) return res.status(500).json(errorObj(userTokens));
  
    const userInfo = await getGoogleUser({
        // get google user info
        id_token: userTokens.id_token,
        access_token: userTokens.access_token,
    });
    if (userInfo.error) return res.status(500).json(errorObj(userInfo));
  
    res.render("success", {
        provider: "Google",
        access_token: userTokens.access_token,
        refresh_token: userTokens.refresh_token,
        username: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
        error: null
    });
});

module.exports = router;