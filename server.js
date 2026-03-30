require("dotenv").config({ quiet: true })
const express = require("express")
const morgan = require("morgan")
const methodOverride = require("method-override")
const session = require("express-session")

const { MongoStore } = require("connect-mongo")

const path = require("path")

// const middleware = require("./middleware")

const PORT = process.env.PORT ? process.env.PORT : 3000

const app = express()

//Routes
const authRouter = require("./routes/authRouter.js")
const userRouter = require("./routes/userRouter.js")
const propertyRouter = require("./routes/propertyRouter.js")

const dns = require("dns")
dns.setServers(["8.8.8.8", "1.1.1.1"])

const db = require("./db")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(morgan("dev"))
app.use(methodOverride("_method"))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
)

//Middleware use//
// app.use(middleware.isLoggedIn)
// app.use(middleware.isClient)
// app.use(middleware.isOwner)
// app.use(middleware.isPropertyOwner)

//Routes use
app.use("/auth", authRouter)
app.use("/user", userRouter)
app.use("/property", propertyRouter)

app.get("/", (req, res) => {
  res.send("🏢 EstateHub is open for Real Estate . . . ")
})

app.listen(PORT, () => {
  console.log(` 🏡 EstateHub Server is cooking on Port ${PORT} `)
})
