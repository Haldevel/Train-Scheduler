

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD14KmbxBecQVYcPtMXGnq-EPdsyhv9edI",
    authDomain: "trainscheduler-d4b31.firebaseapp.com",
    databaseURL: "https://trainscheduler-d4b31.firebaseio.com",
    projectId: "trainscheduler-d4b31",
    storageBucket: "trainscheduler-d4b31.appspot.com",
    messagingSenderId: "305070694086"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // 2. Add event handler for the button adding a new train
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    //parse the military time from the first-train-input
    var timeStart = ($("#first-train-input").val().trim()).split(":");
    //create a moment for today's date and the time from timeStart
    console.log("timeStart " + timeStart);
    var dateTimeFirst = moment({hour: timeStart[0], minute: timeStart[1] });
   
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = dateTimeFirst.format("X");
    var frequency= $("#frequency-input").val().trim();
  
    // Creates local "temporary" object for holding employee data
    var newTrain = {
      trName: trainName,
      trDestination: destination,
      trStart: firstTrain,
      trFrequency: frequency
    };

    console.log(newTrain);
  
    // Upload the train data to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.trName);
    console.log(newTrain.trDestination);
    console.log(newTrain.trStart);
    console.log(newTrain.trFrequency);
  
    alert("Train successfully added");
  
    // Clear all of the text boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  });

  // 3. Create Firebase event for generating a table row and appending it to the html table when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().trName;
    var trainDestination = childSnapshot.val().trDestination;
    var trainStart = childSnapshot.val().trStart;
    var trainFrequency = parseInt(childSnapshot.val().trFrequency);
  
    // Train Info from the db
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainStart);
    console.log(trainFrequency);

    //create a moment for now (local time)
    //and calculates the difference in minutes between the moment in now and the moment when the first train arrives:
   
    var currMoment = moment();
    var diffMinutes = currMoment.diff(moment(trainStart, "X"), "minutes");
    console.log( "diffMinutes " +  diffMinutes);
    
    //calculate how many minutes passed since the most recent train arrived
    var minutesSinceLast =  diffMinutes%trainFrequency;
    console.log( "minutesSinceLast " +  minutesSinceLast);

    //calculate how many minutes left untill the next closest train
    var minutesLeft = trainFrequency - minutesSinceLast;

    //calculate arrival time - current time in unix format (s)
    var secNow = currMoment.format("X");
    console.log("secNow: " + secNow);
    //translate the minutes left to the next train to seconds
    var delta = minutesLeft * 60;

    var secToArrive = parseInt(secNow) + delta;
    console.log("secToArrive " +  secToArrive);

    //calculate the arrival time from unix formatted time to HH:mm format
    const arrivalTime = moment.unix(secToArrive).format('HH:mm');
    console.log("formatted " + arrivalTime);
 
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDestination),
      $("<td>").text(trainFrequency),
      $("<td>").text(arrivalTime),
      $("<td>").text(minutesLeft)
 
    );

    newRow.addClass("lbl");
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });
  