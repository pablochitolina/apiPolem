var Polem = require('../models/polem');
var DarkSky = require('dark-sky')
var forecast = new DarkSky('cd24c68a00eadd6e0235b8bc2c75d4cd')

var gmt = 1000 * 60 * 60 * 2; // CORRIGIR PARA PEGAR GMT -3 AUTOMÁTICO E COM HORARIO DE VERÃO

exports.getPrevModelo = function (req, res) {

    var previsaoArray = [];

    forecast
        .latitude('-28.26278')
        .longitude('-52.40667')
        .units('us')
        .language('pt')
        .exclude('minutely,hourly,alerts,flags')
        .extendHourly(true)
        .get()
        .then(function (previsao) {

            for (var dia in previsao.daily.data) {

                var ampC = ((previsao.daily.data[dia].temperatureMax - 32) / 1.8) - ((previsao.daily.data[dia].temperatureMin - 32) / 1.8);

                var previsaoDaily = {
                    data: String,
                    amplitude: Number
                }

                var date = new Date((previsao.daily.data[dia].time * 1000));

                previsaoDaily.amplitude = ampC;
                previsaoDaily.data = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

                previsaoArray.push(previsaoDaily);

            }

            Polem.findOne({ data: req.params.data }, function (err, polem) {
                if (err)
                    return res.json({ message: 'error', err: err });
                if (!polem)
                    return res.json({ message: 'success', numPolem: 0, previsao: previsaoArray });

                return res.json({ message: 'success', numPolem: polem.numPolem, previsao: previsaoArray });

            });

        })
        .catch(function (err) {
            return res.json({ message: 'error', err: err });
        })

};

exports.postPrevModelo = function (req, res) {

    var newPolem = new Polem({
        numPolem: req.body.numPolem,
        data: req.body.data
    });

    newPolem.save();

    return res.json({ message: 'postResultSuccess', polem: newPolem });

};

exports.getPrevPolem = function (req, res) {

    var previsaoArray = [];

    var milliseconds = (new Date).getTime();

    var index = 0;

    forecast
        .latitude('-28.26278')
        .longitude('-52.40667')
        .units('us')
        .language('pt')
        .exclude('minutely,hourly,alerts,flags')
        .extendHourly(true)
        .get()
        .then(function (previsao) {

            for (var dia in previsao.daily.data) {

                var date = new Date((previsao.daily.data[dia].time * 1000));
                var dataPrev = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();


                Polem.findOne({ data: dataPrev }, function (err, polem) {
                    if (err)
                        return res.json({ message: 'error', err: err });

                    var previsaoDaily = {
                        data: String,
                        tempMax: Number,
                        tempMin: Number,
                        umidade: Number,
                        numPolem: Number
                    }

                    if (!polem)
                        previsaoDaily.numPolem = 0;

                    var dateArr = new Date((previsao.daily.data[index].time * 1000));

                    previsaoDaily.data = dateArr.getFullYear() + "-" + (dateArr.getMonth() + 1) + "-" + dateArr.getDate();;
                    previsaoDaily.numPolem = polem.numPolem;

                    if (index == 0) {
                        previsaoDaily.tempMax = (previsao.currently.temperature - 32) / 1.8;
                        previsaoDaily.tempMin = (previsao.currently.temperature - 32) / 1.8;
                        previsaoDaily.umidade = previsao.currently.humidity;
                    } else {
                        previsaoDaily.tempMax = (previsao.daily.data[index].temperatureMax - 32) / 1.8;
                        previsaoDaily.tempMin = (previsao.daily.data[index].temperatureMin - 32) / 1.8;
                        previsaoDaily.umidade = previsao.daily.data[index].humidity;
                    }

                    previsaoArray.push(previsaoDaily);

                    index++;

                    if (index == (previsao.daily.data.length)) {
                        return res.json({ message: 'success', previsao: previsaoArray });
                    }



                });

                milliseconds += (1000 * 60 * 60 * 24);
                //console.log(previsao.daily.data[dia])
            }



        })
        .catch(function (err) {
            return res.json({ message: 'error', err: err });
        })

};

exports.postImg = function (req, res) {

    var nome = 'grafico.png';

    fs.writeFile('uploads/' + nome, req.body.grafico, 'base64', function (err) {
        if (err)
            return res.json({ message: 'postImgErr', 'erro': err });

        return res.json({ message: 'postImgSuccess' });
    });

};

exports.getImagem = function (req, res) {

    var options = {
        root: __dirname + '/../uploads/'
    };

    var fileName = req.params.imagename;
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }

    });

};