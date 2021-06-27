require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const saltRounds = 10;
const bcrypt = require('bcrypt');
const { v4 } = require('uuid');

mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 31557600000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const userSchema = mongoose.Schema({
  name: String,
  username: String,
  password: String,
  docs: Array,
});

const documentSchema = mongoose.Schema({
  id: String,
  title: String,
  content: String,
});

const User = mongoose.model('user', userSchema);
const Document = mongoose.model('document', documentSchema);

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      return done(null, user);
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.post('/isAuth', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('yes');
  } else {
    res.send('no');
  }
});

app.post('/get-all-documents', (req, res) => {
  if (req.isAuthenticated()) {
    Document.find({ id: { $in: req.user.docs } }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  } else {
    res.send('not authenticated');
  }
});

app.post('/create-document', (req, res) => {
  if (req.isAuthenticated()) {
    const docsId = v4();
    const myDocument = new Document({
      id: docsId,
      title: req.body.title,
      content: '',
    });
    myDocument.save((err) => {
      if (err) {
        console.log(err);
      } else {
        User.findById(req.user.id, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            result.docs.push(docsId);
            result.save();
            res.send({
              status: 'success',
              id: docsId,
            });
          }
        });
      }
    });
  } else {
    res.send('not authenticated');
  }
});

app.post('/get-document', (req, res) => {
  if (req.isAuthenticated()) {
    const { id } = req.body;
    var isOwned = false;
    req.user.docs.forEach((element) => {
      if (element === id) {
        isOwned = true;
      }
    });
    if (isOwned === true) {
      Document.findOne({ id: id }, (err, result) => {
        var myDocument = { ...result._doc, status: 'success' };
        res.send(myDocument);
      });
    } else {
      res.send('No Document Found');
    }
  } else {
    res.send('not authenticated');
  }
});

app.post('/set-content', (req, res) => {
  if (req.isAuthenticated()) {
    const { id, content } = req.body;
    var isOwned = false;
    req.user.docs.forEach((element) => {
      if (element === id) {
        isOwned = true;
      }
    });
    if (isOwned === true) {
      Document.findOne({ id: id }, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          result.content = content;
          result.save();
        }
      });
    } else {
      res.send('No Document Found');
    }
  } else {
    res.send('not authenticated');
  }
});

app.post('/login', (req, res) => {
  if (
    typeof req.body.username !== 'string' ||
    typeof req.body.password !== 'string' ||
    typeof req.body.rpassword !== 'string'
  ) {
    res.send('Please Fill Correctly');
  } else if (
    req.body.username.trim() == '' ||
    req.body.password.trim() == '' ||
    req.body.rpassword.trim() == ''
  ) {
    res.send('Please Fill Correctly');
  } else {
    if (req.body.password === req.body.rpassword) {
      User.findOne({ username: req.body.username }, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          if (!result) {
            res.send('No User Found');
          } else {
            bcrypt.compare(
              req.body.password,
              result.password,
              function (err, result) {
                if (err) {
                  console.log(err);
                } else {
                  if (result) {
                    passport.authenticate('local')(req, res, function () {
                      res.send('success');
                    });
                  } else {
                    res.send('Incorrect Password');
                  }
                }
              }
            );
          }
        }
      });
    } else {
      res.send('Please Fill Correctly');
    }
  }
});

app.post('/register', (req, res) => {
  if (
    typeof req.body.name !== 'string' ||
    typeof req.body.username !== 'string' ||
    typeof req.body.password !== 'string' ||
    typeof req.body.rpassword !== 'string'
  ) {
    res.send('Please Fill Correctly');
  } else if (
    req.body.name.trim() == '' ||
    req.body.username.trim() == '' ||
    req.body.password.trim() == '' ||
    req.body.rpassword.trim() == ''
  ) {
    res.send('Please Fill Correctly');
  } else {
    if (req.body.password === req.body.rpassword) {
      User.findOne({ username: req.body.username }, (err, result) => {
        if (err) {
          console.log('err: ' + err);
        } else {
          if (result) {
            res.send('Username Already Taken');
          } else {
            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
              if (err) {
                console.log(err);
              } else {
                const user = new User({
                  name: `${req.body.name}`,
                  username: req.body.username,
                  password: hash,
                });
                user.save((err) => {
                  if (err) {
                    console.log('err');
                  } else {
                    passport.authenticate('local')(req, res, function () {
                      res.send('success');
                    });
                  }
                });
              }
            });
          }
        }
      });
    } else {
      res.send('Please Fill Correctly');
    }
  }
});

app.listen(5000);
