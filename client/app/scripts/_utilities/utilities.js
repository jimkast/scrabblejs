var randomInteger = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var extend = function(destination, source) {
    for (var property in source) {
        if (destination[property] && (typeof(destination[property]) == 'object') && (destination[property].toString() == '[object Object]') && source[property])
            extend(destination[property], source[property]);
        else
            destination[property] = source[property];
    }
    return destination;
}
