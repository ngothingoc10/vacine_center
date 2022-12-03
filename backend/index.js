const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const log = require("loglevel");
require("dotenv").config();

const indexRouter = require("./src/routes/index");
const authRouter = require("./src/routes/auth");
const categoryRouter = require("./src/routes/category");
const vaccineRouter = require("./src/routes/vaccine");
const vaccineDetailRouter = require("./src/routes/vaccine-detail");
const patientRouter = require("./src/routes/patient");
const scheduleConfigRoute = require('./src/routes/schedule-config');
const uploadRouter = require('./src/routes/upload');
const ageGroupRouter = require('./src/routes/age-group');
const appointmentRouter = require('./src/routes/appointment');
const scheduleRouter = require('./src/routes/schedule');


// var usersRouter = require('./src/routes/users');

var app = express();
var corsOptions = {
  origin: "http://127.0.0.1:5173",
};
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const db = require("./src/models");
db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/vaccines", vaccineRouter);
app.use("/api/vaccine-details", vaccineDetailRouter);
app.use('/api/patients', patientRouter);
app.use('/api/schedule-configs', scheduleConfigRoute);
app.use('/api/upload', uploadRouter);
app.use('/api/age-groups', ageGroupRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/appointments', appointmentRouter);

// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  log.error(err);

  if (!err.status) {
    res.status(500);
    return res.json({ error: "Internal Server Error." });
  } else {
    res.status(err.status);
    return res.json({ error: err.message });
  }
});

module.exports = app;
