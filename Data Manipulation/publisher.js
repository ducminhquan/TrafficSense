var fs = require('fs');

var client  = require('mqtt').connect('mqtt://tv0gqs.messaging.internetofthings.ibmcloud.com', {
	username: 'use-token-auth',
	password: 'w5p!74VDFqEEZ3sMqc',
	clientId: 'd:tv0gqs:Agent:NodeJS'
});
 
client.on('connect', function () {
	console.log('connected');
	setInterval(function() {
		var health = Math.random() < 0.5 ? {
			heartRate: getRandomInt(60, 80),
			objHumd: getRandomInt(20, 50),
			objTemp: getRandomInt(30, 36),
			pressure: getRandomInt(5, 15) / 10000,
			label: 0
		} : {
			heartRate: getRandomInt(85, 120),
			objHumd: getRandomInt(55, 80),
			objTemp: getRandomInt(38, 45),
			pressure: getRandomInt(450, 550) / 10000,
			label: 1
		};
		var data = {
			d: health
		};
		console.log(health);
		client.publish('iot-2/evt/raw/fmt/json', JSON.stringify(data));
		
		// var csv = health.heartRate + ',' + health.objHumd + ',' + health.objTemp + ',' + health.pressure + ',' + health.label + '\r\n';
		// fs.appendFile('out', csv, function(err) {
		//     if(err) {
		//         return console.log(err);
		//     }
		// });
	}, 1000);
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
