import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import "dotenv/config"
import userRouter from "./routes/userRoute.js"
import orderRouter from "./routes/orderRoute.js"

const app = express()
const PORT = process.env.PORT || 4000
const otpStore = {};
let dbConnectionError = ""
mongoose.set("bufferCommands", false)

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("API is running")
})

app.get("/health", (req, res) => {
  res.json({
    success: true,
    api: "running",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    mongoEnv: getMongoEnvName() || "missing",
    dbConnectionError,
  })
})

const requireDBConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database not connected. Check MONGO_URI and MongoDB Atlas network access.",
    })
  }

  next()
}

app.use("/api/users", requireDBConnection, userRouter)
app.use("/api/orders", requireDBConnection, orderRouter)

const connectDB = async () => {
  const mongoEnvName = getMongoEnvName()
  const mongoUri = mongoEnvName ? process.env[mongoEnvName]?.trim() : ""

  if (!mongoUri) {
    dbConnectionError = "MongoDB connection string env var is not set."
    console.log("MONGO_URI, MONGODB_URI, or MONGODB_URL is not set. Server started without database connection.")
    return
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  })
  dbConnectionError = ""
  console.log("MongoDB connected")
}

const getMongoEnvName = () => (
  ["MONGO_URI", "MONGODB_URI", "MONGODB_URL"].find((envName) => process.env[envName]?.trim())
)

connectDB()
  .catch((error) => {
    dbConnectionError = error.message
    console.error("MongoDB connection failed:", error.message)
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`)
    })
  })
app.post("/phone", async (req, res) => {

    try {
      
        const { phone } = req.body;

        if (!phone) {
            return res.json({
                success: false,
                message: "Phone number required"
            });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        console.log(otp)
        otpStore[phone] = otp;

        console.log("OTP:", otp);

        // later send real SMS here

        res.json({
            success: true,
            message: "OTP sent"
        });

    } catch (error) {

        res.json({
            success: false,
            message: error.message
        });
    }
});
app.post("/otp", async (req, res) => {

    try {

        const { phone, otp } = req.body;

        if (otpStore[phone] == otp) {

            delete otpStore[phone];

            return res.json({
                success: true,
                message: "OTP verified"
            });
        }

        res.json({
            success: false,
            message: "Invalid OTP"
        });

    } catch (error) {

        res.json({
            success: false,
            message: error.message
        });
    }
});
