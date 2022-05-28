# passport-phone
Passport strategy for authenticating with a phonenNmber and verifyCode.

## Install

```bash
$ npm install passport-phone
```
## Usage

### Configure Strategy

The phone authentication strategy authenticates users using a phoneNumber and verifyCode. The strategy requires a verify callback, which accepts these credentials and calls done providing a user.

```javascript
passport.use(new PhoneStrategy(
  function(phoneNumber, verifyCode, done) {
    User.findOne({ phoneNumber }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPhoneSMSCode(verifyCode)) { return done(null, false); }
      return done(null, user);
    });
  }
));
```

### Authenticate Requests

Use passport.authenticate(), specifying the 'phone' strategy, to authenticate requests.

For example, as route middleware in an Express application:

```javascript
app.post('/login', 
  passport.authenticate('phone', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
```

## Support

Please open an issue [here](https://github.com/sothx/passport-phone/issues).

## License

[MIT](LICENSE)


