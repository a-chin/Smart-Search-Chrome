// Populate the search box with the text selected from the page
chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendRequest(tab.id, {method: "getSelection"}, function (response) {
        $("#t1").val(response.data);
    });
});


function random_color() {

    var style = 'background: ';

    var r, g, b;

    r = Math.round(Math.random() * 0xFF);
    g = Math.round(Math.random() * 0xFF);
    b = Math.round(Math.random() * 0xFF);

    style += 'rgba(' + r + ',' + g + ',' + b + ',1);';

    /* The formula for calculating luminance is taken from
     * http://www.paciellogroup.com/resources/contrast-analyser.html
     *
     * If there are better methods to change, please let me know.
     */
     var luminance = (r * 299 + g * 587 + b * 114 ) / 1000;

     if (luminance < 125) {
        style += 'color: #FFFFFF';
    } else {
        style += 'color: #000000';
    }

    return style;
}

// this code makes dictionary hash
var pathOfFileToRead = "mthesaur.txt";
var request = new XMLHttpRequest();
request.open("GET", pathOfFileToRead, false);
request.send(null);
var contents = request.responseText.split("\n");
var map = {};
var size = contents.length;
for(var j = 0; j < size; j++)
   	{
 	    contents[j] = contents[j].split(",");
      map[contents[j][0]] = contents[j].slice(1, size);     	    
    }
     //var index = results[0][1];
     //console.debug(map[tokens[index]]);
     //console.debug(tokens[index]); 
     //console.debug(index);
     //console.debug(tokens);
     console.debug(map);
     // console.debug(map["dog"]);
     console.debug("c");

function search(that) {
    var inputText = new String (t1.value);

    // In case someone removed the delimiter, assume ","" to be the default delim
    var delimToken = delim.value ? delim.value : ",";

    var tokens = inputText.split(delimToken);
    var tokens_len = tokens.length;
    for (var i=0; i < tokens_len; i++) {
  /*   chrome.tabs.executeScript(null,
        {code:"var x = 10; x"}, function(results){console.debug(results);}); */
    chrome.tabs.executeScript(null,
        {code:"$(document.body).highlight('"+tokens[i]+"','"+random_color()+"'); var isThere = document.getElementsByClassName('highlight'); var thing=[isThere.length," + i +"]; thing;"}, 
          function(results){
              if(results!= null && results[0][0] == 0){ 
              console.debug(results);
              console.debug(tokens);
              console.debug(tokens[results[0][1]]);
              synonyms = map[tokens[results[0][1]]];
              for(var k = 0; k<10; k++){
                 chrome.tabs.executeScript(null, {code:"$(document.body).highlight('"+synonyms[k]+"','"+random_color()+"');"});
              console.debug(synonyms[k]);
              }
              }
          }
     ); 
}
    if(tokens_len > 0){
      // Scroll such that the last occurence of the first search token is visible
      chrome.tabs.executeScript(null,
      {code:"$(document.body).scrollTop($(\"*:contains('"+ tokens[0] +"'):last\").offset().top)"});
    }

}

function hl_clear(that, anon_fun) {
    if(anon_fun != null)
      chrome.tabs.executeScript(null, {code:"$(document.body).removeHighlight()"},anon_fun);
    else 
      chrome.tabs.executeScript(null, {code:"$(document.body).removeHighlight()"});

}

function handle_keypress() {
    if ( event.which == 13 ) {
        $("#search_btn").click();
    }
    
}
function handle_keypress_dynamic(){
      hl_clear(null,search);
}

document.addEventListener('DOMContentLoaded', function () {
  var searchButton = document.getElementById('search_btn');
  searchButton.addEventListener('click', search);
  //document.addEventListener('keydown', handle_keypress); 
  var clearButton = document.getElementById('clear_btn');
  clearButton.addEventListener('click', hl_clear);

  var searchQuery = document.getElementById('t1');
  searchQuery.addEventListener('keydown', handle_keypress_dynamic);
  var delimField = document.getElementById('delim');
  delimField.addEventListener('keypress', handle_keypress);
});
