var UserAdmin = require('../models/useradmin');
var OfertasLomadee = require('../models/ofertaslomadee');

exports.postOfertasLomadee = function (req, res) {

    UserAdmin.findOne({ email: req.body.email }, function (err, userSeguro) {
        if (err)
            return res.send(err);
        if (!userSeguro)
            return res.json({ message: 'notauthorized' });

        if (userSeguro.id === req.body.id) {

            OfertasLomadee.findOne({ nome: req.body.nome }, function (err, oferta) {
                if (err)
                    return res.send(err);
                if (!oferta) {

                    var ofertaNew = new OfertasLomadee({

                        link: req.body.link,
                        nome: req.body.nome

                    });

                    ofertaNew.save(function (err) {
                        if (err)
                            return res.send(err);
                        return res.json({ message: 'postOfertaSuccess', ofertaNew: ofertaNew });
                    });

                } else {
                    oferta.link = req.body.link;

                    oferta.save(function (err) {
                        if (err)
                            return res.send(err);
                        return res.json({ message: 'editOfertaSuccess', oferta: oferta });
                    });
                }

            });

        } else {
            return res.json({ message: 'notauthorized' });
        }

    });

};

exports.getOfertasLomadee = function (req, res) {

    OfertasLomadee.find({}, function (err, ofertas) {
        if (err)
            return res.send(err);

        return res.json({ message: 'success', ofertas: ofertas });

    });

};