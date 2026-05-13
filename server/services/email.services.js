import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { getZohoAccessToken } from "../config/zohoAuth.js";
import path from "path";

let cachedAccountId = null;

// ===============================
// GET ACCOUNT ID (SAFE + CACHED)
// ===============================
const getAccountId = async (token) => {
  if (cachedAccountId) return cachedAccountId;

  const res = await axios.get(
    `${process.env.ZOHO_MAIL_BASE_URL}/api/accounts`,
    {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    }
  );

  const accounts = res.data?.data;

  if (!accounts || !accounts.length) {
    throw new Error("No Zoho Mail account found");
  }

  cachedAccountId = accounts[0].accountId;

  return cachedAccountId;
};

// ===============================
// UPLOAD ATTACHMENT
// ===============================
const uploadAttachment = async (
  token,
  accountId,
  filePath
) => {
  try {
    console.log("\n========== UPLOAD START ==========");

    const fileName = path.basename(filePath);

    console.log("FILE NAME:", fileName);

    const stats = fs.statSync(filePath);

    console.log("FILE SIZE:", stats.size);

    const fileBuffer = fs.readFileSync(filePath);

    console.log("BUFFER SIZE:", fileBuffer.length);

    const form = new FormData();

    form.append(
      "attach",
      fileBuffer,
      {
        filename: fileName,
        contentType: "application/pdf",
        knownLength: fileBuffer.length,
      }
    );

    const contentLength = await new Promise(
      (resolve, reject) => {
        form.getLength((err, length) => {
          if (err) reject(err);
          else resolve(length);
        });
      }
    );

    console.log("CONTENT LENGTH:", contentLength);

    const res = await axios.post(
      `${process.env.ZOHO_MAIL_BASE_URL}/api/accounts/${accountId}/messages/attachments?uploadType=multipart&fileName=${encodeURIComponent(fileName)}`,
      form,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          ...form.getHeaders(),
          "Content-Length": contentLength,
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );

    console.log(
      "UPLOAD RESPONSE:",
      JSON.stringify(res.data, null, 2)
    );

    const attachmentId =
      res.data?.data?.[0]?.attachmentPath;

    if (!attachmentId) {
      throw new Error("Attachment upload failed");
    }

    return res.data.data[0];
  } catch (err) {
    console.log(
      "UPLOAD ERROR:",
      JSON.stringify(err.response?.data, null, 2)
    );

    throw err;
  }
};

// ===============================
// OTP GENERATOR
// ===============================
export const generateOTP = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

// ===============================
// COMMON EMAIL STYLES
// ===============================
const emailStyles = {
  wrapper: `
    background:#050505;
    padding:30px 14px;
    font-family:Arial,sans-serif;
  `,

  container: `
    max-width:640px;
    margin:auto;
    background:#0d0d0d;
    border:1px solid #202020;
    border-radius:26px;
    overflow:hidden;
  `,

  content: `
    padding:42px 22px;
  `,

  heading: `
    color:#ffffff;
    font-size:34px;
    line-height:1.2;
    font-weight:700;
    margin:0;
  `,

  paragraph: `
    color:#bdbdbd;
    font-size:15px;
    line-height:1.9;
  `,

  smallText: `
    color:#8a8a8a;
    font-size:12px;
    letter-spacing:2px;
  `,

  card: `
    margin-top:30px;
    background:linear-gradient(
      180deg,
      #181818,
      #101010
    );
    border:1px solid #2a2a2a;
    border-radius:24px;
    padding:28px 22px;
  `,
};


