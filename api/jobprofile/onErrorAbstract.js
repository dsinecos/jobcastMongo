module.exports = onErrorAbstract;

function onErrorAbstract(next) {
    
        return function (err) {
            console.log(err);
            next(err);
        }
    }
    