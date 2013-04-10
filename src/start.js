(function (window, factory) {
    if (typeof define === 'function' && define.amd) {
        // Register as an AMD module if available...
        define(['sizzle', 'raphael', 'json3'], factory);
    } else {
        // Browser globals for the unenlightened...
        window.d3 = factory(window.Sizzle, window.Raphael, window.JSON);
    }
}(window, function(Sizzle, Raphael, JSON) {
