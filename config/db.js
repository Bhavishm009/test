const util = require('util');
const mysql = require('mysql2');
const logger = require('../logger');

function makeDb(config) {
  const connection = mysql.createConnection(config);

  // Log the connection details
  console.log('MySQL Connection Details:', config);

  return {
    query(sql, args) {
      return util.promisify(connection.query)
        .call(connection, sql, args)
        .then(result => {
          return result;
        })
        .catch(error => {
          console.error('Query Error:', error);
          throw error;
        });
    },
    close() {
      return util.promisify(connection.end).call(connection);
    }
  };
}

module.exports = makeDb;
