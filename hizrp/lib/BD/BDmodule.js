const mysql = require("mysql2");
const config = require("./config.json");

class BDConnect{
    constructor(){
        
    }

    ConnectBD() {
        const connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            database: config.database,
            password: config.password,
            multipleStatements: true
        });

        return connection
    }

    call(sql,callback){
        const connection = this.ConnectBD();

        connection.query(sql, function(err, results) {
            return callback(err,results)
        });
    
        connection.end();
    }
}

module.exports = BDConnect