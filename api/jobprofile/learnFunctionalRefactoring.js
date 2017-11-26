
// var baseFunction = function(inputToBaseFunction) {
//     console.log("Base function");
//     console.log("Input to base function " + inputToBaseFunction);
// }

var baseFunction = function (secondBit) {

    var product = firstBit * secondBit;

    if (product) {
        onSuccess();
    } else {
        onError();
    }

}

var firstOrderFunction = function (firstBit, onSuccess, onError) {

    // return function (secondBit) {
    //     var product = firstBit * secondBit;

    //     if (product) {
    //         onSuccess();
    //     } else {
    //         onError();
    //     }
    // }

    return baseFunction;

}

var higherOrderOnSuccess = function (successMultiplier) {
    return function (unitsOfSuccess) {
        console.log("The value of successMultiplier is equal to " + successMultiplier);
        console.log("The product of successMultiplier and unitsOfSuccess " + successMultiplier * unitsOfSuccess);
    }
}

var higherOrderOnError = function (errorMultiplier) {
    return function (unitsOfError) {
        console.log("The value of errorMultiplier is equal to " + errorMultiplier);
        console.log("The product of errorMultiplier and unitsOfError " + errorMultiplier * unitsOfError);
    }
}

var deltaFunction = function () {

    var onSuccess = higherOrderOnSuccess(2);
    var onError = higherOrderOnError(2);

    var toExecute = firstOrderFunction(0, onSuccess, onError);

    toExecute(1);

}

deltaFunction();

