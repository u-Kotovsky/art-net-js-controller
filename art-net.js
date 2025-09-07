const artnet = require('artnet-protocol')
const log4js = require('log4js')

class Art_Net {
    logger = log4js.getLogger('Art-Net')
    controller = new artnet.ArtNetController();

    data = []

    constructor() {
        this.logger.level = log4js.levels.ALL;
        this.logger.info('artnet init')

        this.controller.bind('0.0.0.0');
    }

    set(_universe, _data) {
        //this.logger.info(`set(${_universe} ${_data}`)
        if (_data.length != 512) {
            this.logger.error(`data length is not 512 '${_data.length}'`)
        }
        this.controller.sendBroadcastPacket(new artnet.protocol.ArtDmx(0, 0, _universe, _data));
    }
}

module.exports = { Art_Net }