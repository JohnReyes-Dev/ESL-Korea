const mysql = require("mysql2");
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

var mysqlConnection = mysql.createConnection({
    host: "",
    user: "",
    password: "",
    database: "",
    multipleStatements: true,
});


mysqlConnection.connect((err) => {
    if (!err) console.log("DB connection succeded.");
    else
        console.log(
            "DB connection failed \n Error : " + JSON.stringify(err, undefined, 2)
        );
});

exports.login = async (req, res) => {
    try {
        // const { email, password } = req.body;
        const { email } = req.body;

        mysqlConnection.query("SELECT * FROM sys.users WHERE email = ?", [email], async (error, results) => {

            const id = results[0].id;
            const token = jwt.sign({id}, "secretpassword", {
                expiresIn: '90d'
            });

            console.log(token);

            const cookieOptions = {
                expires: new Date(
                    Date.now() + 90 * 24 * 60 *60* 1000
                ),
                httpOnly: true
            }

            res.cookie('jwt', token, cookieOptions);

            res.status(200).redirect("/");
        });
    }
    catch (error) {
        console.log(error);
    }
}


exports.register = (req, res) => {
    const { name, email, password } = req.body;

    mysqlConnection.query(

        // let hashPassword = await bcrypt.hash(password, 8);

        "INSERT INTO sys.users (`name`, `email`, `password`) VALUES (?, ?, ?);",
        [
            name,
            email,
            password,
        ],
        (err) => {
            if (!err) res.send("added successfully.");
            else console.log(err);
        }
    );
}

function authenticateToken(req, res, nex) {

}