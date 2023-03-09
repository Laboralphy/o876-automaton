const StateContext = require('../src/v2/StateContext')

describe('runInit', function () {
    it ('should emit action(a1) event when defining a state with only one init action : a1', function () {
        const def = {
            init: ['a1']
        }
        const sc = new StateContext(def)
        const aLog = []
        sc.events.on('action', evt => {
            aLog.push(evt.action)
        })
        sc.runInit()
        expect(aLog).toEqual(['a1'])
    })
    it ('should log a1 and a2 when defining a state with init having action a1 and a2', function () {
        const def = {
            init: ['a1', 'a2']
        }
        const sc = new StateContext(def)
        const aLog = []
        sc.events.on('action', evt => {
            aLog.push(evt.action)
        })
        sc.runInit()
        expect(aLog).toEqual(['a1', 'a2'])
    })
})

describe('runLoop', function () {
    it ('should emit action(a1) event when defining a state with only one loop action : a1', function () {
        const def = {
            loop: ['a1']
        }
        const sc = new StateContext(def)
        const aLog = []
        sc.events.on('action', evt => {
            aLog.push(evt.action)
        })
        sc.runInit()
        sc.runLoop()
        expect(aLog).toEqual(['a1'])
    })
    it ('should log a1 and a2 when defining a state with loop having action a1 and a2', function () {
        const def = {
            loop: ['a1', 'a2']
        }
        const sc = new StateContext(def)
        const aLog = []
        sc.events.on('action', evt => {
            aLog.push(evt.action)
        })
        sc.runInit()
        sc.runLoop()
        expect(aLog).toEqual(['a1', 'a2'])
    })
    it ('should log i1, a1 and a2 when defining a state with init and loop sections', function () {
        const def = {
            init: ['i1'],
            loop: ['a1', 'a2']
        }
        const sc = new StateContext(def)
        const aLog = []
        sc.events.on('action', evt => {
            aLog.push(evt.action)
        })
        sc.runInit()
        sc.runLoop()
        expect(aLog).toEqual(['i1', 'a1', 'a2'])
    })
})

describe('parseScriptArguments', function () {
    it('should parse ["t1", 1000] when input is "t1 1000"', function () {
        const sc = new StateContext()
        expect(sc.parseScriptArguments('t1 1000')).toEqual({ opcode: 't1', parameters: '1000' })
    })
})

describe('runJump', function () {
    describe('when submitting a jump section ["t1 1000 s1"]', function () {
        it('should log "test t1 1000"', function() {
            const def = {
                jump: [
                    { test: 't1 1000', state: 's1' }
                ]
            }
            const sc = new StateContext(def)
            expect(sc._jump.length).toBeGreaterThan(0)
            const aLog = []
            sc.events.on('test', evt => {
                aLog.push('test ' + evt.test + ' ' + evt.parameters)
            })
            sc.runJump()
            expect(aLog).toEqual(['test t1 1000'])
        })
        it('should log "new state s1" when test is returning true', function() {
            const def = {
                jump: [
                    { test: 't1 1000', state: 's1' }
                ]
            }
            const sc = new StateContext(def)
            expect(sc._jump.length).toBeGreaterThan(0)
            const aLog = []
            sc.events.on('state', evt => {
                aLog.push('new state ' + evt.state)
            })
            sc.events.on('test', evt => {
                evt.pass(evt.test === 't1')
            })
            sc.runJump()
            expect(aLog).toEqual(['new state s1'])
        })
        it('should not log "new state s1" when test not passing true', function() {
            const def = {
                jump: [
                    { test: 't1 1000', state: 's1' }
                ]
            }
            const sc = new StateContext(def)
            expect(sc._jump.length).toBeGreaterThan(0)
            const aLog = []
            sc.events.on('state', evt => {
                aLog.push('new state ' + evt.state)
            })
            sc.events.on('test', evt => {
            })
            sc.runJump()
            expect(aLog).toEqual([])
        })
    })
})