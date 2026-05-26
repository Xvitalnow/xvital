import axios from "axios";
import { getZohoAccessToken } from "../config/zohoAuth.js";

let cachedZohoToken = null;
let tokenExpiryTime = null;



// ===============================
// REQUEST WRAPPER
// ===============================
const zohoRequest = async (config, retry = true) => {
  try {
    const token = await getZohoAccessToken();

    return axios({
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });
  } catch (error) {
    if (retry && error.response?.status === 401) {
      clearZohoTokenCache();

      const token = await getZohoAccessToken(true);

      return axios({
        ...config,
        headers: {
          ...(config.headers || {}),
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      });
    }

    throw error;
  }
};

// ===============================
// SEARCH CONTACT
// ===============================
export const searchZohoContactByEmail = async (email) => {
  try {
    const res = await zohoRequest({
      method: "GET",
      url: `${process.env.ZOHO_BASE_URL}/crm/v2/Contacts/search`,
      params: {
        criteria: `(Email:equals:${email})`,
      },
    });

    const contact = res.data.data?.[0] || null;
    console.log("Zoho Contact:", contact);

    return contact;
  } catch (error) {
    if (error.response?.status === 204) return null;
    throw new Error("Zoho search failed");
  }
};

// ===============================
// CREATE / UPDATE CONTACT
// ===============================
export const createOrUpdateZohoContact = async (data) => {
  try {
    const existing = await searchZohoContactByEmail(data.email);

    const [firstName, ...rest] = data.name.trim().split(" ");
    const lastName = rest.join(" ") || firstName || "Unknown";

    const formatObject = (obj = {}) => {
      return Object.entries(obj)
        .map(([key, value]) => {
          const formattedKey = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          let formattedValue = value;

          if (Array.isArray(value)) {
            formattedValue = value.join(", ");
          }

          if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
          ) {
            formattedValue = JSON.stringify(
              value,
              null,
              2
            );
          }

          return `${formattedKey}: ${formattedValue}`;
        })
        .join("\n");
    };

    const descriptionJSON = `
========================
CONSULTATION REPORT
========================

Health Score: ${data.healthScore}
Health Label: ${data.healthLabel}

========================
BODY INSIGHTS
========================

${data.bodyInsights
        ?.split("||")
        ?.map((item, i) => `${i + 1}. ${item}`)
        ?.join("\n") || "N/A"}

========================
WHY THIS HAPPENS
========================

${data.whyThisHappens || "N/A"}

========================
POSSIBLE OUTCOMES
========================

${data.possibleOutcomes
        ?.split("||")
        ?.map((item, i) => `${i + 1}. ${item}`)
        ?.join("\n") || "N/A"}

========================
BODY DETAILS
========================

Weight: ${data.weight}
Height: ${data.height}
Age: ${data.age}

========================
FOOD RESTRICTIONS
========================

${Array.isArray(data.foodRestrictions)
        ? data.foodRestrictions.join(", ")
        : data.foodRestrictions || "None"
      }

========================
BOOKING DETAILS
========================

Date: ${data.date || "N/A"}
Time: ${data.time || "N/A"}
Status: ${data.status || "draft"}

========================
MAIN QUESTIONNAIRE ANSWERS
========================

${formatObject(
        data.questionnaireAnswers
      )}

========================
SUB QUESTION ANSWERS
========================

${formatObject(
        data.questionnaireSubAnswers
      )}

========================
EXTRA INPUTS
========================

${formatObject(
        data.questionnaireExtraInputs
      )}

========================
PAYMENT
========================

Amount: ₹${data.amount || 0}
`;

    const payload = {
      First_Name: firstName,
      Last_Name: lastName,
      Email: data.email,
      Phone: data.phone,
      Gender: data.gender || "",
      Age: Number(data.age) || null,

      // 🔥 IMPORTANT: status stored here
      Lead_Source: data.status || "pending",

      Description: descriptionJSON,
    };

    // ===============================
    // UPDATE
    // ===============================
    if (existing) {
      await zohoRequest({
        method: "PUT",
        url: `${process.env.ZOHO_BASE_URL}/crm/v2/Contacts`,
        data: {
          data: [{ id: existing.id, ...payload }],
        },
      });

      return { contact: existing.id };
    }

    // ===============================
    // CREATE
    // ===============================
    const res = await zohoRequest({
      method: "POST",
      url: `${process.env.ZOHO_BASE_URL}/crm/v2/Contacts`,
      data: { data: [payload] },
    });

    return { contact: res.data.data?.[0]?.details?.id };
  } catch (error) {
    console.error("Zoho Error:", error.response?.data || error.message);
    throw new Error("Zoho contact failed");
  }
};

