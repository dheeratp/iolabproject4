var metrosFile = 'json/metros.json';
var metros=[];
var marker;
// geocoder= new google.maps.Geocoder();

google.load('visualization', '1', {'packages': ['geochart','corechart']});

$(document).ready(function()
{
  console.log("In ready");

    getData();
    google.setOnLoadCallback(drawMarkersMap);

     console.log("In ready 1");


    

});


function getData(){
 
    var ajaxConnections = 1;

    console.log("In getData");
    
    var location=[];
    var locationcoord;

    $.getJSON(metrosFile, function (data) { 
          ajaxConnections--;

          if(ajaxConnections == 0) {
            // all 3 have been retrieved
            $.each(data.metros.metro,function(key,value){
              location=[];

                location.push(value.name);
                metros.push(location);
               });

            //with the metros list, draw markers on the map
             drawMarkersMap();

        }
      })
        .fail(function() {
          console.log("getmetros fail");
          --ajaxConnections;
        });

    }

function drawMarkersMap() {
        console.log("In draw");
         
        console.log("number of metros = "+metros.length);

        var table = new google.visualization.DataTable();

        table.addColumn('string','Metro');
        var rows=metros;
        table.addRows(rows);

       /*   var data = google.visualization.arrayToDataTable([
            ['City',   'Population', 'Area'],
            ['Rome',      2761477,    1285.31],
            ['Milan',     1324110,    181.76],
            ['Naples',    959574,     117.27],
            ['Turin',     907563,     130.17],
            ['Palermo',   655875,     158.9],
            ['Genoa',     607906,     243.60],
            ['Bologna',   380181,     140.7],
            ['Florence',  371282,     102.41],
            ['Fiumicino', 67370,      213.44],
            ['Anzio',     52192,      43.43],
            ['Ciampino',  38262,      11]
          ]);*/
        

          //begin: Code for marker
/*
            geocoder.geocode( { 'address': value.name}, function(results, status) 
            {
                            if(status==google.maps.GeocoderStatus.OK){

                              locationcoord=results[0].geometry.location;
                              //console.log("LATITUDE LONGITUDE="+locationcoord);
                             
                            }
                            else{
                                console.log("Geocode was not successful for the following reason: " + status);
                            }
            });



              marker = new google.maps.Marker({
                  draggable:true,
                  animation: google.maps.Animation.DROP,
                  position: locationcoord
                });
*/

          //end: Code for marker

  

          var options = {
            //region: 'IT',
            backgroundColor: '868D91',
            displayMode: 'markers',
            sizeAxis: {minSize: 2, maxSize: 2},
            colorAxis: {minValue: 1, maxValue:3,  colors: ['#438094','#DE3403','#E0D39E']} 
          };
          //colorAxis: {minValue: 0,  colors: ['#FF0000', '#00FF00']}
          var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
          chart.draw(table, options);
    }
