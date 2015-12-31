import crypto from 'crypto';
import Buffer from 'buffer';

export default function hasher(opts, callback) {
  if (!opts.salt) {
    return crypto.randomBytes(512, (err, buf) => {
      if (err) {
        return callback(err);
      }
      opts.salt = buf;
      hasher(opts, callback);
    });
  }

  opts.hash = 'sha512';
  opts.keylen = 512;
  opts.iterations = 100000;
  crypto.pbkdf2(opts.password, opts.salt, opts.iterations, opts.keylen, opts.hash, (err, key) => {
    if (err) {
      return callback(err);
    }
    opts.key = new Buffer(key);
    callback(null, opts);
  })
};