// ===============================
// SEARCH LEAD
// ===============================
export const searchZohoLeadByEmail = async (
  email
) => {
  try {

    const res = await zohoRequest({
      method: "GET",

      url:
        `${process.env.ZOHO_BASE_URL}/crm/v2/Leads/search`,

      params: {
        criteria: `(Email:equals:${email})`,
      },
    });

    return res.data.data?.[0] || null;

  } catch (error) {

    if (
      error.response?.status === 204
    ) {
      return null;
    }

    throw new Error(
      "Zoho lead search failed"
    );
  }
};

// ====================================
// CREATE LEAD OR UPDATE CONTACT + TASK
// ====================================
export const createZohoLead = async (
  data
) => {

  try {

    // --------------------------------
    // CHECK EXISTING LEAD
    // --------------------------------
    const existing =
      await searchZohoLeadByEmail(
        data.email
      );

    // already exists
    if (existing) {

      return {
        leadId: existing.id,
        duplicate: true,
      };
    }

    const [firstName, ...rest] =
      data.name.trim().split(" ");

    const lastName =
      rest.join(" ") ||
      firstName ||
      "Unknown";

    const descriptionJSON =
      JSON.stringify(
        {
          type:
            "consultation_booking",

          gender:
            data.gender,

          source:
            "xVital",
        },
        null,
        2
      );

    const payload = {
      First_Name: firstName,

      Last_Name: lastName,

      Email: data.email,

      Phone: data.phone,

      Company: "xVital",

      Lead_Source: "Website",

      Description: descriptionJSON,
    };

    const res =
      await zohoRequest({
        method: "POST",

        url:
          `${process.env.ZOHO_BASE_URL}/crm/v2/Leads`,

        data: {
          data: [payload],
        },
      });

    return {
      leadId:
        res.data.data?.[0]
          ?.details?.id,

      duplicate: false,
    };

  } catch (error) {

    console.error(
      "Zoho Lead Error:",
      error.response?.data ||
      error.message
    );

    throw new Error(
      "Zoho lead creation failed"
    );
  }
};

// ===============================
// SEARCH TASK BY CONTACT
// ===============================
export const searchZohoTask = async (
  email
) => {

  try {

    // find contact
    const existingContact =
      await searchZohoContactByEmail(
        email
      );

    if (!existingContact) {
      return null;
    }

    // fetch tasks
    const res =
      await zohoRequest({
        method: "GET",

        url:
          `${process.env.ZOHO_BASE_URL}/crm/v2/Tasks`,
      });

    const tasks =
      res.data.data || [];

    // find matching task
    const existingTask =
      tasks.find((task) => {

        return (
          task.Contact_Name?.id ===
          existingContact.id
        );
      });

    return existingTask || null;

  } catch (error) {

    console.error(
      "TASK SEARCH ERROR:",
      error.response?.data ||
      error.message
    );

    return null;
  }
};

