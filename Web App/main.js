function stuff(e) {
  var p = document.querySelector('core-animated-pages');
  p.selected = p.selected ? 0 : 1;
}

addEventListener('template-bound', function(e) {
  var scope = e.target;
  var socket = io.connect('http://formidable-moustache-96-234016.apse1.nitrousbox.com:4000/');
  
  scope.newMessagesCount = 0;

  scope.handleEvent = function(data) {
    console.log(data.detail.response);
    scope.events = data.detail.response;
  };
  
  scope.newsClick = function(e, detail, sender) {
    var event = e.target.templateInstance.model.event;
    
    scope.currentEvent = event;
    
    var p = document.querySelector('core-animated-pages');
    p.selected = p.selected ? 0 : 1;
  };
  
  scope.postClick = function(e, detail, sender) {
    console.log("Click ne");
    
    var p = document.querySelector('core-animated-pages');
    p.selected = 2;
  };
  
  scope.messageToPost = {
    "description": ["Tôn Dật Tiên, Phường Tân Phong, Quận 7","Lưu thông ổn định",""],
    "category": "free",
    "location": {
     "type": "Point",
     "coordinates": [106.1, 10.2]
    },
    "author": "ducminhquan@gmail.com"
  };
  
  scope.postDoneClick = function(e, detail, sender) {
    // console.log(scope.messageToPost);
    scope.messageToPost.category = scope.categories[scope.currentCategory];
    scope.messageToPost.description[1] = scope.categoriesText[scope.currentCategory];
    var ajax = document.querySelector('#postAjax');
    m = scope.messageToPost;
    //ajax.body = scope.messageToPost;
    
    var url = "http://formidable-moustache-96-234016.apse1.nitrousbox.com/api/events/camera?address=" + m.description[0] + "&category=" + m.category + "&desc2=" + m.description[1] + "&desc3=" + m.description[2] + "&author=ducminhquan@gmail.com";
    // console.log(url);
    ajax.url=url;
    ajax.go();
    
    var p = document.querySelector('core-animated-pages');
    p.selected = 0;
  }
  
  socket.on('event', function (data) {
      // console.log(data);
      scope.newMessagesCount++;
      document.querySelector('#toast').show();
      vibrateByCategory(data.category);
      scope.events.unshift(data);
  });
  
  
  
  scope.categories = ['accident','fire','flood', 'free', 'heavy', 'jam', 'police', 'roadwork'];
  scope.categoriesText = ['Có tai nạn giao thông','Có hỏa hoạn','Đường ngập nước', 'Đường thông thoáng', 'Đông xe', 'Ùn tắc', 'Bồ câu', 'Có rào chắn'];
  
  scope.currentCategory = 0;
  
  // vibrateByCategory('police');
});


var vibrate = function(pattern) {
  if (window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(pattern);
  } else {
     alert("I can't rung");
  }
};

var vibrateByCategory = function(category) {
  switch(category) {
    case "police":
        vibrate([100,50,100,50,100,50,100,50,100,50,100,50,100,50,100,50,100,50]);
        break;
    case "jam":
    case "fire":
    case "accident":
        vibrate([1000,100,1000,100]);
        break;
  }
};