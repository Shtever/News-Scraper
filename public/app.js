// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p class='headline' data-id='" + data[i]._id + "'>" + data[i].title + "</p><p class='url'>" + data[i].link + "</p><br>");
    
    // IMAGES FOR STORIES // *******SCRAPPED**********
    // $("#articles").append("<img src='" + data[i].img + "'>");


  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
  // Empty the notes from the note section
  $("#comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#comments").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#comments").append("NOTE TITLE:<br><input id='titleinput' name='title' ><br>");
      // A textarea to add a new note body
      $("#comments").append("Comment:<br><textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#comments").append("<br><button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      $("#comments").append("<button data-id='" + data._id + "' id='clearnote'>Clear Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#comments").empty();
    });





  $(document).on("click", "#clearnote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    var noteId = $(this).attr("note-id");



    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,

    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log("NOTE CLEARED");
        // Empty the comments section
        $("#comments").empty();
        $("#titleinput").val("");
        $("#bodyinput").val("");
      });

  });
})