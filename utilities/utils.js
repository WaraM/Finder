function errHandler(err) {
    console.error('There was an error performing the operation');
    console.log(err);
    console.log(err.code);
    return console.error(err.message);
}

module.exports = {
    errHandler: errHandler
}