var assert = require("assert");
var app = require("../source/app");
var Konva = require("../source/lib/konva.min.js");

describe('check calculation', function(){
    it('1 test', function(){

        var testPoints = [ {_id:1}, {_id:2}, {_id:3}, {_id:4} ];
        var textAdgesAll = [ ];
        var textAdges = [];
        var testPoint1 = {};
        var testPoint2 = {};

        var result = app.calculate( testPoints, textAdgesAll, textAdges, testPoint1, testPoint2 );
        assert.equal(result, {'error':'error-select-point'});
    })
});
