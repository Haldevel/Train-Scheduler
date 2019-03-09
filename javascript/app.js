

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
    var diffMinutes = moment().diff(moment(trainStart, "X"), "minutes");
    console.log( "diffMinutes " +  diffMinutes);
    
    //calculate 
    var minutesSinceLast =  diffMinutes%trainFrequency;
    console.log( "minutesSinceLast " +  minutesSinceLast);

    var minutesLeft = trainFrequency - minutesSinceLast;

    var secNow = moment().format("X");
    console.log("secNow: " + secNow);

    var delta = minutesLeft * 60;

    var secToArrive = parseInt(secNow) + parseInt(delta);
    console.log("secToArrive " +  secToArrive);

    const arrivalTime = moment.unix(secToArrive).format('HH:mm');
    console.log("formatted " + arrivalTime);

    /* var secondsTrainArrives = moment.unix(secToArrive);
    console.log("secondsTrainArrives " +secondsTrainArrives); */

    //var secondsTrainArrives = moment().format("X") + minutesLeft * 60;
    //console.log("1 " +secondsTrainArrives);
    //var dateString = moment.unix(secondsTrainArrives);
    //.format("YYYY-MM-DD");
    //console.log(dateString);


    //var diff = moment().diff(moment(trainStart, "X"), "minutes");

    //var nextTrainTimeHours = Math.floor(howManyMinutesLeft/60);
    //var nextTrainTimeMinutes = howManyMinutesLeft%60;

    //console.log("in " + nextTrainTimeHours + ":" + nextTrainTimeMinutes);

   /*  // Prettify the employee start
    var empStartPretty = moment.unix(empStart).format("MM/DD/YYYY");
  
    // Calculate the months worked using hardcore math
    // To calculate the months worked
    var empMonths = moment().diff(moment(empStart, "X"), "months");
    console.log(empMonths);
  
    // Calculate the total billed rate
    var empBilled = empMonths * empRate;
    console.log(empBilled); */
  
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
  