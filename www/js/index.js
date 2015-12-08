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

var get = function(action, data){
  return new Promise(function(resolve, reject){

    console.log("About to make a get call - ");
    console.log(action);
    console.log(data);

    var request = $.get(action, data);

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
    $(":mobile-pagecontainer").pagecontainer("change", contentId);
  },
  errorMessage: function(errorTarget, message){
    $(errorTarget).text("There was an error signing in. " + message);
  },
  loginUser: function(){
    this.updatePersonalInfo();
    this.goTo('#cardsPage');
  },
  logoutUser: function(){
    this.goTo('#loginPage');
  },
  updatePersonalInfo: function(){
    $(".uidSpan").text(localStorage.getItem("uid"));
  }
}

var app = {
  initialize: function() {
    this.bindEvents();
  },
  bindEvents: function() {
    $("#loginForm").submit(this.submitLoginForm);
    $("#logoutLink").click(this.handleLogOut);
  },
  handleLogOut: function(){
    localStorage.removeItem("uid");
    localStorage.removeItem("utoken");
    view.logoutUser();
  },
  getObservations: function(user_id, authenticity_token){
    console.log('got to getObservations');
    console.log(user_id);
    console.log(authenticity_token);
    var data = "user_id=" + user_id + "&authenticity_token=" + authenticity_token;
    console.log(data);

    get('http://localhost:3000/api/v1/observations?' + data)
      .then(function(serverData){
        console.log('success');
      })
      .catch(function(serverData){
        console.log('error');
        console.log(serverData.responseText)
      });
  },
  submitLoginForm: function(){
    var data = $("#loginForm").serialize();
    post('http://localhost:3000/api/v1/login', data)
      .then(function(serverData){
        localStorage.setItem("uid", serverData.id);
        localStorage.setItem("utoken", serverData.token);

        app.getObservations(serverData.id, serverData.token);
        view.loginUser();
      })
      .catch(function(serverData){
        view.errorMessage('#loginError', serverData.responseText);
      });

    return false;
  }
};