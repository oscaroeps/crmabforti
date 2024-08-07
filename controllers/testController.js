const prueba_test = async function (req, res) {
    res.status(200).send({ message: 'HOLA TEST' });
}

const verificar_token = async function (req, res) {
    if (req.user) {

        res.status(200).send({ data: true });
    } else {
        res.status(403).send({ data: false });
    }
}

module.exports = {
    prueba_test,
    verificar_token
}