// ==============================================================
// SAVE CONSULTATION SCHEDULE OR UPDATE SCHEDULE IN ZOHO TASK
// ==============================================================
export const createOrUpdateZohoTask =
  async (data) => {

    try {

      const existingContact =
        await searchZohoContactByEmail(
          data.email
        );
      const existingTask =
        await searchZohoTask(
          data.email
        );

      if (!existingContact) {
        throw new Error(
          "Zoho contact not found"
        );
      }

      const bookingDate =
        new Date(data.date);

      const formattedDate =
        bookingDate
          .toISOString()
          .split("T")[0];

      let taskStatus =
        "Not Started";

      if (
        data.status ===
        "completed"
      ) {
        taskStatus =
          "Completed";
      }

      if (
        data.status ===
        "cancelled"
      ) {
        taskStatus =
          "Cancelled";
      }

      if (
        data.status ===
        "rescheduled"
      ) {
        taskStatus =
          "Deferred";
      }

      const payload = {
        Subject:
          `XVITAL Consultation - ${data.name}`,

        Due_Date:
          formattedDate,

        Status:
          taskStatus,

        Priority:
          "High",

        Contact_Name: {
          id: existingContact.id,
        },

        Description:
          JSON.stringify(
            {
              type:
                "consultation_task",

              consultationTime:
                data.time,

              status:
                data.status,

              source:
                "xVital",

              phone: data.phone,

              email: data.email,
            },
            null,
            2
          ),
      };

      // ======================
      // UPDATE EXISTING TASK
      // ======================

      if (data.zohoTaskId || existingTask) {

        await zohoRequest({
          method: "PUT",

          url:
            `${process.env.ZOHO_BASE_URL}/crm/v2/Tasks`,

          data: {
            data: [
              {
                id: data.zohoTaskId || existingTask.id,
                ...payload,
              },
            ],
          },
        });

        return {
          taskId:
            data.zohoTaskId || existingTask.id,
        };
      }

      // ======================
      // CREATE NEW TASK
      // ======================

      const res =
        await zohoRequest({
          method: "POST",

          url:
            `${process.env.ZOHO_BASE_URL}/crm/v2/Tasks`,

          data: {
            data: [payload],
          },
        });

      return {
        taskId:
          res.data.data?.[0]
            ?.details?.id,
      };

    } catch (error) {

      console.error(
        "Zoho Task Error:",
        error.response?.data ||
        error.message
      );

      throw new Error(
        "Zoho task failed"
      );
    }
  };


// ===============================
// SEARCH DEAL
// ===============================
export const searchZohoDeal =
  async (dealName) => {

    try {

      const res =
        await zohoRequest({
          method: "GET",

          url:
            `${process.env.ZOHO_BASE_URL}/crm/v2/Deals/search`,

          params: {
            criteria:
              `(Deal_Name:equals:${dealName})`,
          },
        });

      return res.data.data?.[0] || null;

    } catch (error) {

      // no deal found
      if (
        error.response?.status === 204
      ) {
        return null;
      }

      // IMPORTANT:
      // don't stop deal creation
      console.error(
        "DEAL SEARCH ERROR:",
        error.response?.data ||
        error.message
      );

      return null;
    }
  };

// ===============================
// CREATE OR UPDATE DEAL
// ===============================
export const createZohoDealOrder =
  async (data) => {

    try {

      // find contact
      const existingContact =
        await searchZohoContactByEmail(
          data.email
        );

      if (!existingContact) {

        throw new Error(
          "Contact not found"
        );
      }

      // unique deal name
      const dealName =
        `${data.packageName} - ${data.email}`;

      // search existing deal
      const existingDeal =
        await searchZohoDeal(
          dealName
        );

      // description
      const description =
        `
Package:
${data.packageName}

Status:
${new Date(data.expiryDate)
          > new Date()
          ? "Active"
          : "Expired"
        }

Expiry Date:
${new Date(data.expiryDate)
          .toLocaleDateString()}

Duration:
${data.duration} Days

Amount:
₹${data.amount}

Latest Payment ID:
${data.razorpay_payment_id}

Updated:
${new Date()
          .toLocaleString()}
`;

      // payload
      const payload = {

        Deal_Name: dealName,

        Stage: "Paid",

        Amount: data.amount,

        // renamed field label in zoho
        // api name still Closing_Date
        Closing_Date:
          new Date(data.expiryDate)
            .toISOString()
            .split("T")[0],

        Contact_Name: {
          id: existingContact.id,
        },

        Description:
          description,
      };

      // =====================
      // UPDATE EXISTING DEAL
      // =====================
      if (existingDeal) {

        await zohoRequest({
          method: "PUT",

          url:
            `${process.env.ZOHO_BASE_URL}/crm/v2/Deals`,

          data: {
            data: [
              {
                id: existingDeal.id,
                ...payload,
              },
            ],
          },
        });

        return {
          dealId:
            existingDeal.id,

          updated: true,
        };
      }

      // =====================
      // CREATE NEW DEAL
      // =====================
      const res =
        await zohoRequest({
          method: "POST",

          url:
            `${process.env.ZOHO_BASE_URL}/crm/v2/Deals`,

          data: {
            data: [payload],
          },
        });

      return {
        dealId:
          res.data.data?.[0]
            ?.details?.id,

        created: true,
      };

    } catch (error) {

      console.error(
        "Zoho Deal Error:",
        error.response?.data ||
        error.message
      );

      throw new Error(
        "Zoho deal failed"
      );
    }
  };