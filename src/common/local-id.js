let ID = 0

function getID () {
    const id = ++ID
    return id.toString()
}

module.exports = {
    getID
}