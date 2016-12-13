var Polem = require('../models/polem');
var DarkSky = require('dark-sky')
var forecast = new DarkSky('cd24c68a00eadd6e0235b8bc2c75d4cd')

var gmt = 1000 * 60 * 60 * 2; // CORRIGIR PARA PEGAR GMT -3 AUTOMÁTICO E COM HORARIO DE VERÃO

exports.getPrevModelo = function (req, res) {

    var previsaoArray = [];

    var milliseconds = (new Date).getTime();

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

                var date = new Date(milliseconds);

                previsaoDaily.amplitude = ampC;
                previsaoDaily.data = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

                previsaoArray.push(previsaoDaily);

                milliseconds += (1000 * 60 * 60 * 24);
                //console.log(previsao.daily.data[dia])
            }

            Polem.findOne({ data: req.params.data }, function (err, polem) {
                if (err)
                    return res.json({ message: 'error', err: err });
                if (polem) {
                    return res.json({ message: 'success', numPolem: polem.numPolem, previsao: previsaoArray });
                } else {
                    return res.json({ message: 'success', numPolem: 0, previsao: previsaoArray });
                }
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