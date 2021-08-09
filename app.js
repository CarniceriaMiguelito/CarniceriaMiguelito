//Dependencies
const express = require("express");
const port = process.env.PORT || 3000;
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const methodOverride = require("method-override");
const expressSession = require("express-session")({
  secret: "barCodetcw",
  resave: false,
  saveUninitialized: false,
});

//Models
const Administrador = require("./models/Administrador");
const Producto = require("./models/Producto");

//Routers
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const APIRoutes = require("./routes/apiRoutes");

//app config
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
//mongoose config
const connectAtlas =
  "mongodb+srv://root:4AcJKMnJrg1Meg49@catalogo.mcz3c.mongodb.net/<dbname>?retryWrites=true&w=majority";
mongoose.connect(connectAtlas, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

//Express

//Passport config
passport.serializeUser(Administrador.serializeUser());
passport.deserializeUser(Administrador.deserializeUser());

const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy(Administrador.authenticate()));

//add EJS
app.set("view engine", "ejs");

//main route
app.get("/", (req, res) => {
  res.redirect("admin/login");
});

app.get("/img/:imgID", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/uploads/", req.params.imgID));
});

//add Routes from routers
app.use("/admin", adminRoutes);
app.use("/producto", productRoutes);
app.use("/API", APIRoutes);

app.listen(port, () => {
  console.log("Backend creado por Javier Ferreiro para Tu Comercio Web");
});
