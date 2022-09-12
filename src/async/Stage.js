const Transition = require('../sync/Transition')
const localID = require('../common/local-id')

class Stage {
    constructor (id) {
        this._id = id
        this._transitions = []
    }

    get id () {
        return this._id
    }

    /**
     * Renvoie la liste des transitions avec leur vérité à chacune.
     * @returns {Promise<{transition: {Transition}, value: boolean}[]>}
     */
    async getTransitions () {
        const aResult = []
        /**
         * @param t {Transition}
         * @returns {Promise<{transition: {Transition}, value: boolean}>}
         */
        const mp = t => t.isTrue().then(value => ({
            transition: t,
            value
        }))
        for (const t of this._transitions) {
            aResult.push(mp(t))
        }
        return Promise.all(aResult)
    }

    /**
     * Renvoie la première transition true
     * @returns {Promise<Transition|null>}
     */
    async getFirstTrueTransition () {
        const aTransitions = await this.getTransitions()
        const r = aTransitions.find(t => t.value)
        return r ? r.transition : null
    }

    addTransition (oStage, pTest) {
        const oTransition = new Transition(localID.getID())
        oTransition.stage = oStage
        oTransition.events.on('test', oEvent => {
            oEvent.result(pTest())
        })
        this._transitions.push(oTransition)
    }
}

module.exports = Stage
