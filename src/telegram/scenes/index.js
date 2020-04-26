const Stage = require('telegraf/stage');

const connectionToGroup = require('./connectionToGroup');

const stage = new Stage();
stage.register(connectionToGroup.scene);

module.exports = {
  stage,
  stagesArray: [connectionToGroup],
};
