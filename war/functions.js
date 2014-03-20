//global variables
      var map, latLng, marker, infoWindow;
      var geocoder = new google.maps.Geocoder();
      
      var val = document.getElementById('val'), 
	  dark = true, 
	  body = document.body; 
	  val.innerHTML = 'lighting lux';
      
//ambient light
   function lightListener(lightEvent){
		    var currentLux = lightEvent.value;
		    val.innerHTML = currentLux;
		    if (currentLux > 10) {
		      if(dark){
		        dark = false;
		        body.className = 'lite';
		      }
		    }else{
		      if(!dark){
		        body.className = 'dark';
		        dark = true;
		      }
		    }
		  }
		
//online offline status			
	function updateOnlineStatus(msg) {
			  var status = document.getElementById("status");
			  var condition = navigator.onLine ? "ONLINE" : "OFFLINE";
	
			  status.setAttribute("class", condition);
			  var state = document.getElementById("state");
			  state.innerHTML = condition;
              }

//search for address on google map
      function showAddress(val) {
		    infoWindow.close();
		    _gaq.push(['_trackEvent', 'Maps', 'Search', val, 0, true]);
		    geocoder.geocode( { 'address': val }, function(results, status) {
		      if (status == google.maps.GeocoderStatus.OK) {
		         marker.setPosition(results[0].geometry.location);
		         geocode(results[0].geometry.location);
		      } else {
		         alert("Sorry,could not find this location.");
		      }
		   });
      }

 //marker show address,latitude, longitude   
      function geocode(position) {
		    geocoder.geocode({
				   latLng: position
				}, function(responses) {
				     var html = '';
				     if (responses && responses.length > 0) {
				        
						 //postal address
				    	 var location = document.getElementById('loca');
      					 location.innerHTML = 'something';
      
				        currentLocation = responses[0].formatted_address;
				        location.innerHTML= '<strong>Your location:</strong>' + " "+ currentLocation;
				        
				        html += '<strong>Location Address:</strong><hr/>' + currentLocation;
				        _gaq.push(['_trackEvent', 'Maps', 'Drag', currentLocation, 0, true]);
				       
				     } else{
				    	 //offline 
				    	 var location = document.getElementById('loca');
      					 location.innerHTML = '<strong>Location Address:</strong><hr/>' + marker.getPosition().lat() + ','+ marker.getPosition().lng();
				    	
      					 html += 'Your geolocation below.';
				    	 
				     }
                      
					  //geo
				     html += '<br /><br /><strong>Geo:</strong><hr />' + 'Latitude : ' + marker.getPosition().lat() + '<br/>Longitude: ' + marker.getPosition().lng();
				     map.panTo(marker.getPosition());
				     infoWindow.setContent("<div id='iw'>" + html + "</div>");
				     infoWindow.open(map, marker);
				 });
		  }

 

//fake address finding
      function locationFound(position) {
		    showMap(position.coords.latitude, position.coords.longitude);
		  }

//default address set at VTT
      function defaultLocation() {
		    showMap(65.0564222,25.4559615);
		  }


//marker animation
      function showMap(lat, lng) {

		    latLng = new google.maps.LatLng(lat, lng);

		    map.setCenter(latLng);

		    marker = new google.maps.Marker({
		       position: latLng, map: map, draggable: true, animation: google.maps.Animation.DROP
		    });

		    infoWindow = new google.maps.InfoWindow({
		       content: '<div id="iw"><strong>NOTE:</strong><br /><br />Drag this red marker anywhere in the GoogleMap</div>'
		    });
            
		    infoWindow.open(map, marker);
           //closed the marker window when being dragged
		    google.maps.event.addListener(marker, 'dragstart', function (e) {
		       infoWindow.close();
		    });
            //update postal address when the marker is dragged
		    google.maps.event.addListener(marker, 'dragend', function (e) {
		       var point = marker.getPosition();
		       map.panTo(point);
		       geocode(point);
		    });
		  }
      
    //initialization 
      function initialize() {
				//google map setting
				var myOptions = {
				  zoom: 12,
				  panControl: false,
				  mapTypeId: google.maps.MapTypeId.ROADMAP
				};

				map = new google.maps.Map(document.getElementById('googlemaps'),
				    myOptions); 
                //geolocation
				if (geoPosition.init()) {
				    geoPosition.getCurrentPosition(locationFound, defaultLocation, {enableHighAccuracy:true});
				}else{
				    defaultLocation();
		         }
		       //online offline 
			  updateOnlineStatus("loading...");
				document.body.addEventListener("online", function () { updateOnlineStatus("online") }, false);
				document.body.addEventListener("offline", function () { updateOnlineStatus("offline") }, false);
				// ambient light
				window.addEventListener("devicelight", lightListener, false);
			  
			 }

      
      google.maps.event.addDomListener(window, 'load', initialize);
     
     
    
     
     
