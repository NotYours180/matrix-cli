#!/usr/bin/env node

require('./matrix-init');
var debug = debugLog('use');

Matrix.localization.init(Matrix.localesFolder, Matrix.config.locale, function () {

  if (!Matrix.pkgs.length || showTheHelp) {
    return displayHelp();
  }

  var target = Matrix.pkgs.join(' ');

  var targetDeviceId = _.findKey(Matrix.config.deviceMap, { name : target });

  var nameProvided = true;

  if ( _.isEmpty(targetDeviceId) ) {
    // not a name, must be a key?
    if ( _.has(Matrix.config.deviceMap, target)){
      targetDeviceId = target;
      nameProvided = false;
    } else {
      console.error(target.red, 'is not a device name or a device id')
      process.exit(1);
    }
  }


  // Matrix.firebaseInit(function () {
  //
  //   Matrix.firebase.user.checkDevice( target, function (err, deviceapps) {
  //     if (err) return console.error(err);
  //     if ( _.isNull(deviceapps)){
  //       return console.log('Device Not Attached to User Record');
  //     } else {
  //       Matrix.firebase.device.lookup( target, function(device){
  //         if (_.isNull(device)){
  //           return console.log('Device not in Devices Record, Exists in User Record')
  //         }
  //         console.log(device);
  //       })
  //     }
  //   })
  //
  // })
  //
  //
  Matrix.validate.user();

  // still API dependent, TODO: depreciate to firebase
  Matrix.api.device.register(targetDeviceId, function(err, state) {

    if (err) return console.log(err);
    if (state.status === "OK") {
      if ( !nameProvided ){
        target = Matrix.helpers.lookupDeviceName(target);
      }
      console.log('Now using device:'.grey, target, 'ID:'.grey, targetDeviceId);

      // Save the device token
      Matrix.config.device = {}
      Matrix.config.device.identifier = targetDeviceId;
      Matrix.config.device.token = state.results.device_token;
      Matrix.helpers.saveConfig(process.exit);

    } else {
      debug('Matrix Use Error Object:', state);
      if ( state.error === 'access_token not valid.' ) {
        console.log(t('matrix.use.not_authorized').red, '\n', t('matrix.use.invalid_token'), '. ' , t('matrix.use.try').grey, 'matrix login')
      } else {
        console.error('Error', state.status_code.red, state.error);
      }
    }

  });
});

  function displayHelp() {
    console.log('\n> matrix use ¬ \n');
    console.log('\t                 matrix use <deviceid> -', t('matrix.use.command_help').grey)
    console.log('\n')
  }