// ===============================
// HTML BUILDER
// ===============================
const buildEmailHTML = (content) => {

  // =========================================
  // OTP EMAIL
  // =========================================
  if (typeof content === "string") {
    return `
      <div style="
        background:#060606;
        padding:40px 16px;
        font-family:Arial,sans-serif;
      ">

        <div style="
          max-width:620px;
          margin:auto;
          border:1px solid #262626;
          border-radius:28px;
          overflow:hidden;
          background:#0d0d0d;
        ">

          <div style="
            padding:45px 22px;
            text-align:center;
          ">

            <div style="
              background:#ffffff;
              display:inline-block;
              padding:8px 14px;
              border-radius:18px;
              margin-bottom:32px;
            ">
              <img
                src="https://xvital.vercel.app/primaryLogo.svg"
                alt="XVITAL"
                style="
                  width:150px;
                  display:block;
                "
              />
            </div>

            <div style="
              color:#8e8e8e;
              font-size:11px;
              letter-spacing:3px;
              margin-bottom:18px;
            ">
              SECURE VERIFICATION
            </div>

            <h1 style="
              color:#ffffff;
              margin:0;
              font-size:34px;
              line-height:1.2;
            ">
              Your OTP Code
            </h1>

            <p style="
              color:#b5b5b5;
              font-size:15px;
              line-height:1.9;
              margin-top:18px;
            ">
              This code will be valid for 5 minutes.
            </p>

            <div style="
              margin:24px auto;
              background:linear-gradient(
                180deg,
                #202020,
                #141414
              );
              border:1px solid #303030;
              border-radius:24px;
              padding:22px 18px;
              max-width:320px;
            ">

              <div style="
                color:#ffffff;
                font-size:26px;
                font-weight:bold;
                letter-spacing:5px;
              ">
                ${content}
              </div>

            </div>

            <p style="
              color:#8f8f8f;
              font-size:14px;
              line-height:1.8;
            ">
              This OTP will expire in 5 minutes.<br/>
              Never share this code with anyone.
            </p>

          </div>

        </div>

      </div>
    `;
  }

  const {
    name,
    type,
    packageName,
    date,
    time,
    message,
  } = content;

  // =========================================
  // ORDER EMAIL
  // =========================================
  if (type === "order") {

    return `
      <div style="${emailStyles.wrapper}">

        <div style="${emailStyles.container}">

          <div style="
            height:5px;
            background:linear-gradient(
              90deg,
              #ffffff 0%,
              #7b7b7b 50%,
              #ffffff 100%
            );
          "></div>

          <div style="${emailStyles.content}">

            <div style="
              text-align:center;
              margin-bottom:42px;
            ">

              <div style="
                background:#ffffff;
                display:inline-block;
                padding:10px 18px;
                border-radius:18px;
              ">

                <img
                  src="https://xvital.vercel.app/primaryLogo.svg"
                  alt="XVITAL"
                  style="
                    width:160px;
                    display:block;
                  "
                />

              </div>

            </div>

            <div style="text-align:center;">

              <div style="${emailStyles.smallText}">
                WELCOME TO XVITAL
              </div>

              <h1 style="
                ${emailStyles.heading}
                margin-top:18px;
              ">
                Congratulations,<br/>
                ${name} 💜
              </h1>

              <p style="
                ${emailStyles.paragraph}
                margin-top:24px;
              ">
                You’ve successfully unlocked your transformation journey with XVITAL.
              </p>

            </div>

            <div style="${emailStyles.card}">

              <div style="${emailStyles.smallText}">
                PURCHASED PROTOCOL
              </div>

              <div style="
                color:#ffffff;
                font-size:28px;
                line-height:1.3;
                font-weight:bold;
                margin-top:14px;
              ">
                ${packageName || "XVITAL Protocol"}
              </div>

            </div>

            <div style="${emailStyles.card}">

              <div style="
                color:#ffffff;
                font-size:22px;
                font-weight:bold;
                margin-bottom:20px;
              ">
                What happens next?
              </div>

              <div style="
                color:#bcbcbc;
                font-size:15px;
                line-height:2;
              ">
                • Our experts will review your submission<br/>
                • Your transformation journey will be personalized<br/>
                • You’ll receive structured guidance step-by-step<br/>
                • Your resources are attached below
              </div>

            </div>

          </div>

        </div>

      </div>
    `;
  }

  // =========================================
  // CONSULTATION BOOKED
  // =========================================
  if (type === "booked") {

    return `
      <div style="${emailStyles.wrapper}">

        <div style="${emailStyles.container}">

          <div style="${emailStyles.content}">

            <div style="text-align:center;">

              <div style="
                background:#ffffff;
                display:inline-block;
                padding:8px 16px;
                border-radius:16px;
                margin-bottom:32px;
              ">

                <img
                  src="https://xvital.vercel.app/primaryLogo.svg"
                  alt="XVITAL"
                  style="width:150px;"
                />

              </div>

              <div style="${emailStyles.smallText}">
                CONSULTATION CONFIRMED
              </div>

              <h1 style="
                ${emailStyles.heading}
                margin-top:18px;
              ">
                Your Consultation Is Booked
              </h1>

              <p style="
                ${emailStyles.paragraph}
                margin-top:22px;
              ">
                Hi ${name}, your consultation has been successfully scheduled.
              </p>

            </div>

            <div style="${emailStyles.card}">

              <div style="${emailStyles.smallText}">
                CONSULTATION TIMING
              </div>

              <div style="
                color:#ffffff;
                font-size:24px;
                font-weight:bold;
                margin-top:16px;
                line-height:1.6;
              ">
                ${date}<br/>
                ${time}
              </div>

            </div>

            <div style="${emailStyles.card}">

              <p style="
                ${emailStyles.paragraph}
                margin:0;
              ">
                ${message || "We’ll connect with you at your scheduled time."}
              </p>

            </div>

          </div>

        </div>

      </div>
    `;
  }

  // =========================================
  // CONSULTATION CANCELLED
  // =========================================
  if (type === "cancelled") {

    return `
      <div style="${emailStyles.wrapper}">

        <div style="${emailStyles.container}">

          <div style="${emailStyles.content}">

            <div style="text-align:center;">

              <div style="
                background:#ffffff;
                display:inline-block;
                padding:8px 16px;
                border-radius:16px;
                margin-bottom:32px;
              ">

                <img
                  src="https://xvital.vercel.app/primaryLogo.svg"
                  alt="XVITAL"
                  style="width:150px;"
                />

              </div>

              <div style="${emailStyles.smallText}">
                CONSULTATION CANCELLED
              </div>

              <h1 style="
                ${emailStyles.heading}
                margin-top:18px;
              ">
                Your Consultation Was Cancelled
              </h1>

              <p style="
                ${emailStyles.paragraph}
                margin-top:22px;
              ">
                Hi ${name}, your scheduled consultation has been cancelled successfully.
              </p>

            </div>

            <div style="${emailStyles.card}">

              <div style="
                color:#ffffff;
                font-size:18px;
                line-height:1.7;
              ">
                ${message || "If this was accidental, feel free to book again anytime."}
              </div>

            </div>

          </div>

        </div>

      </div>
    `;
  }

  // =========================================
  // CONSULTATION RESCHEDULED
  // =========================================
  if (type === "rescheduled") {

    return `
      <div style="${emailStyles.wrapper}">

        <div style="${emailStyles.container}">

          <div style="${emailStyles.content}">

            <div style="text-align:center;">

              <div style="
                background:#ffffff;
                display:inline-block;
                padding:8px 16px;
                border-radius:16px;
                margin-bottom:32px;
              ">

                <img
                  src="https://xvital.vercel.app/primaryLogo.svg"
                  alt="XVITAL"
                  style="width:150px;"
                />

              </div>

              <div style="${emailStyles.smallText}">
                CONSULTATION RESCHEDULED
              </div>

              <h1 style="
                ${emailStyles.heading}
                margin-top:18px;
              ">
                Your Consultation Has Been Rescheduled
              </h1>

            </div>

            <div style="${emailStyles.card}">

              <div style="${emailStyles.smallText}">
                UPDATED TIMING
              </div>

              <div style="
                color:#ffffff;
                font-size:24px;
                font-weight:bold;
                margin-top:16px;
                line-height:1.6;
              ">
                ${date}<br/>
                ${time}
              </div>

            </div>

            <div style="${emailStyles.card}">

              <p style="
                ${emailStyles.paragraph}
                margin:0;
              ">
                ${message || "Your consultation timing has been updated successfully."}
              </p>

            </div>

          </div>

        </div>

      </div>
    `;
  }

  // =========================================
  // DEFAULT
  // =========================================
  return `
    <div style="${emailStyles.wrapper}">

      <div style="${emailStyles.container}">

        <div style="${emailStyles.content}">

          <h2 style="
            color:#ffffff;
            margin-top:0;
            font-size:28px;
          ">
            Hello ${name || "User"}
          </h2>

          <p style="${emailStyles.paragraph}">
            ${message || "Thank you for choosing XVITAL."}
          </p>

        </div>

      </div>

    </div>
  `;
};



