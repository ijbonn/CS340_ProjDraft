const mysql = require('mysql')
const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_vanderwc',
    password        : '4750',
    database        : 'cs340_vanderwc'
});

module.exports.pool = pool;