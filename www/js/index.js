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
    var name = localStorage.getItem("u_first_name");
    name += " " + localStorage.getItem("u_last_name");
    $(".uName").text(name);
    $(".uSchoolName").text(localStorage.getItem('u_school_name'));
  },
  showObservation: function(observations){
    observation = observations[0];
    $('#emptyNotice').hide();
    this.updateNickname(observation);
    this.updateObservationForm(observation);
    $('.time').datebox({
        mode: "durationflipbox",
        overrideDurationOrder:["h","i","s"],
        overrideDurationFormat: "%DM:%DS"
    });
  },
  updateNickname: function(observation){
    var student = observation[2];
    var nickname = student['nickname'];
    $("#sAlias").text(nickname);
  },
  updateObservationForm: function(observation){
    var record_inputs = this.makeRecordInputs(observation[1]);
    $('#observationRecordsForm').prepend($(record_inputs));
    $('#observationRecordsForm').trigger('create');
  },
  makeRecordInputs: function(records){
    var inputs = '';
    $.each(records, function(index, record){
      console.log(record)
      input = '<label for="record_' + record["id"] + '">' + record["prompt"]  + '</label>'
      if(record["meme"] == "Time"){
        input += '<input name="' + record["id"] + '" type="text" placeholder="10" class="time" />';
      } else if(record["meme"] == "Percentage"){
        input += '<input type="range" name="' + record["id"] + '" value="50" min="0" max="100" />';
      } else if(record["meme"] == "Qualitative"){
        input += '<input type="range" name="' + record["id"] + '" value="5" min="0" max="5" />';
      } else if(record["meme"] == "Incidence"){
        input += '<input type="text" name="' + record["id"] + '"/>';
      } else if(record["meme"] == "Boolean"){
        input += '<select name="' + record["id"] + '" data-role="slider"><option value="true">Yes</option><option value="false">No</option></select>';
      } else {
        input += '<input type="text" name="' + record["id"] + '" />';
      }
      inputs += input;
    });
    return inputs;
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
    var data = "user_id=" + user_id + "&authenticity_token=" + authenticity_token;

    get('http://localhost:3000/api/v1/observations?' + data)
      .then(function(serverData){
        localStorage.setItem("observations", serverData);
        view.showObservation(serverData);
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
        localStorage.setItem("u_first_name", serverData.first_name);
        localStorage.setItem("u_last_name", serverData.last_name);
        localStorage.setItem("u_school_name", serverData.school_name);

        app.getObservations(serverData.id, serverData.token);
        view.loginUser();
      })
      .catch(function(serverData){
        view.errorMessage('#loginError', serverData.responseText);
      });

    return false;
  }
};