// ===============================
// MAIN EMAIL FUNCTION
// ===============================
export const sendEmail = async (
  from,
  to,
  subject,
  content,
  attachmentPaths = []
) => {
  try {
    let token = await getZohoAccessToken();

    const html = buildEmailHTML(content);

    const accountId = await getAccountId(token);

    const sendRequest = async (
      accessToken
    ) => {

      let attachments = [];

      // =========================
      // MULTIPLE ATTACHMENTS
      // =========================
      for (const filePath of attachmentPaths) {

        if (
          filePath &&
          fs.existsSync(filePath)
        ) {

          const uploadedFile =
            await uploadAttachment(
              accessToken,
              accountId,
              filePath
            );

          attachments.push(uploadedFile);
        }
      }

      console.log(
        "\n========== ATTACHMENTS =========="
      );

      console.log(
        JSON.stringify(
          attachments,
          null,
          2
        )
      );

      console.log(
        "=================================\n"
      );

      const payload = {
        fromAddress:
          typeof content === "object" &&
          content.from
            ? content.from
            : from,

        toAddress: to,

        subject,

        content: html,

        mailFormat: "html",

        attachments,
      };

      console.log(
        "\n========== FINAL PAYLOAD =========="
      );

      console.log(
        JSON.stringify(
          payload,
          null,
          2
        )
      );

      console.log(
        "===================================\n"
      );

      return axios.post(
        `${process.env.ZOHO_MAIL_BASE_URL}/api/accounts/${accountId}/messages`,
        payload,
        {
          headers: {
            Authorization:
              `Zoho-oauthtoken ${accessToken}`,

            "Content-Type":
              "application/json",
          },
        }
      );
    };

    try {

      const res =
        await sendRequest(token);

      console.log(
        "✅ Email sent:",
        res.data
      );

    } catch (err) {

      if (
        err.response?.status === 401
      ) {

        token =
          await getZohoAccessToken(true);

        const res =
          await sendRequest(token);

        console.log(
          "✅ Email sent (retry):",
          res.data
        );

      } else {
        throw err;
      }
    }

  } catch (error) {

    console.error(
      "❌ Email error:",
      error.response?.data ||
      error.message
    );
  }
};