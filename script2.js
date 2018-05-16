  $(document).ready(function() {
    $("#datepicker").datepicker();
  });


var button = document.getElementById('GetUsers');
button.addEventListener("click", getData);


function getData() {
  var x = String(document.getElementById("datepicker").value);
  console.log(x);
  var y = x.substring(6,10);
  var m = x.substring(0,2);
  var d = x.substring(3,5);
  var d2= Number(d)+1;
  //console.log(d2);
  var api = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=" + y + "-" + m + "-" + d+ "&endtime=" + y + "-" + m + "-" + d2;
  console.log(api);
  var outp = document.getElementById("Output");
  clearForm(outp);
  connect(api,outp,search, submit, table, addMag);

}

function clearForm(clear){
  clear.innerHTML = "";
}

function connect(api_param, outp_param, callback, callback3, callback2){
  var url = api_param;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 ) {
            if (xhr.status === 200) {
                var resp = JSON.parse(xhr.responseText);
                //console.log(resp);
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
                  count.innerHTML=count.src;
                  //console.log(count.src);

}

 function submit (resp,outp) {
   for(let i=0; i<resp.features.length; i++) {
                   var location = document.getElementById('location');
                   location.src = resp.features[i].geometry.coordinates;
                   //console.log(resp.features[i].geometry.coordinates);
                   //location.innerHTML=location.src;
                   //console.log(location.src);

                }

   }


function table (resp,outp) {
  for(let i=0; i<resp.features.length; i++) {
    var felt = resp.features[i].properties.felt;
    var mag = resp.features[i].properties.mag;
    var place = resp.features[i].properties.place;

    if (felt != null){
        console.log(felt).count;
        var table = document.getElementById("maint");
        var row = table.insertRow(1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML=place;
        cell2.innerHTML=mag;
        cell3.innerHTML=felt;

      }
  }
  eqfeed_callback(resp);
}


var map, heatmap;

function initMap(resp,outp) {
  console.log('this is a map');

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: new google.maps.LatLng(2.8,-187.3),
    mapTypeId: 'satellite'
  });

  // eqfeed_callback2(resp);
}

window.eqfeed_callback = function(results) {
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(results),
    map: map
  });
}

// window.eqfeed_callback2 = function(results) {
//   heatmap = new google.maps.visualization.HeatmapLayer({
//     data: addMag(results),
//     map: map
//   });
// }


function addMag(results) {
  
  for (var i = 0; i < results.features.length; i++) {
    let text = results.features[i].properties.mag;
    console.log('hey'+ text);
    var coords = results.features[i].geometry.coordinates;
    text.push(new google.maps.LatLng(coords[1],coords[0]));
  }

  return text;
}

function getPoints(results) {
  let points_arr = [];
  for (var i = 0; i < results.features.length; i++) {
    var coords = results.features[i].geometry.coordinates;
    points_arr.push(new google.maps.LatLng(coords[1],coords[0]));
  }

  return points_arr;
}









