

function makeFlash(req, type, message) {
    if(type && message) {
        if(type == 'success') {
            type = 'alert alert-success'
        } else if(type == 'fail') {
            type = 'alert alert-danger'
        } else if(type == 'info') {
            type = 'alert alert-info'
        }

         req.session.flash = {
            type: type,
            message: message
        };
    } else {
        console.log('couldnt make flash.')
    }
}

module.exports = makeFlash;
