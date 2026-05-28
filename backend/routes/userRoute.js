import express from "express"
import crypto from "crypto"
import User from "../models/userModel.js"

const userRouter = express.Router()

const createPasswordHash = (password, salt = crypto.randomBytes(16).toString("hex")) => {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex")
  return { hash, salt }
}

const removePasswordFields = (user) => {
  const userObject = user.toObject()
  delete userObject.passwordHash
  delete userObject.passwordSalt
  return userObject
}

userRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password, dob, city, address, phoneNumber, avatarUrl } = req.body

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login.",
      })
    }

    const { hash, salt } = createPasswordHash(password)
    const user = await User.create({
      name,
      email,
      dob,
      city,
      address,
      phoneNumber,
      avatarUrl,
      passwordHash: hash,
      passwordSalt: salt,
    })

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: removePasswordFields(user),
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    const { hash } = createPasswordHash(password, user.passwordSalt)

    if (hash !== user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    res.json({
      success: true,
      message: "Login successful",
      user: removePasswordFields(user),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

userRouter.post("/", async (req, res) => {
  try {
    const { name, email, dob, city, address, phoneNumber, avatarUrl } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Please sign up before saving profile details",
      })
    }

    user.name = name
    user.dob = dob
    user.city = city
    user.address = address
    user.phoneNumber = phoneNumber
    if (avatarUrl !== undefined) {
      user.avatarUrl = avatarUrl
    }
    await user.save()

    res.status(200).json({
      success: true,
      message: "User details saved successfully",
      user: removePasswordFields(user),
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

userRouter.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash -passwordSalt").sort({ createdAt: -1 })

    res.json({
      success: true,
      users,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

userRouter.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      user: removePasswordFields(user),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

userRouter.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      message: "User details updated successfully",
      user: removePasswordFields(user),
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

userRouter.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

export default userRouter
