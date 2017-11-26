module.exports = onSuccessAbstract;

function onSuccessAbstract(res) {
    
        return function (status, message, data) {
    
            console.log(message);
            console.log(data);
    
            res.status(status).json({
                'message': message,
                'data': data,
                'howzzat': 'Testing the onSuccessAbstract function'
            });
        }
    }
