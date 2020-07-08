// <!-- SCRIPT FOR MODALS -->
  $(function () {
    $('.btn[data-toggle=modal]').on('click', function () {
      var $btn = $(this);
      var currentDialog = $btn.closest('.modal-dialog'),
        targetDialog = $($btn.attr('data-target'));;
      if (!currentDialog.length)
        return;
      targetDialog.data('previous-dialog', currentDialog);
      currentDialog.addClass('aside');
      var stackedDialogCount = $('.modal.in .modal-dialog.aside').length;
      if (stackedDialogCount <= 5) {
        currentDialog.addClass('aside-' + stackedDialogCount);
      }
    });
  });

//   Scrape articles
  $(document).on('click', "#scrape", function (event) {
    event.preventDefault();
  
    $.get("/scrape", function () {
      alert("Finished scraping for new articles!");
      location.reload();
    });
  });

//   Opens modal for notes
  $(document).on("click", ".notes", function () {
    $("#note-title").empty();
    $(".modal-footer").empty();
    // $("#titleinput").val("");
    $("#noteBody").val("");
  
    var thisId = $(this).attr("id");
    console.log(thisId);
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      .then(function (data) {
        console.log(data);
        $("#note-title").text(data.title);
        $(".modal-footer").append("<button type='button' data-id='" + data._id + "' id='savenote' data-dismiss='modal' class='btn btn-info'>Save Note</button>");
  
        if (data.note) {
          $("#note-title").val(data.note.title);
          $("#noteBody").val(data.note.body);
        }
      });
  });
  
  $(document).on("click", "#savenote", function () {
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#note-title").val(),
        body: $("#noteBody").val()
      }
    })
      .then(function (data) {
        console.log(data);
      });
  });
  