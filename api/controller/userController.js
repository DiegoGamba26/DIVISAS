const { query } = require('express');
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
        name, last_name,nationality, date_birth, document,
        gender, email, num, pass
    } = req.body;
    mysqlConnection.query('INSERT INTO users SET name =?,last_name=?, nationality=?,date_birth=?,document=?,gender=?, email=?, num=?, pass=?', [name, last_name,nationality, date_birth, document, gender, email, num, pass], (err, rows, fields) => {
        if (!err) {
            res.status(200).json("Correcto calvo");
        } else {
            res.status(400).json('HUBO UN ERROR PAPU', err);
        }
    });
};
controller.topUpBalance = (req, res) => {
    const { document } = req.params;
    const { balance,bank } = req.body;
    mysqlConnection.query('SELECT balance FROM users WHERE document =?', [document],
        (err, rows, fields) => {
            if (!err) {
                let result = rows[0]["balance"];
                mysqlConnection.query('UPDATE users set balance = ? WHERE document =?', [balance + result, document],
                    (err, rows, fields) => {
                        if (!err) {
                            mysqlConnection.query('SELECT * FROM users WHERE document =? ', [document],
                                (err, rows, fields) => {
                                    if (!err) {
                                        /* console.log(rows);*/
                                        let name = rows[0]["name"];
                                        let last_name = rows[0]["last_name"];
                                        let country = rows[0]["nationality"];
                                        let id_transaction = rows[0]["id"];
                                        /*console.log(id_transaction);*/
                                        let type = "ENTRADA";
                                        mysqlConnection.query('INSERT INTO transactions set name=?,last_name=?,nationality=?,type=?, amount = ?, document=?, bank=?,id=?', [name, last_name, country, type, balance, document,bank, id_transaction],
                                            (err, rows, fields) => {
                                                if (!err) {
                                                    res.status(200).json("Correcto calvo");
                                                } else {
                                                    console.log('OCURRIÓ UN ERROR EN LA CONSULTA PÁ', err);
                                                }
                                            });
                                    } else {
                                        console.log('OCURRIÓ UN ERROR EN LA CONSULTA PÁ', err);
                                    }
                                });
                        } else {
                            console.log('OCURRIÓ UN ERROR EN LA CONSULTA PÁ', err);
                        }
                    });
            } else {
                console.log('OCURRIÓ UN ERROR EN LA CONSULTA PÁ', err);
            }

        });
};
controller.login = (req, res) => {
    const { email, pass } = req.body;
    mysqlConnection.query('SELECT id,rol,name,last_name FROM users WHERE email =? and pass=?', [email, pass],
        (err, rows, fields) => {
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
    res.json('INFORMACIÓN SECRETA PAPI NO SEA SAPO MIJO');
};
controller.currency = (req, res) => {
    fetch("https://v6.exchangerate-api.com/v6/e1fb2a5953edbe689c1af854/latest/USD")
        .then(response => response.text())
        .then(result => {
            let a = JSON.parse(result).conversion_rates.COP;
            res.status(200).json(a);
        })
        .catch(error => console.log('error', error));
};

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

module.exports = controller;