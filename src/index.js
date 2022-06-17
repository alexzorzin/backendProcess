const express = require('express');
const app = express();
const yargs = require("yargs/yargs")(process.argv.slice(2));
const config = require("./options/config");
const bcrypt = require("bcrypt");
const authorize = require("./auth/index");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const User = require("./models/Users.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const controllersdb = require("./controllers/controllerDb.js");

const loginRoute = require("./routes/login");
const infoRoute = require("./routes/info");
const randomRoute = require("./routes/random");

passport.use(
  "local-login",
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        console.log("Usuario inexistente");
        return done(null, false);
      }
      if (!isValidPassword(user, password)) {
        console.log("Contraseña incorrecta");
        return done(null, false);
      }
      return done(null, user);
    }).clone();
  })
);

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      await User.findOne({ username: username }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          console.log(`El nombre de usuario ${username} ya está tomado`);
          return done(null, false);
        }
        const newUser = {
          username: req.body.username,
          password: createHash(password),
        };
        User.create(newUser, (err, userWithId) => {
          if (err) {
            return done(err);
          }
          return done(null, userWithId);
        });
      }).clone();
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

function isValidPassword(user, password) {
  console.log(`Comparando tu contraseña: ${password} con: ${user.password}`);

  return bcrypt.compareSync(password, user.password);
}

function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(process.cwd() + "/public"));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        'mongodb+srv://aleexz:caca12345@cluster0.wohmi.mongodb.net/process?retryWrites=true&w=majority',
      mongoOptions: advancedOptions,
    }),
    secret: "secreto",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

app.use("/", loginRoute);
app.use("/info", infoRoute);
app.use("/api/random", randomRoute);

app.use(passport.initialize());
app.use(passport.session());


app.get("/home", authorize, (req, res) => {
  if (req.user) {
    res.render("pages/home", {
      nameUser: req.user.username,
    });
  }
});


app.post("/logout", authorize, (req, res) => {
  if (req.user) {
    nameUser = req.user.username;
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
    });
    res.render("pages/logout", { nameUser });
  }
});

const args = yargs
  .default({
    port: 8080,
  })
  .alias({ p: "port" }).argv;

controllersdb.connectDb(config.URL_MONGODB, (err) => {
  if (err) return console.log("db error");
  console.log("Base de datos conectada");

  app.listen(args.port, (err) => {
    if (err) return console.log("Server error");
    console.log(`Server ON: ${args.port}`);
  });
});
