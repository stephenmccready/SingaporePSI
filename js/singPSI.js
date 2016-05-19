var transitLayer = new google.maps.TransitLayer();
var mapCenter = new google.maps.LatLng(1.395, 103.77);
var mapOptions = {
    zoom: 11,
    center: mapCenter,
    panControl:true,
    zoomControl:true,
    mapTypeControl:true,
    scaleControl:true,
    streetViewControl:true,
    overviewMapControl:true,
    rotateControl:true,
    mapTypeControlOptions: {
	style:google.maps.MapTypeControlStyle.DROPDOWN_MENU
    },
};
var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
var currentTimeRange="";
var apikeyref="781CF461BB6606ADEA01E0CAF8B352745D7D53A4EBE4FA32";

// Abbreviation of the weather forecast. Maintain a count of each one displayed for later use in the map icon legend
var BR=0,CL=0,DR=0,FA=0,FG=0,FN=0,FW=0,HG=0,HR=0,HS=0,HT=0,HZ=0,LH=0,LR=0,LS=0,OC=0,PC=0
    ,PN=0,PS=0,RA=0,SH=0,SK=0,SN=0,SR=0,SS=0,SU=0,SW=0,TL=0,WC=0,WD=0,WF=0,WR=0,WS=0;

// Array of months used in later date formatting
var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

$(document).ready(function () {
    initialize();
});

function initialize() {

    map.markers = [];
    transitLayer.setMap(map);
	
    // Use geolocation to get the users location
    if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function(position) {
	    var myLatLng = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
	    myMarker=0;
	    // build entire marker first time thru
	    if ( !myMarker ) {
		// define our custom marker image
		var image = new google.maps.MarkerImage(
		    'img/bluedot_retina.png',
		    null, // size
		    null, // origin
		    new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
		    new google.maps.Size( 17, 17 ) // scaled size (required for Retina display icon)
		);
		// then create the new marker
		myMarker = new google.maps.Marker({
		    flat: true,
		    icon: image,
		    map: map,
		    optimized: false,
		    position: myLatLng,
		    title: 'My location',
		    visible: true,
		});
	    // just change marker position on subsequent passes
	    } else {
	        myMarker.setPosition( myLatLng );
	    }
	});
    }
    
// Load PSI Data 
    loadPSIUpdate();
}

function loadPSIUpdate() {
    // The PSI update XML dataset provides PSI readings in Singapore for 5 regions
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
	if (xhttp.readyState == 4 && xhttp.status == 200) {
	    loadPSIUpdateData(xhttp);
	} else {
	    if (xhttp.readyState == 4 && xhttp.status == 401) {
		alert('Error in retreiving the Heavy Rain Warning. ('+xhttp.status+')');
	    } else {
		if (xhttp.readyState == 4 && xhttp.status == 404) {
		    alert('Heavy Rain Warning is not currently available. Please try again later. ('+xhttp.status+')');
		}
	    }
	}
  };
  var url="http://www.nea.gov.sg/api/WebAPI/?dataset=psi_update&keyref="+apikeyref;
  xhttp.open("GET", url, true);
  xhttp.send(); 
}

/* PSI Info
sulphur dioxide (SO2)
particulate matter (PM10)
fine particulate matter (PM2.5)
nitrogen dioxide (NO2)
carbon monoxide (CO)
ozone (O3)

North
Admirality, Kranji, Woodlands, Sembawang, Yishun, Yio Chu Kang, Seletar, Sengkang
South
Holland, Queenstown, Bukit Merah, Telok Blangah, Pasir Panjang, Sentosa, Bukit Timah, Newton, Orchard, City, Marina South
East
Serangoon, Punggol, Hougang, Tampines, Pasir Ris, Loyang, Simei, Kallang, Katong, East Coast, Macpherson, Bedok, Pulau Ubin, Pulau Tekong
West
Lim Chu Kang, Choa Chu Kang, Bukit Panjang, Tuas, Jurong East, Jurong West, Jurong Industrial Estate, Bukit Batok, Hillview, West Coast, Clementi
Central
Thomson, Marymount, Sin Ming, Ang Mo Kio, Bishan, Serangoon Gardens, MacRitchie, Toa Payoh 
*/

