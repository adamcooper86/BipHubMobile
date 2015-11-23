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
    $('.active').removeClass('active').addClass('inactive');
    $(contentId).removeClass('inactive').addClass('active');
  },
  errorMessage: function(errorTarget, message){
    $(errorTarget).text("There was an error signing in. " + message);
  },
  loginUser: function(){
    $('#logoutLink').show();
    this.updatePersonalInfo();
  },
  logoutUser: function(){
    $('#logoutLink').hide();
    this.goTo('#loginPane');
  },
  updatePersonalInfo: function(){
    $(".uidSpan").text(localStorage.getItem("uid"));
  },
  prepareView: function(){
    $('#logoutLink').hide();
  }
}

var app = {
  initialize: function() {
    this.bindEvents();
    view.prepareView();
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
  submitLoginForm: function(){
    var data = $("#loginForm").serialize();
    post('http://localhost:3000/api/v1/login', data)
      .then(function(serverData){
        localStorage.setItem("uid", serverData.id);
        localStorage.setItem("utoken", serverData.token);

        view.goTo('#cardsPane');
        view.loginUser();
      })
      .catch(function(serverData){
        view.errorMessage('#loginError', serverData.responseText);
      });

    return false;
  }
};