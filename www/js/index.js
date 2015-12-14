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

var patch = function(action, data){
  return new Promise(function(resolve, reject){

    console.log("About to make a patch call - ");
    console.log(action);
    console.log(data);

    var request = $.ajax({
      method: 'PATCH',
      url: action,
      data: data
    });

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
  updateObservations: function(observations){
    observation = observations[0];
    if(observation){
      view.goTo('#cardsPage')
      view.showObservation(observation);
    } else {
      view.goTo('#emptyPage');
    }
  },
  showObservation: function(observation){
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
      input = '<label for="record_' + record["id"] + '">' + record["prompt"]  + '</label>'
      if(record["meme"] == "Time"){
        input += '<input name="' + record["id"] + '" type="text" placeholder="10" class="time record" />';
      } else if(record["meme"] == "Percentage"){
        input += '<input type="range" name="' + record["id"] + '" value="50" min="0" max="100" class="record"/>';
      } else if(record["meme"] == "Qualitative"){
        input += '<input type="range" name="' + record["id"] + '" value="5" min="0" max="5" class="record" />';
      } else if(record["meme"] == "Incidence"){
        input += '<input type="text" name="' + record["id"] + '" class="record"/>';
      } else if(record["meme"] == "Boolean"){
        input += '<select name="' + record["id"] + '" data-role="slider" class="record"><option value="true">Yes</option><option value="false">No</option></select>';
      } else {
        input += '<input type="text" name="' + record["id"] + '" class="record" />';
      }
      inputs += input;
    });
    return inputs;
  },
  clearObservationsForm: function(){
    document.getElementById("observationRecordsForm").innerHTML = "<input name='submit' type='submit' value='submit'/>";
  }
}

var app = {
  initialize: function() {
    this.bindEvents();
    this.isLoggedIn();
  },
  bindEvents: function() {
    $("#loginForm").submit(this.submitLoginForm);
    $("#observationRecordsForm").submit(this.submitObservationForm);
    $(".logoutLink").click(this.handleLogOut);
  },
  isLoggedIn: function(){
    var uid = localStorage.getItem('uid') || 0;
    var token = localStorage.getItem('utoken') || "";

    var data = { user_id: uid, authenticity_token: token };

    post('http://localhost:3000/api/v1/loggedin', data)
      .then(function(serverData){
        localStorage.setItem("utoken", serverData.token);
        app.checkForObservations();
        view.loginUser();
      })
      .catch(function(serverData){
      });
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
        var observation = serverData[0];
        if(observation){
          localStorage.setItem("observation_id", serverData[0][0]["id"]);
          view.updateObservations(serverData);
        } else {
          localStorage.removeItem('observation_id');
          view.updateObservations(serverData);
        }
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

        app.checkForObservations();
        view.loginUser();
      })
      .catch(function(serverData){
        view.errorMessage('#loginError', serverData.responseText);
      });

    return false;
  },
  submitObservationForm: function(){
    var user_id = localStorage.getItem('uid');
    var authenticity_token = localStorage.getItem('utoken');
    var results = app.getInputResults();
    var id = localStorage.getItem('observation_id');
    var data = { user_id: user_id, authenticity_token: authenticity_token, observation: { records_attributes: results}}

    var action = "http://localhost:3000/api/v1/observations/" + id;
    patch(action, data)
      .then(function(serverData){
        view.clearObservationsForm();
        app.getObservations(user_id, authenticity_token);
      })
      .catch(function(serverData){
        view.errorMessage('#observationError', serverData.responseText);
      });
    return false;
  },
  getInputResults: function(){
    var results = {}

    var $inputs = $('#observationRecordsForm .record');

    $inputs.each(function() {
        results[this.name] = $(this).val();
    });

    results = this.formatInputResults(results);

    return results
  },
  formatInputResults: function(results){
    var formatted_results = {};
    var count = 0;

    $.each(results, function(id, value){
      var record = {id: id, result: value };
      formatted_results[count] = record;
      count ++;
    });

    return formatted_results
  },
  checkForObservations: function(){
    var timeout = 120000; //two minutes
    var user_id = localStorage.getItem('uid');
    var authenticity_token = localStorage.getItem('utoken');

    app.getObservations(user_id, authenticity_token);

    var action = function() {
      var data = "user_id=" + user_id + "&authenticity_token=" + authenticity_token;

      get('http://localhost:3000/api/v1/observations?' + data)
        .then(function(serverData){
          current_observation_id = localStorage.getItem("observation_id");
          var observation = serverData[0];
          if(observation){
            if(current_observation_id != observation[0]["id"]){
              localStorage.setItem("observation_id", serverData[0][0]["id"]);
              view.clearObservationsForm();
              view.updateObservations(serverData);
            }
          } else if(current_observation_id){
            localStorage.removeItem('observation_id');
            view.updateObservations(serverData);
          }
        })
        .catch(function(serverData){
          console.log('error');
          console.log(serverData.responseText)
        });
    };
    setInterval(action, timeout);
  }
};