function loadPSIUpdateData(xml) {
    var xmlDoc = xml.responseXML;
    map.markers = [];
    transitLayer.setMap(map);    
    map.setZoom(11);
    
    var readingDateTime=xmlDoc.getElementsByTagName('record')[0].getAttribute('timestamp');
    var dd=readingDateTime.substr(6,2);
    var mm=parseInt(readingDateTime.substr(4,2))-1;
    var mmm=monthNames[mm];
    var hhmm=readingDateTime.substr(8,2)+":"+readingDateTime.substr(10,2);
    $("#mainHeader").html(dd+' '+mmm+' at '+hhmm);
    
    var i=0, lat=0, lng=0;
    for (r=0; r<6; r++) {
//	$("#PSI").append(xmlDoc.getElementsByTagName('record')[r].getAttribute('timestamp'));

	i=r*13; // NPSI			Row 1
	var latitude = xmlDoc.getElementsByTagName('latitude')[r].childNodes[0].nodeValue
	var longitude = xmlDoc.getElementsByTagName('longitude')[r].childNodes[0].nodeValue;
	var latlng = new google.maps.LatLng( parseFloat(latitude), parseFloat(longitude)-0.0230 );
	var readingType=xmlDoc.getElementsByTagName('reading')[i].getAttribute('type');
	var readingValue=xmlDoc.getElementsByTagName('reading')[i].getAttribute('value');
	var PSIobject=getPSIicon(readingValue);
	var icon=PSIobject.icon;
	var content="<h5>24 Hour PSI</h5>"+readingValue+" - "+PSIobject.text;
	addMarker(latlng, readingType , content, icon, 'PSI'); //latlng, title, content, icon, filter

	i++; // NPSI_PM25_3HR		Row 3
	latlng = new google.maps.LatLng( parseFloat(latitude)-0.02, parseFloat(longitude)-0.023 );
	readingType=xmlDoc.getElementsByTagName('reading')[i].getAttribute('type');
	readingValue=xmlDoc.getElementsByTagName('reading')[i].getAttribute('value');
	PSIobject=getPSIicon(readingValue);
	icon=PSIobject.icon;
	content="<h5>3 Hour Fine Particle Matter (PM<sub>2.5</sub>)</h5>"+readingValue+" - "+PSIobject.text;
	addMarker(latlng, readingType , content, icon, 'PSI'); //latlng, title, content, icon, filter

	i++; // NO2_1HR_MAX		Row 3
	latlng = new google.maps.LatLng( parseFloat(latitude)-0.02, parseFloat(longitude)-0.0115 );
	readingType=xmlDoc.getElementsByTagName('reading')[i].getAttribute('type');
	readingValue=xmlDoc.getElementsByTagName('reading')[i].getAttribute('value');
	PSIobject=getPSIicon(readingValue);
	icon=PSIobject.icon;
	content="<h5>1 hour Nitrogen Dioxide (NO<sub>2</sub>)</h5>"+readingValue+" - "+PSIobject.text;
	addMarker(latlng, readingType , content, icon, 'PSI'); //latlng, title, content, icon, filter

	i++; // PM10_24HR		Row 1
	latlng = new google.maps.LatLng( parseFloat(latitude), parseFloat(longitude) );
	readingType=xmlDoc.getElementsByTagName('reading')[i].getAttribute('type');
	readingValue=xmlDoc.getElementsByTagName('reading')[i].getAttribute('value');
	PSIobject=getPSIicon(readingValue);
	icon=PSIobject.icon;
	content="<h5>24 Hour Particle Matter (PM<sub>10</sub>)</h5>"+readingValue+" - "+PSIobject.text;
	addMarker(latlng, readingType , content, icon, 'PSI'); //latlng, title, content, icon, filter

	i++; // PM25_24HR		Row 1
	latlng = new google.maps.LatLng( parseFloat(latitude), parseFloat(longitude)-0.0115 );
	readingType=xmlDoc.getElementsByTagName('reading')[i].getAttribute('type');
	readingValue=xmlDoc.getElementsByTagName('reading')[i].getAttribute('value');
	PSIobject=getPSIicon(readingValue);
	icon=PSIobject.icon;
	content="<h5>24 Hour Fine Particle Matter (PM<sub>2.5</sub>)</h5>"+readingValue+" - "+PSIobject.text;
	addMarker(latlng, readingType , content, icon, 'PSI'); //latlng, title, content, icon, filter
	
	i++; // SO2_24HR		Row 1
	latlng = new google.maps.LatLng( parseFloat(latitude), parseFloat(longitude)+0.0115 );
	readingType=xmlDoc.getElementsByTagName('reading')[i].getAttribute('type');
	readingValue=xmlDoc.getElementsByTagName('reading')[i].getAttribute('value');
	PSIobject=getPSIicon(readingValue);
	icon=PSIobject.icon;
	content="<h5>24 Hour Sulphur Dioxide (SO<sub>2</sub>)</h5>"+readingValue+" - "+PSIobject.text;
	addMarker(latlng, readingType , content, icon, 'PSI'); //latlng, title, content, icon, filter
	
	i++; // CO_8HR_MAX		Row 4
	latlng = new google.maps.LatLng( parseFloat(latitude)-0.03, parseFloat(longitude)-0.023 );
	readingType=xmlDoc.getElementsByTagName('reading')[i].getAttribute('type');
	readingValue=xmlDoc.getElementsByTagName('reading')[i].getAttribute('value');
	PSIobject=getPSIicon(readingValue);
	icon=PSIobject.icon;
	content="<h5>8 Hour Carbon Monoxide (CO)</h5>"+readingValue+" - "+PSIobject.text;
	addMarker(latlng, readingType , content, icon, 'PSI'); //latlng, title, content, icon, filter
	
	i++; // O3_8HR_MAX		Row 4
	latlng = new google.maps.LatLng( parseFloat(latitude)-0.03, parseFloat(longitude)-0.0115 );
	readingType=xmlDoc.getElementsByTagName('reading')[i].getAttribute('type');
	readingValue=xmlDoc.getElementsByTagName('reading')[i].getAttribute('value');
	PSIobject=getPSIicon(readingValue);
	icon=PSIobject.icon;
	content="<h5>8 Hour Ozone (O<sub>3</sub>)</h5>"+readingValue+" - "+PSIobject.text;
	addMarker(latlng, readingType , content, icon, 'PSI'); //latlng, title, content, icon, filter
	
	i++; // NPSI_CO			Row 2
	latlng = new google.maps.LatLng( parseFloat(latitude)-0.01, parseFloat(longitude)-0.023 );
	readingType=xmlDoc.getElementsByTagName('reading')[i].getAttribute('type');
	readingValue=xmlDoc.getElementsByTagName('reading')[i].getAttribute('value');
	PSIobject=getPSIicon(readingValue);
	icon=PSIobject.icon;
	content="<h5>24 Hour Carbon Monoxide (CO)</h5>"+readingValue+" - "+PSIobject.text;
	addMarker(latlng, readingType , content, icon, 'PSI'); //latlng, title, content, icon, filter
	
	i++; // NPSI_O3			Row 2
	latlng = new google.maps.LatLng( parseFloat(latitude)-0.01, parseFloat(longitude)-0.0115 );
	readingType=xmlDoc.getElementsByTagName('reading')[i].getAttribute('type');
	readingValue=xmlDoc.getElementsByTagName('reading')[i].getAttribute('value');
	PSIobject=getPSIicon(readingValue);
	icon=PSIobject.icon;
	content="<h5>24 Hour Ozone (O<sub>3</sub>)</h5>"+readingValue+" - "+PSIobject.text;
	addMarker(latlng, readingType , content, icon, 'PSI'); //latlng, title, content, icon, filter
	
	i++; // NPSI_PM10		Row 2
	latlng = new google.maps.LatLng( parseFloat(latitude)-0.01, parseFloat(longitude)+0.0115 );
	readingType=xmlDoc.getElementsByTagName('reading')[i].getAttribute('type');
	readingValue=xmlDoc.getElementsByTagName('reading')[i].getAttribute('value');
	PSIobject=getPSIicon(readingValue);
	icon=PSIobject.icon;
	content="<h5>24 Hour Particle Matter (PM<sub>10</sub>)</h5>"+readingValue+" - "+PSIobject.text;
	addMarker(latlng, readingType , content, icon, 'PSI'); //latlng, title, content, icon, filter
	
	i++; // NPSI_PM25		Row 2
	latlng = new google.maps.LatLng( parseFloat(latitude)-0.01, parseFloat(longitude) );
	readingType=xmlDoc.getElementsByTagName('reading')[i].getAttribute('type');
	readingValue=xmlDoc.getElementsByTagName('reading')[i].getAttribute('value');
	PSIobject=getPSIicon(readingValue);
	icon=PSIobject.icon;
	content="<h5>24 Hour Fine Particle Matter (PM<sub>2.5</sub>)</h5>"+readingValue+" - "+PSIobject.text;
	addMarker(latlng, readingType , content, icon, 'PSI'); //latlng, title, content, icon, filter
	
	i++; // NPSI_SO2		Row 2
	latlng = new google.maps.LatLng( parseFloat(latitude)-0.01, parseFloat(longitude)+0.023 );
	readingType=xmlDoc.getElementsByTagName('reading')[i].getAttribute('type');
	readingValue=xmlDoc.getElementsByTagName('reading')[i].getAttribute('value');
	PSIobject=getPSIicon(readingValue);
	icon=PSIobject.icon;
	content="<h5>24 Hour Sulphur Dioxide (SO<sub>2</sub>)</h5>"+readingValue+" - "+PSIobject.text;
	addMarker(latlng, readingType , content, icon, 'PSI'); //latlng, title, content, icon, filter
    }
}    

