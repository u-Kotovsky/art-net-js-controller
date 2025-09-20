const log4js = require('log4js')
const logger = log4js.getLogger('Web')
logger.level = log4js.levels.ALL;
logger.info('init')

const { activePatch } = require('../helpers/patch-helpers')

const hash = require('pbkdf2-password')
const path = require('node:path')
const session = require('express-session')
const express = require('express');

const webserver = express()

webserver.get('/api', (req, res) => {
    console.log(req.headers.api)

    switch (req.headers.api) {
        case 'user/panel':
            let arr = []

            for (let universe = 0; universe < activePatch.devices.length; universe++) {
                for (let i = 0; i < activePatch.devices[universe].length; i++) {
                    let device = activePatch.devices[universe][i]

                    console.log(device)

                    arr.push({
                        name: 'test slider',
                        textContent: `uni:${universe} i:${i} ${device.constructor.name}`,
                        min: 0,
                        max: 255,
                        value: 0,
                        step: 1,
                        path: `dmx512/${universe}/${i}/slider`
                    })
                }
            }

            res.send(JSON.stringify({
                buttons: [
                    {
                        name: 'test btn',
                        textContent: 'clear all',
                        path: 'test/button'
                    }
                ],
                sliders: arr
                /*[
                    {
                        name: 'test slider',
                        textContent: 'test slider',
                        min: 0,
                        max: 255,
                        value: 0,
                        step: 1,
                        path: 'test/slider'
                    }
                ]*/
            }))
            break;
    
        default:
            res.send('Hello World at /api')
            break;
    }
})

webserver.post('/api', (req, res) => {
    res.send('Got a POST request at /api')
})

webserver.put('/api', (req, res) => {
    res.send('Got a PUT request at /api')
})

webserver.delete('/api', (req, res) => {
    res.send('Got a DELETE request at /api')
})

webserver.use(express.static('webpanel/static'))
webserver.listen(3000)

// socket server
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 3030 })

wss.on('connection', (socket, request) => {
    logger.info(`${request.socket.remoteAddress} created connection`)

    socket.on('close', (code, reason) => {
        logger.info(`${request.socket.remoteAddress} closed connection ${code} ${reason}`)
    })
    socket.on('error', (error) => {
        logger.info(`${request.socket.remoteAddress} caused error`)
        logger.error(error)
    })
    socket.on('open', () => {
        logger.info(`${request.socket.remoteAddress} created connection`)
    })
    socket.on('message', (data, isBinary) => {
        try {
            const json = JSON.parse(data)
            logger.info(`${request.socket.remoteAddress} sent '${json.key}' packet`)
            console.log(json)
            switch (json.key) {
                case 'input':
                    switch (json.input.path) {
                        case 'test/slider':
                            logger.info(json.input.path, json.input.value)
                            break;
                    
                        default:
                            logger.error(`unknown path '${json.input.path}'`)
                            break;
                    }

                    break;
            
                default:
                    logger.error(`unknown key '${json.key}'`)
                    break;
            }
        } catch (error) {
            logger.error(error)
        }
    })
})

wss.on('error', (error) => {
    logger.error(error)
})
wss.on('listening', () => {
    logger.info(`websockerserver listening`)
})
wss.on('close', () => {
    logger.info('websocketserver stopped listening')
})