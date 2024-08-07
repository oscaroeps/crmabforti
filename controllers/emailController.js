const SibApiV3Sdk = require('sib-api-v3-sdk');
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

const obtener_listas_contactos = async function (req, res) {
    if (req.user) {

        let apiInstance = new SibApiV3Sdk.ContactsApi();

        let opts = {
            'limit': 10,
            'offset': 0
        };
        apiInstance.getLists(opts).then((data) => {
            res.status(200).send({ data: data });
        }, (error) => {
            res.status(200).send({ data: undefined, error: error.response.text });
        });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const registrar_lista_contacto = async function (req, res) {
    if (req.user) {

        let data = req.body;

        let apiInstance = new SibApiV3Sdk.ContactsApi();

        let createList = new SibApiV3Sdk.CreateList();

        createList.name = data.titulo;
        createList.folderId = 1;

        apiInstance.createList(createList).then((data) => {
            res.status(200).send({ data: data });
        }, (error) => {
            res.status(200).send({ data: undefined, error: error.response.text });
        });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const importar_contactos = async function (req, res) {
    if (req.user) {

        let data = req.body;
        let apiInstance = new SibApiV3Sdk.ContactsApi();

        let requestContactImport = new SibApiV3Sdk.RequestContactImport();

        let arr_list = [];
        arr_list.push(data.idlist);

        requestContactImport.fileBody = data.str_import;
        requestContactImport.listIds = arr_list;
        requestContactImport.emailBlacklist = false;
        requestContactImport.smsBlacklist = false;
        requestContactImport.updateExistingContacts = true;
        requestContactImport.emptyContactsAttributes = false;

        apiInstance.importContacts(requestContactImport).then(function (data) {
            res.status(200).send({ data: data });
        }, function (error) {
            res.status(200).send({ data: undefined, error: error.response.text });
        });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const obtener_contactos_lista = async function (req, res) {
    if (req.user) {

        let id = req.params['id'];

        let apiInstance = new SibApiV3Sdk.ContactsApi();

        let listId = id;

        let opts = {
            'limit': 500,
            'offset': 0
        };
        apiInstance.getContactsFromList(listId, opts).then(function (data) {
            res.status(200).send({ data: data });
        }, function (error) {
            res.status(200).send({ data: undefined, error: error.response.text });
        });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const eliminar_lista_contacto = async function (req, res) {
    if (req.user) {

        let id = req.params['id'];

        let apiInstance = new SibApiV3Sdk.ContactsApi();

        let listId = id;

        apiInstance.deleteList(listId).then(function () {
            res.status(200).send({ data: true });
        }, function (error) {
            res.status(200).send({ data: undefined, error: error.response.text });
        });
    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const obtener_campaigns = async function (req, res) {
    if (req.user) {

        let apiInstance = new SibApiV3Sdk.EmailCampaignsApi();

        let opts = {
            'type': "classic",
            'limit': 100,
            'offset': 0
        };
        apiInstance.getEmailCampaigns(opts).then(function (data) {
            res.status(200).send({ data: data });
        }, function (error) {
            res.status(200).send({ data: undefined, error: error.response.text });
        });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const crear_campaing = async function (req, res) {
    if (req.user) {

        let data = req.body;

        let apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
        let emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();

        let arr_list = [];
        arr_list.push(parseInt(data.listid));

        emailCampaigns = {
            tag: 'Practica',
            sender: { name: 'Oscar', email: 'oscaroeps30@gmail.com' },
            name: data.name,
            subject: data.subject,
            htmlContent: data.html_content,
            replyTo: 'oscaroeps30@gmail.com',
            recipients: { listIds: arr_list },
            inlineImageActivation: false,
            mirrorActive: false,
            recurring: false,
            type: 'classic',
        }
        apiInstance.createEmailCampaign(emailCampaigns).then(function (data) {
            res.status(200).send({ data: data });
        }, function (error) {
            res.status(200).send({ data: undefined, error: error.response.text });
        });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

const send_email_campaign = async function (req, res) {
    if (req.user) {

        let id = req.body.id;

        let apiInstance = new SibApiV3Sdk.EmailCampaignsApi();

        let campaignId = id;

        apiInstance.sendEmailCampaignNow(campaignId).then(function () {
            res.status(200).send({ data: true });
        }, function (error) {
            res.status(200).send({ data: undefined, error: error.response.text });
        });

    } else {
        res.status(403).send({ data: undefined, message: 'NoToken' });
    }
}

module.exports = {
    obtener_listas_contactos,
    registrar_lista_contacto,
    importar_contactos,
    obtener_contactos_lista,
    eliminar_lista_contacto,
    obtener_campaigns,
    crear_campaing,
    send_email_campaign
}