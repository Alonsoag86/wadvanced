  $(document).ready(function() {
    $("#datepicker").datepicker();
  });


var button = document.getElementById('GetUsers');
button.addEventListener("click", getUserData);


function getUserData() {
  var x = String(document.getElementById("datepicker").value);
  console.log(x);
  var y = x.substring(6,10);
  var m = x.substring(0,2);
  var d = x.substring(3,5);
  var d2= Number(d)+1;
  console.log(d2);
  var api = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=" + y + "-" + m + "-" + d+ "&endtime=" + y + "-" + m + "-" + d2;
  console.log(api);
  //console.log(query);
  // var query = document.getElementById('mood');
  // console.log(query);
  var outp = document.getElementById("Output");
  clearForm(outp);
  connect(api,outp,search, submit, table);

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
                // document.getElementById("Output").innerHTML = xhr.responseText;
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
                  //console.log(resp.data[i].images.original.url);
                  // outp.appendChild(count);
                  count.innerHTML=count.src;
                  console.log(count.src);

}

 function submit (resp,outp) {
   for(let i=0; i<resp.features.length; i++) {
                   var location = document.getElementById('location');
                   location.src = resp.features[i].geometry.coordinates;
                   //let data = JSON.stringify(location.src);
                   console.log(resp.features[i].geometry.coordinates);
                   // outp.appendChild(location);
                   location.innerHTML=location.src;
                   //console.log(location.src);

                }

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

      }
  }
  //console.log("test1", resp.features);
  eqfeed_callback(resp);
}

// write a json file


var map, heatmap;

function initMap(resp,outp) {
  console.log('this is a map');
  /*for(let i=0; i<resp.features.length; i++) {
    var a = resp.features[i].geometry.coordinates[0];
    console.log("this is" +a);
     var b = resp.features[i].geometry.coordinates[1];
   } */

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: new google.maps.LatLng(2.8,-187.3),
    mapTypeId: 'satellite'
  });


}

        
      

window.eqfeed_callback = function(results) {
  for (var i = 0; i < results.features.length; i++) {
    var coords = results.features[i].geometry.coordinates;
    var latLng = new google.maps.LatLng(coords[1],coords[0]);

    var contentString = toString(results.features[i].properties.mag);
       
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

           var marker = new google.maps.Marker({
           position: latLng,
           map: map
           });

    marker.addListener('click', function() {
          infowindow.open(map, marker);
        });


    console.log(coords);
 
  
 
  }
}






