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

    const descriptionJSON = JSON.stringify({
      type: "consultation",
      score: data.healthScore,
      label: data.healthLabel,

      insights: data.bodyInsights?.split("||") || [],
      outcomes: data.possibleOutcomes?.split("||") || [],

      reason: data.whyThisHappens,

      body: {
        weight: data.weight,
        height: data.height,
        age: data.age,
      },

      schedule: {
        date: data.date,
        time: data.time,
      },

      foodRestrictions: data.foodRestrictions || "",
    });

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
// CREATE LEAD (CONSULTATION)
// ===============================
export const createZohoLead = async (data) => {
  try {
    const [firstName, ...rest] = data.name.trim().split(" ");
    const lastName = rest.join(" ") || firstName || "Unknown";

    // 🔥 JSON description (your idea — correct)
    const descriptionJSON = JSON.stringify(
      {
        type: "consultation_booking",
        gender: data.gender,
        source: "xVital",
      },
      null,
      2
    );

    const payload = {
      First_Name: firstName,
      Last_Name: lastName,
      Email: data.email,
      Phone: data.phone,

      // required workaround
      Company: "xVital",

      // 🔥 using existing field smartly
      Lead_Source: "Website",
      Description: descriptionJSON,
    };

    const res = await zohoRequest({
      method: "POST",
      url: `${process.env.ZOHO_BASE_URL}/crm/v2/Leads`,
      data: { data: [payload] },
    });

    return {
      leadId: res.data.data?.[0]?.details?.id,
    };

  } catch (error) {
    console.error("Zoho Lead Error:", error.response?.data || error.message);
    throw new Error("Zoho lead creation failed");
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

        Contact_Name:
          existingContact.id,

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
            },
            null,
            2
          ),
      };

     // ======================
// UPDATE EXISTING TASK
// ======================

if (data.zohoTaskId) {

  await zohoRequest({
    method: "PUT",

    url:
      `${process.env.ZOHO_BASE_URL}/crm/v2/Tasks`,

    data: {
      data: [
        {
          id: data.zohoTaskId,
          ...payload,
        },
      ],
    },
  });

  return {
    taskId:
      data.zohoTaskId,
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
// CREATE DEAL (ORDER / PURCHASE)
// ===============================
export const createZohoDealOrder = async (data) => {
  try {
    // --------------------------------
    // 1. Find contact by email
    // --------------------------------
    const existingContact = await searchZohoContactByEmail(data.email);

    if (!existingContact) {
      throw new Error("Zoho contact not found for this user");
    }

    // --------------------------------
    // 2. Build Deal Name
    // --------------------------------
    const dealName = `${data.packageName} - ${data.name}`;

    // --------------------------------
    // 3. Compact Description JSON
    // --------------------------------
    const descriptionJSON = JSON.stringify(
      {
        type: "paid_order",
        packageId: data.packageId,
        packageName: data.packageName,
        duration:
          data.packageId === "reset"
            ? "30 Days"
            : "90 Days",

        paymentStatus: data.status,
        amount: data.amount,

        razorpay_order_id: data.razorpay_order_id,
        razorpay_payment_id: data.razorpay_payment_id,

        source: "website",
        createdAt: new Date(),
      },
      null,
      2
    );

    // --------------------------------
    // 4. Deal Payload
    // --------------------------------
    const payload = {
      Deal_Name: dealName,

      Stage: "Paid",

      Amount: data.amount,

      Closing_Date: new Date().toISOString().split("T")[0],

      Contact_Name: existingContact.id,

      Description: descriptionJSON,
    };

    // --------------------------------
    // 5. Create Deal
    // --------------------------------
    const res = await zohoRequest({
      method: "POST",
      url: `${process.env.ZOHO_BASE_URL}/crm/v2/Deals`,
      data: {
        data: [payload],
      },
    });

    return {
      dealId: res.data.data?.[0]?.details?.id,
    };

  } catch (error) {
    console.error(
      "Zoho Deal Order Error:",
      error.response?.data || error.message
    );

    throw new Error("Zoho order deal creation failed");
  }
};