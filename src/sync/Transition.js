const EventEmitter = require('events')
const localID = require('../common/local-id')

class Transition {
    constructor (id) {
        this._id = id || localID.getID()
        this._events = new EventEmitter()
        this._stage = null
    }

    get id () {
        return this._id
    }

    get events () {
        return this._events
    }

    get stage () {
        return this._stage
    }

    set stage (value) {
        this._stage = value
    }

    /**
     * Renvoie la vérité de la transition
     * @returns {boolean|Promise<boolean>}
     */
    isTrue (oContext = {}) {
        let bResult = false
        const oEvent = {
            context: oContext,
            result: b => {
                bResult = b
            }
        }
        this._events.emit('test', oEvent)
        return bResult
    }
}

module.exports = Transition
