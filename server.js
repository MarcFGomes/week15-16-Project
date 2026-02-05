const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

require("dotenv").config();

const sequelize = require("./config/connection");
const routes = require("./controllers");

const app = express();
const PORT = 3001;


const hbs = exphbs.create();

const sess = {
  secret: process.env.SESSION_SECRET || "keyboard_cat",
  cookie: {
    maxAge: 1000 * 60 * 30,
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  },
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({ db: sequelize }),
};


app.use(session(sess));

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);


sequelize
  .sync()
  .then(() => {
    console.log('✅ Database connected & models synced');
    console.log(`🌐 Server listening on http://localhost:${PORT}`);
    app.listen(PORT);
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });
