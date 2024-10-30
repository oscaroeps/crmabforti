var Cliente = require('../models/Cliente');
var Matricula = require('../models/Matricula');
var Encuesta_satisfaccion = require('../models/Encuesta_satisfaccion');
var bcrypt = require('bcrypt-nodejs');
var jwt_cliente = require('../helpers/jwt-cliente')
var jwt = require('jwt-simple');
var moment = require('moment');
var Matricula_detalle = require('../models/Matricula_detalle');
var Comentario_matricula = require('../models/Comentario_matricula');

var fs = require('fs');
var handlebars = require('handlebars');
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var path = require('path');


const registro_cliente_admin = async function (req, res) {

    if (req.user) {
        let data = req.body;

        try {

            // Si no se requiere el email, no validamos si ya existe
            //var clientes = await Cliente.find({ email: data.email });

            // Verifica si los campos nombres o apellidos no vienen en el request y los define como vacíos
            data.nombres = data.nombres || ''; // Si no existe, será una cadena vacía
            data.apellidos = data.apellidos || ''; // Si no existe, será una cadena vacía

            // Asigna el tipo como "Socio"
            data.tipo = 'Socio';

            bcrypt.hash('123456789', null, null, async function (err, hash) {
                if (err) {
                    res.status(200).send({ data: undefined, message: 'No se pudo generar la contraseña.' });
                } else {
                    // Eliminamos la validación del correo
                    //if (clientes.length >= 1) {
                    //    res.status(200).send({ data: undefined, message: 'El correo electrónico ya existe.' });
                    //} else {
                    data.fullnames = data.nombres + ' ' + data.apellidos;
                    data.password = hash;
                    let cliente = await Cliente.create(data);

                    // Comentar la función de envío de correo de verificación
                    // enviar_correo_verificacion(cliente.email);
                    res.status(200).send({ data: cliente });
                    //}
                }
            });

        } catch (error) {
            console.log(error);
            res.status(200).send({ data: undefined, message: 'Verifique los campos del formulario.' });
        }
    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const registro_prospecto_admin = async function (req, res) {

    if (req.user) {
        let data = req.body;

        try {

            // Si no se requiere el email, no validamos si ya existe
            //var clientes = await Cliente.find({ email: data.email });

            // Verifica si los campos nombres o apellidos no vienen en el request y los define como vacíos
            data.nombres = data.nombres || ''; // Si no existe, será una cadena vacía
            data.apellidos = data.apellidos || ''; // Si no existe, será una cadena vacía

            // Asigna el tipo como "Socio"
            data.tipo = 'Prospecto';

            bcrypt.hash('123456789', null, null, async function (err, hash) {
                if (err) {
                    res.status(200).send({ data: undefined, message: 'No se pudo generar la contraseña.' });
                } else {
                    // Eliminamos la validación del correo
                    //if (clientes.length >= 1) {
                    //    res.status(200).send({ data: undefined, message: 'El correo electrónico ya existe.' });
                    //} else {
                    data.fullnames = data.nombres + ' ' + data.apellidos;
                    data.password = hash;
                    let cliente = await Cliente.create(data);

                    // Comentar la función de envío de correo de verificación
                    // enviar_correo_verificacion(cliente.email);
                    res.status(200).send({ data: cliente });
                    //}
                }
            });

        } catch (error) {
            console.log(error);
            res.status(200).send({ data: undefined, message: 'Verifique los campos del formulario.' });
        }
    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }

}

const validar_correo_verificacion = async function (req, res) {
    var token_params = req.params['token'];
    var token = token_params.replace(/['"]+/g, '');

    var segment = token.split('.');


    if (segment.length != 3) {
        return res.status(403).send({ message: 'InvalidToken' });
    } else {
        try {
            var payload = jwt.decode(token, 'oscar2024');
            await Cliente.findByIdAndUpdate({ _id: payload.sub }, {
                verify: true
            });
            res.status(200).send({ data: true });
        } catch (error) {
            console.log(error);
            return res.status(200).send({ message: 'El correo de verificación expiró', data: undefined });
        }
    }

}

const listar_clientes_admin = async function (req, res) {
    if (req.user) {
        let filtro = req.params['filtro'];

        let clientes;
        if (filtro && filtro !== 'null') {
            // Si hay filtro, busca por nombres, apellidos, etc.
            clientes = await Cliente.find({
                $or: [
                    { nombres: new RegExp(filtro, 'i') },
                    { apellidos: new RegExp(filtro, 'i') },
                    { n_doc: new RegExp(filtro, 'i') },
                    { email: new RegExp(filtro, 'i') },
                    { telefono: new RegExp(filtro, 'i') },
                    { fullnames: new RegExp(filtro, 'i') },
                    { tipo: new RegExp(filtro, 'i') }
                ]
            }).populate('asesor');
        } else {
            // Si no hay filtro, devuelve todos los clientes
            clientes = await Cliente.find().populate('asesor');
        }

        res.status(200).send({ data: clientes });
    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
};


const obtener_datos_cliente_admin = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];

        try {
            let cliente = await Cliente.findById({ _id: id }).populate('asesor');
            res.status(200).send({ data: cliente });
        } catch (error) {
            res.status(200).send({ data: undefined });
        }

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const editar_cliente_admin = async function (req, res) {

    if (req.user) {
        let id = req.params['id'];
        let data = req.body;

        // Asegurar que nombres y apellidos tengan un valor, aunque sea vacío
        data.nombres = data.nombres || '';
        data.apellidos = data.apellidos || '';

        // Actualizamos el cliente
        let cliente = await Cliente.findByIdAndUpdate(
            { _id: id },
            {
                nombres: data.nombres,
                apellidos: data.apellidos,
                fullnames: data.nombres + ' ' + data.apellidos,
                genero: data.genero,
                email: data.email,
                telefono: data.telefono,
                n_doc: data.n_doc,
                pais: data.pais,
                ciudad: data.ciudad,
                nacimiento: data.nacimiento
            },
            { new: true } // Retorna el documento actualizado
        );

        res.status(200).send({ data: cliente });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}


const listar_clientes_modal_admin = async function (req, res) {
    if (req.user) {
        let filtro = req.params['filtro'];
        let clientes = await Cliente.find({
            $or: [
                { nombres: new RegExp(filtro, 'i') },
                { apellidos: new RegExp(filtro, 'i') },
                { n_doc: new RegExp(filtro, 'i') },
                { email: new RegExp(filtro, 'i') },
                { fullnames: new RegExp(filtro, 'i') }
            ]
        }).select('_id fullnames nombres apellidos email verify tipo');
        res.status(200).send({ data: clientes });
    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const cambiar_estado_cliente_admin = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];
        let data = req.body;

        let nuevo_estado;

        if (data.estado) {
            nuevo_estado = false;
        } else if (!data.estado) {
            nuevo_estado = true;
        }

        let cliente = await Cliente.findByIdAndUpdate({ _id: id }, {
            estado: nuevo_estado
        });

        res.status(200).send({ data: cliente });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const cambiar_isDeleted_cliente_admin = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];
        let data = req.body;

        // Establece un valor predeterminado en caso de que isDeleted no esté en el cliente
        let nuevo_isDeleted = (data.isDeleted === undefined) ? true : !data.isDeleted;

        // Actualiza el cliente
        let cliente = await Cliente.findByIdAndUpdate(
            { _id: id },
            { isDeleted: nuevo_isDeleted },
            { new: true } // Esta opción devuelve el documento actualizado
        );

        res.status(200).send({ data: cliente, nombre: cliente.nombres });
    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const cambiar_tipo_cliente_admin = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];
        let data = req.body;

        let nuevo_tipo;

        if (data.tipo == 'Prospecto') {
            nuevo_tipo = 'Socio';
        } else if (data.tipo == 'Socio') {
            nuevo_tipo = 'Prospecto';
        }

        let cliente = await Cliente.findByIdAndUpdate({ _id: id }, {
            tipo: nuevo_tipo
        });

        res.status(200).send({ data: cliente });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const generar_token_encuesta_admin = async function (req, res) {
    if (req.user) {

        let matricula = req.params['matricula'];
        let cliente = req.params['cliente'];

        var payload = {
            matricula: matricula,
            cliente: cliente,
            iat: moment().unix(),
            exp: moment().add(1, 'day').unix(),
        }

        let token = jwt.encode(payload, 'CmfnizgojM7D9T78bkcRiAI22LvS0le');

        res.status(200).send({ token: token });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const enviar_encuesta_admin = async function (req, res) {
    let data = req.body;

    let cliente;
    let matricula;

    try {
        cliente = await Cliente.findById({ _id: data.cliente });
    } catch (error) {
        res.status(200).send({ data: undefined, message: 'El código del cliente no existe' });
    }

    try {
        matricula = await Matricula.findById({ _id: data.matricula });
        data.asesor = matricula.asesor;
    } catch (error) {
        res.status(200).send({ data: undefined, message: 'El código del contrato de servicio no existe' });
    }

    let encuestas = await Encuesta_satisfaccion.find({ cliente: cliente._id, matricula: matricula._id });

    if (encuestas.length == 0) {
        let encuesta = await Encuesta_satisfaccion.create(data);
        await Matricula.findByIdAndUpdate({ _id: matricula._id }, {
            encuesta: true
        });
        generar_actividad_matricula(matricula._id, 'El cliente completó la encuesta.');
        res.status(200).send({ data: encuesta });
    } else {
        res.status(200).send({ data: undefined, message: 'Ya se envió la encuesta del contrato de servicio.' });
    }

}

const obtener_encuesta_cliente_admin = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];

        try {
            let encuesta = await Encuesta_satisfaccion.findOne({ matricula: id });
            res.status(200).send({ data: encuesta });
        } catch (error) {
            res.status(200).send({ data: undefined });
        }

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

//////////////////////////////////////////////////////////////////

// Comentar la función de envío de correo de verificación
const enviar_correo_verificacion = async function (email) {
    var readHTMLFile = function (path, callback) {
        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'oscaroeps30@gmail.com',
            name: 'muestra',
            pass: 'ydqbvvvvyykojfst'

        }
    }));

    //OBTENER CLIENTE
    var cliente = await Cliente.findOne({ email: email });
    var token = jwt_cliente.createToken(cliente);

    readHTMLFile(process.cwd() + '/mails/account_verify.html', (err, html) => {

        let rest_html = ejs.render(html, { token: token });

        var template = handlebars.compile(rest_html);
        var htmlToSend = template({ op: true });

        var mailOptions = {
            from: 'oscaroeps30@gmail.com',
            to: email,
            subject: 'Verificación de cuenta',
            html: htmlToSend
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (!error) {
                console.log('Email sent: ' + info.response);
            }
        });

    });
}

const generar_actividad_matricula = async function (matricula, actividad) {
    await Comentario_matricula.create({
        matricula: matricula,
        actividad: actividad
    })
}

module.exports = {
    registro_cliente_admin,
    registro_prospecto_admin,
    validar_correo_verificacion,
    listar_clientes_admin,
    obtener_datos_cliente_admin,
    editar_cliente_admin,
    listar_clientes_modal_admin,
    cambiar_estado_cliente_admin,
    cambiar_isDeleted_cliente_admin,
    cambiar_tipo_cliente_admin,
    generar_token_encuesta_admin,
    enviar_encuesta_admin,
    obtener_encuesta_cliente_admin
}