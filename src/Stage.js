const Transition = require('./Transition')
const localID = require('./local-id')

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
     * @returns {{id: string, value: boolean}[]}
     */
    getTransitions () {
        return this._transitions.map(t => ({
            id: t.id,
            value: t.isTrue()
        }))
    }

    /**
     * Renvoie la première transition true
     * @returns {Transition|undefined}
     */
    getFirstTrueTransition () {
        return this._transitions.find(t => t.isTrue())
    }

    addTransition (oStage, pTest) {
        const oTransition = new Transition(localID.getID())
        oTransition.stage = oStage
        oTransition.events.on('test', pTest)
        this._transitions.push(oTransition)
    }
}

module.exports = Stage
