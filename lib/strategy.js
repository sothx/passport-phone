/**
 * 模块依赖
 */
const passport = require('passport-strategy');
const util = require('util');
const { lookup, verified } = util;

/**
 * 策略类
 * 
 * 适用于手机号与验证码的验证策略
 * 
 * @param {Function} verify 
 * 必须提供 verify 回调函数，回调函数接收 phoneNumber 和 verifyCode , 并返回 user
 * 如果校验不通过，则返回 false ，如果发生异常，则返回 err
 * 
 * @param {Object} options 
 * 可选参数，可用于更改校验字段以及手机号校验正则
 * - `phoneNumberField`  校验手机号的字段，默认值为 phoneNumber
 * - `verifyCodeField`  校验手机验证码的字段，默认值为 verifyCode
 * - `phoneNumberRegExp` 校验手机号的正则表达式，未传递则不校验
 * - `passReqToCallback`  是否将 req 传递给回调函数的第一个参数，默认值为false
 * 
 *  * Examples:
 *
 *     passport.use(new PhoneStrategy(
 *       function(phoneNumber, verifyCode, done) {
 *         User.findOne({ phoneNumber, verifyCode }, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 * @api public
 */

class Strategy extends passport.Strategy {
  constructor(options, verify) {
    this()
    if (typeof options === 'function') {
      verify = options;
      options = {};
    }
    if (!verify) {
      throw new TypeError('PhoneStrategy requires a verify callback');
    }
    this._phoneNumberField = options.phoneNumberField || 'phoneNumber';
    this._verifyCodeField = options.verifyCodeField || 'verifyCode';
    this.name = 'phone';
    this._verify = verify;
    this._passReqToCallback = options.passReqToCallback;
    this._phoneNumberRegExp = options.phoneNumberRegExp;
  }
  /**
   * 根据手机号及验证码进行身份验证。
   *
   * @param {Object} req
   * 
   * @param {Object} options 
   * - `badRequestMessage`  手机号或者验证码校验不通过时的返回信息
   * - `badPhoneMessage` 手机正则校验不通过时的返回信息
   * @api protected
   */
  authenticate(req, options) {
    options = options || {};
    let phoneNumber = lookup(req.body, this._phoneNumberField) || lookup(req.query, this._phoneNumberField);
    let verifyCode = lookup(req.body, this._verifyCodeField) || lookup(req.query, this._verifyCodeField);
    if (!phoneNumber || !verifyCode) {
      return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
    }

    try {
      if (this._phoneNumberRegExp && !this._phoneNumberRegExp.test(phoneNumber)) {
        return this.fail({ message: options.badPhoneMessage || 'Validator Error phoneNumber' }, 400)
      }
    } catch (ex) {
      return this.error(ex);
    }

    try {
      if (this._passReqToCallback) {
        this._verify(req, phoneNumber, verifyCode, verified.bind(this));
      } else {
        this._verify(phoneNumber, verifyCode, verified.bind(this));
      }
    } catch (ex) {
      return this.error(ex);
    }
  }
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
