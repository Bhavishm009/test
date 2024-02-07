const util = require('util');
const mysql = require('mysql2');
const logger = require('../logger');

function makeDb(config) {
  const connection = mysql.createConnection(config);
  
  // Log the connection details
  console.log('MySQL Connection Details:', config);

  return {
    query(sql, args) {
      // Log the SQL query and arguments
      console.log('Executing SQL Query:', sql);
      console.log('Query Arguments:', args);

      return util.promisify(connection.query)
        .call(connection, sql, args)
        .then(result => {
          // Log the query result
          console.log('Query Result:', result);
          return result;
        })
        .catch(error => {
          // Log any errors
          console.error('Query Error:', error);
          throw error;
        });
    },
    close() {
      // Log the closing of the connection
      console.log('Closing MySQL Connection');
      return util.promisify(connection.end).call(connection);
    }
  };
}

module.exports = makeDb;
