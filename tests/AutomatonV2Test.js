const Automaton = require('../src/v2/Automaton')

describe('defineState', function () {
    it('should define automaton state with no error when submitting { loop: ["a1"] }', function () {
        const a = new Automaton()
        a.defineState('s1', { loop: ['a1']})
    })
})

describe('process', function () {
    it('should enter first state when not defining init state', function () {
        const a = new Automaton()
        a.defineState('s1', { loop: ['a10'], jump: ['equal 1 1 s2'] })
        a.defineState('s2', { init: ['i2'], loop: ['a20', 'a30'], jump: ['equal 0 1 s3'] })
        a.defineState('s3', { loop: [] })
        const aLog = []
        a.events.on('action', ({ state, action }) => {
            aLog.push('action ' + state + ' ' + action)
        })
        a.events.on('test', ({ state, test, arguments: aArgs, pass }) => {
            if (test === 'equal') {
                aLog.push('test ' + test + ' true')
                pass(aArgs[0] === aArgs[1])
            } else {
                aLog.push('test ' + test + ' false')
            }
        })
        a.process()
        a.process()
        expect(aLog).toEqual([
            'action s1 a10',
            'test equal true',
            'action s2 i2',
            'action s2 a20',
            'action s2 a30',
            'test equal true'
        ])
    })
})

describe('subroutine', function () {
    it('should enter subroutine and exit when flag is increasing', function () {
        const a = new Automaton()
        a.defineState('s1', { init: ['i1'], loop: ['a1'], call: ['flagEqu 1 s2'] })
        a.defineState('s2', { init: ['i2'], loop: ['a2'], back: ['flagEqu 2'] })
        const aLog = []
        a.events.on('action', ({ state, action }) => {
            aLog.push('action ' + state + ' ' + action)
        })
        let flag = 0
        a.events.on('test', ({ state, test, arguments: aArgs, pass }) => {
            if (test === 'flagEqu') {
                pass(aArgs[0] === flag)
                aLog.push('test ' + test + ' ' + aArgs[0] + ' vs ' + flag + String(aArgs[0] === flag))
            } else {
                aLog.push('test ' + test)
            }
        })
        a.process()
        a.process()
        a.process()
        flag = 1
        a.process()
        a.process()
        a.process()
        flag = 2
        a.process()
        a.process()
        a.process()
        expect(aLog).toEqual([
                'action s1 a1',
                'test flagEqu 1 vs 0false',
                'action s1 a1',
                'test flagEqu 1 vs 0false',
                'action s1 a1',
                'test flagEqu 1 vs 0false',
                'action s1 a1',
                'test flagEqu 1 vs 1true',
                'action s2 i2',
                'action s2 a2',
                'test flagEqu 2 vs 1false',
                'action s2 a2',
                'test flagEqu 2 vs 1false',
                'action s2 a2',
                'test flagEqu 2 vs 2true'
            ]
        )
    })
})
