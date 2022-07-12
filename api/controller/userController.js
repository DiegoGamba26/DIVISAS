const { json } = require('express/lib/response');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const controller = {};
const jwt = require('jsonwebtoken');

const mysqlConnection = require('../model/connection');
controller.list = (req, res) => {
    mysqlConnection.query('SELECT * FROM users', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log('OCURRIÓ UN ERROR EN LA CONSULTA PÁ', err);
        }
    });
};
controller.register = (req, res) => {
    const {
        name, last_name, nationality, date_birth, document,
        issuance_document, stratum, gender, email, num, pass
    } = req.body;
    mysqlConnection.query('INSERT INTO users SET name =?,last_name=?,nationality=?,date_birth=?,document=?,issuance_document=?,stratum=?,gender=?, email=?, num=?, pass=?', [name, last_name, nationality, date_birth, document, issuance_document, stratum, gender, email, num, pass], (err, rows, fields) => {
        if (!err) {
            res.status(200).json("Correcto calvo");
        } else {
            res.status(400).json('HUBO UN ERROR PAPU', err);
            console.log('HUBO UN ERROR PAPU', err);
        }
    });
};
controller.transaction = (req, res) => {
    const {
        name, last_name, nationality, date_birth, document,
        issuance_document, stratum, gender, email, num, pass
    } = req.body;
    mysqlConnection.query('INSERT INTO users SET name =?,last_name=?,nationality=?,date_birth=?,document=?,issuance_document=?,stratum=?,gender=?, email=?, num=?, pass=?', [name, last_name, nationality, date_birth, document, issuance_document, stratum, gender, email, num, pass], (err, rows, fields) => {
        if (!err) {
            res.status(200).json("Correcto calvo");
        } else {

            res.status(400).json('HUBO UN ERROR PAPU', err);
            console.log('HUBO UN ERROR PAPU', err);
        }
    });
};
controller.login = (req, res) => {
    const { email, pass } = req.body;
    mysqlConnection.query('SELECT id,rol,name,last_name FROM users WHERE email =? and pass=?', [email, pass],
        (err, rows, fields) => {
            console.log(err)
            console.log(rows.length)
            if (err == null && rows.length > 0) {
                jwt.sign(req.body, 'DIEGO', { expiresIn: '8h' }, (err, token) => {
                    res.status(200).json({ token, rows, response: true });
                });

            } else {
                res.status(400).json({ response: false, mensaje: 'Revisa tu clave y contraseña', err });
                console.log('USUARIO O CLAVE INCORRECTAS PAPI', err);
            }

        });
};
controller.verify = (req, res) => {
    verifyToken(req, res);
    console.log(req.data);
    res.json('INFORMACIÓN SECRETA PAPI NO SEA SAPO MIJO');
};
controller.currency = (req,res) => {s
    fetch("https://v6.exchangerate-api.com/v6/e1fb2a5953edbe689c1af854/latest/USD")
    .then(response => response.text())
    .then(result => {
        let a = 5* JSON.parse(result).conversion_rates.COP;
        res.status(200).json(a);
    })
    .catch(error => console.log('error', error));
};


function currency(req, res, next) {
    fetch("https://v6.exchangerate-api.com/v6/e1fb2a5953edbe689c1af854/latest/USD")
        .then(response => response.text())
        .then(result => {
            let a = JSON.parse(result).conversion_rates.COP
            req.data = a;
        })
        .catch(error => console.log('error', error));
}

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json('NO AUTORIZADO MK');
    } else {
        let token = req.headers.authorization.substr(7);
        if (token !== '') {
            const content = jwt.verify(token, 'DIEGO');
            req.data = content;
        } else {
            console.log("Algo anda mal");
        }
    }
}
function transaction(req, res) {
    if (!req.headers.authorization) {
        return res.status(401).json('NO AUTORIZADO MK');
    } else {
        let token = req.headers.authorization.substr(7);
        if (token !== '') {
            const content = jwt.verify(token, 'DIEGO');
            req.data = content;
        } else {
            console.log("Algo anda mal");
        }
    }
}
module.exports = controller;