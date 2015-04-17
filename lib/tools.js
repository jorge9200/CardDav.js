
var _     = require('lodash');
_.mixin(require("lodash-deep"));
var http  = require('http');
var https = require('https');
var xml2js   = require('xml2js');
var uuid  = require('node-uuid');


var parseOptions = {
	explicitRoot : false,
	normalizeTags : true,
	tagNameProcessors : [xml2js.processors.stripPrefix],
	//explicitArray : false
}

var Tools = function () {

	this.request = function( opts, secure, callback ){

		var protocol = secure ? https : http;

		var req = protocol.request( opts, function( res ){

			var buffer = '';

			res.on( 'data', function( data ){
				buffer += data;
			});

			res.on( 'end', function( data ){
				
				res.body = buffer;

				callback( null, res );

			});

		}).on( 'error', function( err ){
			console.log(err);
		});

		req.write( opts.data );
		req.end();
	};

	this.parseXML = function( xmlString, callback ){
		xml2js.parseString(xmlString, parseOptions,callback);
	};

	this.cloneObject = function( obj ){
		return JSON.parse( JSON.stringify( obj ) );
	};

	this.uuid = function (string) {		
		return uuid.v4();
	};

	this.normalizeCalendarAttribute = function( result, value, key ){

		if(!value || !value[0] || !value[0] === 'undefined'){
			return result;
		}

		value = value[0];		

		switch( key ){

			case 'resourcetype':

				value = Object.keys( value );
				break;

			case 'getctag':
				value = value.replace(/^"(.+(?="$))"$/, '$1');
				break; 

		}

		result[key] = value;
		return result;

	};

};

module.exports = new Tools();