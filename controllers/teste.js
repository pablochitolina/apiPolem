var Teste = require('../models/teste');
var UserAdmin = require('../models/useradmin');

exports.postTeste = function (req, res) {

  UserAdmin.findOne({ email: req.body.email }, function (err, userSeguro) {
    if (err)
      return res.send(err);
    if (!userSeguro)
      return res.json({ message: 'notauthorized' });

    if (userSeguro.id === req.body.id) {

      Teste.findOne({ nomeTeste: req.body.nomeTeste }, function (err, teste) {
        if (err)
          return res.send(err);

        if (!teste) {

          var newTeste = new Teste({
            nomeTeste: req.body.nomeTeste,
            pergunta: req.body.pergunta,
            resumo: req.body.resumo,
            respostas: [{
              desc1: req.body.desc1,
              desc2: req.body.desc2,
              desc3: req.body.desc3,
              desc4: req.body.desc4
            }]
          });

          newTeste.save(function (err) {
            if (err)
              return res.send(err);
            return res.json({ message: 'postNovoTesteSuccess', teste: newTeste });
          });

        } else {

          teste.respostas.push({
            desc1: req.body.desc1,
            desc2: req.body.desc2,
            desc3: req.body.desc3,
            desc4: req.body.desc4
          });

          teste.save();

          return res.json({ message: 'postAddTesteSuccess', teste: teste });

        }

      });

    } else {
      return res.json({ message: 'notauthorized' });
    }

  });

};

exports.putTeste = function (req, res) {

  UserAdmin.findOne({ email: req.body.email }, function (err, userSeguro) {
    if (err)
      return res.send(err);
    if (!userSeguro)
      return res.json({ message: 'notauthorized' });

    if (userSeguro.id === req.body.id) {

      Teste.findById(req.body.idteste, function (err, teste) {
        if (err)
          return res.send(err);
        if (!teste)
          return res.json({ message: 'noteste' });

        //servico.email = req.body.email;//apenas em DEV, PRD não muda email
        //teste.nomeTeste = req.body.nomeTeste;
        teste.pergunta = req.body.pergunta;
        teste.resumo = req.body.resumo;
        teste.save();

        res.json({ message: 'putTesteSuccess', teste: teste });

      });

    } else {
      return res.json({ message: 'notauthorized' });
    }

  });

};


exports.putTesteDesc = function (req, res) {

  UserAdmin.findOne({ email: req.body.email }, function (err, userSeguro) {
    if (err)
      return res.send(err);
    if (!userSeguro)
      return res.json({ message: 'notauthorized' });

    if (userSeguro.id === req.body.id) {

      Teste.findOneAndUpdate(
        { nomeTeste: req.body.nomeTeste, 'respostas._id': req.body.idResposta },
        {
          "$set": {
            "respostas.$.desc1": req.body.desc1,
            "respostas.$.desc2": req.body.desc2,
            "respostas.$.desc3": req.body.desc3,
            "respostas.$.desc4": req.body.desc4
          }
        }, { new: true },
        function (err, doc) {
          if (err)
            return res.send(err);
          //console.log(doc)
          return res.send(doc);
        }
      );

    } else {
      return res.json({ message: 'notauthorized' });
    }

  });

};

exports.getTestesMostrar = function (req, res) {

  Teste.find({}).select('nomeTeste').select('pergunta').select('resumo').exec(function (err, testes) {
    if (err)
      return res.send(err);
    if (testes.length == 0)
      return res.json({ message: 'noteste' });
    // Success
    return res.json({ message: 'success', testes: testes });

  });

};


exports.getTestes = function (req, res) {

  UserAdmin.findOne({ email: req.headers.email }, function (err, userSeguro) {
    if (err)
      return res.send(err);
    if (!userSeguro)
      return res.json({ message: 'notauthorized' });

    if (userSeguro.id === req.headers.id) {

      Teste.find({}, function (err, testes) {
        if (err)
          return res.send(err);
        if (testes.length == 0)
          return res.json({ message: 'noteste' });
        // Success
        return res.json({ message: 'success', testes: testes });

      });

    } else {
      return res.json({ message: 'notauthorized' });
    }

  });

};

exports.getTestePergunta = function (req, res) {

  Teste.findOne({ nomeTeste: req.headers.nome }).select('pergunta').select('resumo').select('nomeTeste').exec(function (err, teste) {
    if (err)
      return res.send(err);
    if (!teste)
      return res.json({ message: 'noteste' });
    // Success
    return res.json({ message: 'success', teste: teste });

  });

};

/*
exports.getResult = function (req, res) {

  User.findOne({ id: req.body.id }).select('testes').exec(function (err, testes) {
    if (err)
      return res.send(err);
    if (testes.length == 0)
      return res.json({ result: 0 });

    var teste = JSON.parse(JSON.stringify(testes))

    var cont = 0;
    for (var key in teste.testes) {
      if (teste.testes[key].tipo === req.body.tipoTeste) {
        cont++;
      }

    }

    return res.json({ result: cont });

  });



};*/