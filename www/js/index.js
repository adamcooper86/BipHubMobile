var post = function(action, data){
  return new Promise(function(resolve, reject){

    console.log("About to make a post call - ");
    console.log(action);
    console.log(data);

    var request = $.post(action, data);

    request.done(function(serverData){
      resolve(serverData)
    });

    request.fail(function(serverData){
      reject(serverData)
    });
  });
}

var view = {
  goTo: function(contentId){
    console.log('got to view.goToCards');
    $('.active').removeClass('active').addClass('inactive');
    $(contentId).removeClass('inactive').addClass('active');
  }
}

var app = {
  initialize: function() {
    this.bindEvents();
  },
  bindEvents: function() {
    $("#loginForm").submit(this.submitLoginForm);
  },
  submitLoginForm: function(){
    var data = $("#loginForm").serialize();
    post('http://localhost:3000/api/v1/login', data)
      .then(function(serverData){
        console.log('success');
        console.log(serverData.id);
        console.log(serverData.token);

        localStorage.setItem("uid", serverData.id);
        localStorage.setItem("utoken", serverData.token);

        view.goTo('#cardsPane');
      })
      .catch(function(serverData){
        console.log('there was a problem');
        console.log(serverData.responseText);
      });

    return false;
  }
};