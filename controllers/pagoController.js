var Matricula = require('../models/Matricula');
var Pago = require('../models/Pago');
var Matricula_detalle = require('../models/Matricula_detalle');
var Comentario_matricula = require('../models/Comentario_matricula');

const obtener_matricula_pagos_admin = async function (req, res) {
    if (req.user) {

        let id = req.params['id'];

        try {

            let pagos = await Pago.find({ matricula: id }).populate({
                path: 'matricula_detalle',
                populate: {
                    path: 'curso'
                }
            });

            res.status(200).send({ data: pagos });
        } catch (error) {
            res.status(200).send({ data: undefined });
        }


    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

//Este código al parecer tiene un problema, pero hay que revisarlo en caso de que se quiera implementar en un futuro,
//El problema es que el campo correlativo no aumenta de manera secuencial
/* const crear_pago_admin = async function (req, res) {
    if (req.user) {

        let data = req.body;

        data.asesor = req.user.sub;
        data.estado = 'Aprobado';

        if (data.destino_pago != 'Matricula') {
            data.matricula_detalle = data.destino_pago;
        }

        let pagos = await Pago.find().sort({ createdAt: -1 });

        if (pagos.length == 0) {
            data.correlativo = 1;
            let pago = await Pago.create(data);
            res.status(200).send({ data: pago });
        } else {
            //
            let last_correlativo = pagos[0].correlativo;
            data.correlativo = last_correlativo + 1;
            let pago = await Pago.create(data);
            res.status(200).send({ data: pago });
        }

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
} */

const crear_pago_admin = async function (req, res) {
    if (req.user) {
        let data = req.body;
        data.asesor = req.user.sub;
        data.estado = 'Aprobado';

        if (data.destino_pago != 'Matricula') {
            data.matricula_detalle = data.destino_pago;
        }

        try {
            let pago = await Pago.findOneAndUpdate(
                {},
                { $inc: { correlativo: 1 } },
                { new: true, upsert: true, sort: { correlativo: -1 } }
            );
            data.correlativo = pago.correlativo;

            let newPago = await Pago.create(data);
            generar_actividad_matricula(data.matricula, 'Se generó un pago de ' + data.monto);
            res.status(200).send({ data: newPago });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const generar_actividad_matricula = async function (matricula, actividad) {
    await Comentario_matricula.create({
        matricula: matricula,
        actividad: actividad
    })
}

module.exports = {
    obtener_matricula_pagos_admin,
    crear_pago_admin
}