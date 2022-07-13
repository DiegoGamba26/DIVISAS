const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    "development": {
        "username": process.env.DB_USER,
        "password": process.env.DB_PASS,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "port":process.env.DB_PORT,
        "dialect": "mysql",
        "operatorsAliases": 0
      },
      "production": {
        "username": process.env.DB_USER,
        "password": process.env.DB_PASS,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "dialect": "mysql",
        "operatorsAliases": 0
      }
});
mysqlConnection.connect(err => {
    if (err) {
        console.log('HAY UN ERROR EN LA BASE DE DATOS EL CUAL ES EL SIGUIENTE: ', err);
        return;
    } else {
        console.log('BASE DE DATOS OK');
    }

});
module.exports = mysqlConnection;