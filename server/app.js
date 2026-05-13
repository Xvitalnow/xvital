import "./config/env.js"

import express from "express"
import cors from "cors"
import connectDB from "./config/db.js"

connectDB();

export const app = express()

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// app.use(cors(process.env.FRONTEND_URL))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// app.get("/", (req, res) => {
//   res.send("Hello World!")
// })





// app.get("/", (req, res) => {
//   // get zoho access token
//   const client_id = process.env.ZOHO_CLIENT_ID
//   const client_secret = process.env.ZOHO_CLIENT_SECRET
//   // const refresh_token = process.env.ZOHO_REFRESH_TOKEN
//   const grant_type = "authorization_code"
//   const redirect_uri = process.env.FRONTEND_URL
//   const code = "1000.e0c899fd58ea536f35eaadeac3b38d6a.78a3f5ad75b3d10dd995a739c42381de"

//   const url = `https://accounts.zoho.in/oauth/v2/token?grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}&code=${code}`

//   fetch(url, {
//     method: "POST",
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data)
//       res.json(data)
//     })
//     .catch((error) => {
//       console.error(error)
//       res.status(500).json({ error: "Something went wrong" })
//     })
// })
// routes
// Consultation Routes

import consultationRoutes from "./routes/consultation.routes.js"
app.use("/api", consultationRoutes)

// Lead Routes
import leadsRoutes from "./routes/leads.routes.js"
app.use("/api", leadsRoutes)

// Order Routes
import orderRoutes from "./routes/order.routes.js"

app.use("/api", orderRoutes);



export default app;



