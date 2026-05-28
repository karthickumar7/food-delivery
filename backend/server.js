import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import "dotenv/config"
import userRouter from "./routes/userRoute.js"
import orderRouter from "./routes/orderRoute.js"

const app = express()
const PORT = process.env.PORT || 4000
const otpStore = {};
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
  const mongoUri = process.env.MONGO_URI?.trim()

  if (!mongoUri) {
    console.log("MONGO_URI is not set. Server started without database connection.")
    return
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  })
  console.log("MongoDB connected")
}

connectDB()
  .catch((error) => {
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
