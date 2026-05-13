import axios from "axios";

let cachedToken = null;
let expiryTime = null;

export const getZohoAccessToken = async (forceRefresh = false) => {
  try {
    if (
      !forceRefresh &&
      cachedToken &&
      expiryTime &&
      Date.now() < expiryTime
    ) {
      return cachedToken;
    }

    const res = await axios.post(
      "https://accounts.zoho.in/oauth/v2/token",
      null,
      {
        params: {
          refresh_token: process.env.ZOHO_REFRESH_TOKEN,
          client_id: process.env.ZOHO_CLIENT_ID,
          client_secret: process.env.ZOHO_CLIENT_SECRET,
          grant_type: "refresh_token",
        },
      }
    );

    cachedToken = res.data.access_token;

    const expiresIn = Number(res.data.expires_in) || 3600;
    expiryTime = Date.now() + (expiresIn - 120) * 1000;

    return cachedToken;

  } catch (err) {
    cachedToken = null;
    expiryTime = null;
    throw new Error("Zoho token failed");
  }
};