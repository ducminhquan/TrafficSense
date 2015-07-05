var fs = require('fs');
var _ = require('lodash');
var request = require('request');

var client  = require('mqtt').connect('mqtt://tv0gqs.messaging.internetofthings.ibmcloud.com', {
	username: 'a-tv0gqs-ptikptinvr',
	password: 'wT4QpfkcD8S93W!hgl',
	clientId: 'a:tv0gqs:ptikptinvr'
});

var queue = {};
 
client.on('connect', function () {
	console.log('connected');
	
	client.subscribe('iot-2/type/+/id/+/evt/+/fmt/json', function(err, granted) {
		if (err) return console.log(err);
		console.log(granted);

		client.on("message", function(topic, payload) {
			var tokens = topic.split('/');
			var id = [tokens[2],tokens[4]].join('-');
			console.log(id);
			// console.log(topic);
			var data = JSON.parse(payload);
			// data.created = Date.now();
			queue[id] = queue[id] || [];
			queue[id].push(data);
			//console.log(queue);
		});
	});
});

setInterval(function() {
	
	finalData = [];
	Object.keys(queue).forEach(function(key) {
		var val = queue[key];
		var dataToSend = [];

		tmp = _.takeRight(val, 5);
		val = tmp;

		tmp.forEach(function(item) {
			var d = item.d;
			dataToSend.push(d.acceleration_x + '');
			dataToSend.push(d.acceleration_y + '');
			dataToSend.push(d.acceleration_z + '');
			dataToSend.push(d.pitch + '');
			dataToSend.push(d.yaw + '');
			dataToSend.push(d.roll + '');
		});

		finalData.push(dataToSend);
	});

	var data = {
		context: "foot_group",
		input: {
		   tablename: "scoreInput",
		   header: ["X1","Y1","Z1","pitch1","yaw1","roll1","X2","Y2","Z2","pitch2","yaw2","roll2","X3","Y3","Z3","pitch3","yaw3","roll3","X4","Y4","Z4","pitch4","yaw4","roll4","X5","Y5","Z5","pitch5","yaw5","roll5"],
		   data: finalData
		}
	};

	request.post({
        url: 'http://trafficsensepredict.mybluemix.net/score',
        json: true,
        body: data
    }, function (error, response, body) {
    	// console.log(data);
    	if(!error) {
		    if (response.statusCode == 200) {
		        var body0 = body[0];
		        var data = [];
		        if (body0) data = body0.data;
				var total = 0;

				data.forEach(function(d){
					total += (d[30] > 0.5);
				});

				console.log(total);

				if(total >= 2) {
					request.get('http://formidable-moustache-96-234016.apse1.nitrousbox.com/api/events/camera?address=T%C3%B4n%20D%E1%BA%ADt%20Ti%C3%AAn,%20Ph%C6%B0%E1%BB%9Dng%20T%C3%A2n%20Phong,%20Qu%E1%BA%ADn%207&category=jam&desc2=%C3%99n%20t%E1%BA%AFc&desc3=&author=ducminhquan@gmail.com');
				}


		    } else {
		    	console.log('error response:');
		    	console.log(response);
		        // console.log(error);
		    }
        } else {
        	console.log('errors happen here!');
        }
    });

	
	// console.log(data);
	// var csv = dataToSend.join(',') + '\n';
	// fs.appendFile('out', csv, function(err) {
	//     if(err) {
	//         // return console.log(err);
	//     }
	// });

	
}, 1000);
