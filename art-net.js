const artnet = require('artnet-protocol')
const log4js = require('log4js')

const hard_data_limit = 512;

class Art_Net {
    logger = log4js.getLogger('Art-Net')
    controller = new artnet.ArtNetController();

    constructor(address = '0.0.0.0') {
        this.logger.level = log4js.levels.ALL;
        this.logger.info('artnet init')
        this.controller.bind(address);
    }

    set(_universe, _data) {
        if (_data.length != hard_data_limit) 
            this.logger.error(`data length is not ${hard_data_limit}, value is '${_data.length}'`)
        this.controller.sendBroadcastPacket(new artnet.protocol.ArtDmx(0, 0, _universe, _data));
    }
}

module.exports = { Art_Net }