'use strict';
var test = require('tape').test;

var fs = require('fs');
var Protobuf = require('pbf');
var VectorTile = require('../js/format/vectortile.js');
var FillBucket = require('../js/geometry/fillbucket.js');
var FillVertexBuffer = require('../js/geometry/fillvertexbuffer.js');
var FillElementBuffer = require('../js/geometry/fillelementsbuffer.js');
var Point = require('../js/geometry/point.js');

// Load a fill feature from fixture tile.
var vt = new VectorTile(new Protobuf(new Uint8Array(fs.readFileSync(__dirname + '/fixtures/mbsv5-6-18-23.vector.pbf'))));
var feature = vt.layers.water.feature(0);

test('FillBucket', function(t) {
    // Suppress console.warn output.
    var warn = console.warn;
    console.warn = function() {};

    var info = {};
    var buffers = {
        fillVertex: new FillVertexBuffer(),
        fillElement: new FillElementBuffer()
    };
    var bucket = new FillBucket(info, buffers);
    t.ok(bucket);

    t.equal(bucket.addFill([
        new Point(0, 0),
        new Point(10, 10)
    ]), undefined);

    t.equal(bucket.addFill([
        new Point(0, 0),
        new Point(10, 10),
        new Point(10, 20)
    ]), undefined);

    t.equal(bucket.addFeature(feature.loadGeometry()), undefined);

    // Put it back.
    console.warn = warn;

    t.end();
});
