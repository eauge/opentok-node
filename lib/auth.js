var jwt = require('jwt-simple'),
  _ = require('underscore'),
  pkg = require('../package.json');

function createJwtToken(scope, expires, config, claims) {

  // nbf is implicit in iat. We don't currently have
  // a use case where we have to create a token
  // beforehand
  var tokenDetails = {
    'scope': scope,
    'iss': config.apiKey,
    'iat': Math.floor(Date.now() / 1000),
    'exp': Math.floor(Date.now() / 1000) + expires,
    'sdk':  'OpenTok-Node-SDK/' + pkg.version
  };

  if (claims) {
    tokenDetails = _.extend(tokenDetails, claims);
  }

  var token = jwt.encode(tokenDetails, config.apiSecret);
  return token;
}

// 20 seconds
exports.requestTimeout = 20000;

exports.getAuthToken = function(scope, config, claims) {

  var expires = exports.requestTimeout/1000 * 2;

  return createJwtToken(scope, expires, config, claims);
};