/*
PSI Value	Air Quality Descriptor
0 - 50		Good			#479b02
51 - 100	Moderate		#006fa1
101 - 200	Unhealthy		#e7b60d
201 - 300	Very unhealthy		#ea8522
Above 300	Hazardous		#d60000
*/
function getPSIicon(PSIValue) {
    var icon='http://maps.google.com/mapfiles/ms/icons/';
    var text='';
    if (PSIValue<=50){
	icon+="green-dot.png";
	text="Good";
    } else {
	if(PSIValue<=100){
	    icon+="blue-dot.png";
		text="Moderate";
	} else {
	    if(PSIValue<=200){
		icon+="yellow-dot.png";
		text="Unhealthy";
	    } else {
		if(PSIValue<=300){
		    icon+="orange-dot.png";
		    text="Very unhealthy";
		} else {
		    icon+="red-dot.png";
		    text="Hazardous";
		}
	    }
	}
    }
    return {icon: icon, text: text};
}

// ******************************************************************************************************
// Generic Functions
// ******************************************************************************************************

// Using the filter element of the marker object, hide or show the relevant markers
function filterMapLayer(filter) {
    $.each(map.markers, function () {
	if (filter==this.filter) {
	    if (this.map == null) {
		this.setMap(map);
	    }
	} else {
	    this.setMap(null);
	}
    });
}

// Generic add PSI marker to the map function
function addMarker(latlng, title, content, icon, filter) {

    var marker = new google.maps.Marker({
        position: latlng,
	map: map,
	title: title,
        icon: icon,
	content: content,
	filter: filter
      });
      map.markers.push(marker);

      var infowindow = new google.maps.InfoWindow();
      google.maps.event.addListener(marker, 'click', (function(marker) {
	return function() {
	  infowindow.setContent(this.content);
	  infowindow.open(map, marker);
	}
      })(marker));   
    
}