
$(function() {
  $(".devham").on("click", function(event) {
    var id = $(this).data("id");


    $.ajax("/api/burgers/" + id, {
      type: "DELETE"
    }).then(
      function() {
        console.log("deleted id ", id);

        location.reload();
      }
    );
  });

  $(".create-form").on("submit", function(event) {

    event.preventDefault();

    var newQuote = {
      burger: $("#burger").val().trim(),
    };


    $.ajax("/api/burgers", {
      type: "POST",
      data: newQuote
    }).then(
      function() {
        console.log("created new quote");

        location.reload();
      }
    );
  });
});
