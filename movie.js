$(document).ready(function() {

    $('#searchBox').keyup(function(keyCode) {

      var searchBoxString = $('#searchBox').val();
      if (searchBoxString.length > 0) {
        getMovieOMDB(searchBoxString);
        $('#container').empty();
      }
      if(keyCode.keyCode == 8){$('#container').empty();}
    });
    $('#tableDB').dataTable();
});

function createCard(cardData) {

    $('#container').empty();

    var cardTemplate = [

      '<div class="card">',
      '<img id="poster" src="">',
      '<h5 class="card-title" id="title" ></h5>',
      '<h6 class="card-subtitle mb-2 text-muted" id="addYear"></h6>',
      '<p class="card-text" id="addButton" ></p>',
      '</div>'
    ];

    $('#container').append(cardTemplate);
    if (cardData.Poster != "N/A") {
      $('#poster').attr('src', cardData.Poster)
    } else $('#poster').attr('src', "https://image.flaticon.com/icons/svg/83/83519.svg");
    $('#title').append(cardData.Title);
    $('#addYear').append("("+ cardData.Year +")" + " - " +  cardData.Genre + " - " + cardData.Runtime);
    $('#addYear').append("<br>IMDb Rating: " + cardData.imdbRating + "<br>" +createIMDbLink(cardData.imdbID));
    var $button = $('<a href="#" class="btn btn-primary" id="button" title="Add movie to your Filmography">Add Movie</a>');
      $button.click(function(){
        addMovietoDB(cardData);
      });
      $('#addButton').empty();
      $('#addButton').append($button);
}

function getMovieOMDB(searchBoxString){
  
    $.getJSON('http://www.omdbapi.com/?apikey=b0d26e30&t='+searchBoxString, function(data){
      if (data.Response == "False") {
        $('#container').append("Movie not found!");
      } else {
            createCard(data);
            searchDBByTitle(searchBoxString);
        };
    });
}

function searchDBByTitle(searchBoxString){

    $.ajax({
        type : "POST",
        url: "http://localhost/film.php",
        data: {'title': $("#title").text()},
        dataType: 'json',
        complete: function(jqXHR){
              if ((jqXHR.responseText).toLowerCase() == $("#title").text().toLowerCase()) {
                $('#button').attr('class', 'btn btn-primary disabled');
                $('#button').html("Already added");
              }
        }
    });
}

function addMovietoDB(data){
      $.ajax({
        type : "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: "http://localhost/film.php",
        data: JSON.stringify(data),
        dataType: 'json',
        complete: function(jqXHR){

              if (jqXHR.status == 200) {
                $('#button').attr('class', 'btn btn-primary disabled');
                $('#button').html("Already added");
              }
        }
    });
}

function createIMDbLink(imdbID){

    var link = "<a title='Open the movie in a new tab' target='_blank' href=https://www.imdb.com/title/"+ imdbID +">IMDb Link</a>";
    return link;
}

function getMovies(){
    
  $('#container').empty();

  var tableTemplate = ['<table id="tableDB" class="table"><thead id="tableHead"></thead><tbody></tbody></table>'];

  $('#container').append(tableTemplate);

  $.getJSON({
        type : "POST",
        url: "http://localhost/film.php",
        data: {'title': "mymovies"},

        complete: function(data){
              
              var table_obj = $('#tableDB');
              $.each(data.responseJSON, function(index, item){
                  var table_row = $('<tr>');
                  var table_cell = $('<td>', {html: item.title});
                  var table_cell2 = $('<td>', {html: item.year});
                  var table_cell3 = $('<td>', {html: item.runtime});
                  var table_cell4 = $('<td>', {html: item.country});
                  table_row.append(table_cell);
                  table_row.append(table_cell2);
                  table_row.append(table_cell3);
                  table_row.append(table_cell4);
                  table_obj.append(table_row);
              })
        }
  });

  $('#tableHead').append('<tr><th scope="col">Title</th><th scope="col">Year</th><th scope="col">Runtime</th><th scope="col">Country</th></tr>');
}