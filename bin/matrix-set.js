#!/usr/bin/env node

require('./matrix-init');
var debug = debugLog('set');


Matrix.localization.init(Matrix.localesFolder, Matrix.config.locale, function() {

  if (!Matrix.pkgs.length || showTheHelp) {
    return displayHelp();
  }

  var locales = {
    "en": {
      name: "English"
    },
    "es": {
      name: "Spanish"
    }
  };

  var environments = require('../config/environments.js');

  if (Matrix.pkgs.indexOf('env') === 0) {

    var value = Matrix.pkgs[1];

    if (!_.isUndefined(value) && _.keys(environments).indexOf(value) !== -1) {

      Matrix.config.environment = _.assign(environments[value], { name: value });
      var keysToRemove = ['client', 'user', 'device', 'deviceMap'];
      Matrix.config = _.omit(Matrix.config, keysToRemove);

      Matrix.helpers.saveConfig(function() {
        console.log(t('matrix.set.env.env').grey + ':'.grey, Matrix.config.environment.name.green);
        // TODO: set-env [value] sets a environment on the Matrix
        process.exit();
      });
    } else {
      console.error(t('matrix.set.env.valid_environments') + ' = [ dev, rc, production ]'.yellow)
    }

  } else if (Matrix.pkgs.indexOf('locale') === 0) {

    var locale = Matrix.pkgs[1];
    if (_.isUndefined(locale)) {
      console.warn(t('matrix.set.locale.locale_required') + ': `matrix set locale <locale>` ')
      process.exit(0);
    } else {
      var localesRegExp = new RegExp(Object.keys(locales).join('|'));

      if (locale && locale.match(localesRegExp)) {
        Matrix.config.locale = _.assign(locale, { "name": locale });
        Matrix.helpers.saveConfig(function() {
          console.log(t('matrix.set.locale.locale').grey + ':'.grey, Matrix.config.locale.green);
          process.exit(0);
        });
      } else {
        var validLocales = Object.keys(locales).join(', ');
        console.error(t('matrix.set.locale.valid_locales') + ' = [ ' + validLocales + ' ]');
        process.exit(0);
      }
    }

  } else {
    displayHelp();
  }

  function displayHelp() {

    console.log('\n> matrix set ¬\n');
    console.log('\t         matrix set env (production|rc|dev) -', t('matrix.set.help_device').grey)
    console.log('\t         matrix set locale (es|en) -', t('matrix.set.help_locale').grey)
    console.log('\n')
    process.exit(1);
  }

});