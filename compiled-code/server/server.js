/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./source-code/server/server-websocket.service.ts":
/*!********************************************************!*\
  !*** ./source-code/server/server-websocket.service.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const socketio = __webpack_require__(/*! socket.io */ "socket.io");
class ServerWebsocketService {
    constructor(port) {
        this.connectedPlayers = [];
        this.websocketServer = socketio.listen(port);
        this.websocketServer.on("connection", (socket) => {
            console.log('connection');
            socket.on('client to server', (clientToServer) => this.event(clientToServer, socket));
            socket.on('disconnect', (reason) => {
                console.log('reason :', reason);
                const disconnectingPlayer = this.connectedPlayers.find((player) => player.socket.id == socket.id);
                if (disconnectingPlayer) {
                    this.removePlayer(disconnectingPlayer);
                }
                else {
                    console.log('now that does not make sense');
                }
            });
        });
    }
    event(clientToServer, socket) {
        switch (clientToServer.name) {
            case 'connect': {
                this.handleConnect(clientToServer, socket);
            }
        }
    }
    removePlayer(disconnectingPlayer) {
        this.connectedPlayers = this.connectedPlayers.filter((connectedPlayer) => connectedPlayer.socket.id != disconnectingPlayer.socket.id);
        this.broadcastUpdatedConnectedPlayers();
    }
    handleConnect(clientToServer, socket) {
        console.log('its bout time client connected to server');
        let player;
        let clientPlayer = clientToServer.data;
        let foundPlayer = this.connectedPlayers.find(player => player.name == clientPlayer.name);
        if (foundPlayer) {
            foundPlayer = Object.assign({}, foundPlayer, { name: clientPlayer.name, socket: socket, connected: true });
            player = foundPlayer;
        }
        else {
            const newPlayer = {
                name: clientPlayer.name,
                socket: socket,
                connected: true,
                clientId: clientToServer.clientId,
                gameId: null
            };
            this.connectedPlayers.push(newPlayer);
            player = newPlayer;
        }
        this.sendToClient(player, { name: 'player connected', transactionId: clientToServer.transactionId });
        this.broadcastUpdatedConnectedPlayers();
    }
    sendToClient(player, serverToClient) {
        player.socket.emit('server to client', serverToClient);
    }
    broadcastUpdatedConnectedPlayers() {
        const updateForAllClients = {
            name: 'connected players update',
            data: [...this.connectedPlayers].map(this.convertToClientPlayer)
        };
        this.updateAllClients(updateForAllClients);
    }
    updateAllClients(serverToClient) {
        this.connectedPlayers.forEach((player) => {
            player.socket.emit('server to client', serverToClient);
        });
    }
    convertToClientPlayer(serverPlayer) {
        const player = {
            name: serverPlayer.name,
            connected: serverPlayer.connected,
            clientId: serverPlayer.clientId,
            gameId: serverPlayer.gameId
        };
        return player;
    }
}
exports.default = ServerWebsocketService;


/***/ }),

/***/ "./source-code/server/server.ts":
/*!**************************************!*\
  !*** ./source-code/server/server.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const server_websocket_service_1 = __webpack_require__(/*! ./server-websocket.service */ "./source-code/server/server-websocket.service.ts");
const express = __webpack_require__(/*! express */ "express");
console.clear();
const app = express();
const serverPort = 4444;
const websocketPort = 69;
app.use(express.static('compiled-code/client'));
app.listen(serverPort, () => console.log('server listening on port ' + serverPort));
new server_websocket_service_1.default(websocketPort);


/***/ }),

/***/ 0:
/*!********************************************!*\
  !*** multi ./source-code/server/server.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./source-code/server/server.ts */"./source-code/server/server.ts");


/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ })

/******/ });
//# sourceMappingURL=server.js.map