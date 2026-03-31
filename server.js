require("dotenv").config({ quiet: true })
const express = require("express")
const morgan = require("morgan")
const methodOverride = require("method-override")
const session = require("express-session")

const { MongoStore } = require("connect-mongo")

const path = require("path")

const PORT = process.env.PORT ? process.env.PORT : 3000

const app = express()
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

//Routes
const authRouter = require("./routes/authRouter.js")
const userRouter = require("./routes/userRouter.js")
const propertyRouter = require("./routes/propertyRouter.js")
const appointmentRouter = require("./routes/appointmentRouter.js")

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


app.use((req, res, next) => {
  res.locals.user = req.session.user || null
  next()
})

//Routes use
app.use("/auth", authRouter)
app.use("/users", userRouter)
app.use("/Properties", propertyRouter)
app.use("/appointments", appointmentRouter)

app.get("/", (req, res) => {
  res.render("index", {
    user: req.session.user,
  })
})

app.listen(PORT, () => {
  console.log(` 🏡 EstateHub Server is cooking on Port ${PORT} `)
})
