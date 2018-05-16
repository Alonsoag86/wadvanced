/*
Data made available by the USGS Earthquake Hazards program
https://earthquake.usgs.gov/
This project was completed thanks to the help of Tuba Ozkan and Kunal Jain
from the New School  (course Web Advanced: Javascript APIs S18)
*/
$(document).ready(function() {
    $("#datepicker").datepicker();
  });


var button = document.getElementById('GetData');
button.addEventListener("click", mainf);


function mainf() {
  var x = String(document.getElementById("datepicker").value);
  console.log(x);
  var y = x.substring(6,10);
  var m = x.substring(0,2);
  var d = x.substring(3,5);
  var d2= Number(d)+1;
  console.log(d2);
  var api = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=" + y + "-" + m + "-" + d+ "&endtime=" + y + "-" + m + "-" + d2;
  console.log(api);
  var outp = document.getElementById("Output");
  clearForm(outp);
  connect(api, outp, search, submit, table);

}

  L.mapbox.accessToken = 'pk.eyJ1IjoibmF0ZWhlZm5lciIsImEiOiJjaWVvejA3OWIwaWJ0c3ltM3hnOHh1ZzR4In0.3wQpEr-1qUe7TkZ0O9TW9w';
      var northWest = L.latLng(100, -180);
      var southEast = L.latLng(-100, 180);
      var bounds = L.latLngBounds(northWest, southEast);
      var map = L.mapbox.map('map', 'mapbox.light', {
        maxBounds: bounds,
        maxZoom: 2
      });

function clearForm(clear){
  clear.innerHTML = "";
}

function connect(api_param, outp_param, callback, callback2, callback3){
  var url = api_param;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 ) {
            if (xhr.status === 200) {
                var resp = JSON.parse(xhr.responseText);
                callback(resp,outp_param);
                callback2(resp,outp_param);
                callback3(resp,outp_param);
            } else {
                outp_param.innerHTML = "There was an error";
            }
          }
  }
  xhr.send(null);


}

function search (resp,outp) {
                  var count = document.getElementById('count');
                  count.src = resp.metadata.count;
                  count.innerHTML='There were' + ' ' + count.src + ' ' + 'earthquakes in the 24 hours you selected.';
                  console.log(count.src);

}

 

function table (resp,outp) {
  for(let i=0; i<resp.features.length; i++) {
    var felt = resp.features[i].properties.felt;
    var mag = resp.features[i].properties.mag;
    var place = resp.features[i].properties.place;

    if (felt != null){
        var table = document.getElementById("maint");
        var row = table.insertRow(1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML=place;
        cell2.innerHTML=mag;
        cell3.innerHTML=felt;
        var report = document.getElementById("maint").rows.length;
        console.log(report);
        var reported = document.getElementById('felt');
        reported.innerHTML = 'Of those, only' + ' ' + (report - 1) + ' ' + 'were reported as felt.';
        //console.log(count);

      }
  }

}


 function submit (resp,outp, clear) {
   for(let i=0; i<resp.features.length; i++) {
                   var location = document.getElementById('location');
                   location.src = resp.features[i].geometry.coordinates;
                   //console.log(resp.features[i].geometry.coordinates);
                   var time = new Date(resp.features[i].properties.time);
                   //console.log(time);
                   var mag = resp.features[i].properties.mag;
                   var place = resp.features[i].properties.place;
                   //console.log(mag);
                   L.marker([location.src[1], location.src[0]]).bindPopup(
                    place + '<br/>' + 'Magnitude of:' + ' ' + mag + '</br>' + time.toString()).addTo(map); 

                }

   }




