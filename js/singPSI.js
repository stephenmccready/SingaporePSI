html, body {
    padding: 0;
    margin: 0;
}

.affix {
    top: 0;
    width: 100%;
}

.affix + .container-fluid {
    padding-top: 75px;
}

#map-container, #map-canvas {width: 100%; height: 100%; position: relative; float: left; clear: both;}
#container-head {background-color:#3366FF;color:#fff;height:7.5em;}
#map-container { padding-top: 1%; float: left; clear: both;}

@media screen and (min-width: 800px) {
    #PSI {
        font-size: 1.25em;
        background-color: #fff;
        font-family: "Roboto","sans-serif";
        overflow: visible;
        left: 205px;
        padding: 0.35em;
        position: absolute;
        top: 18px;
        z-index: 5;
        font-size: 1.1em;
        max-width: 530px;
    }
    
    #map-panel {
        background-color: #fff;
        font-family: "Roboto","sans-serif";
        overflow: visible;
        left: 1%;
        padding: 0.35em;
        position: absolute;
        top: 75px;
        z-index: 5;
        font-size: 1.1em;
	box-shadow: 0 1px 4px -1px rgba(0, 0, 0, 0.3);
    }
    
    #pageContainer {height: 550px;}
    #map-panel img {width:25px; height: 25px;}
}

@media screen and (max-width: 800px) {
    #pageContainer {height: 525px;}
    #map-container {height: 475px;}
    #map-canvas {height: 100%;}
    #map-panel { margin-bottom: 0.5em; }
}

.legend { background-color: silver; padding: .1em; text-align: center; font-size: 1.1em; font-weight: bold;}
.legendItem {float: left;}

@-moz-keyframes pulsate {
    from {
	    -moz-transform: scale(0.25);
	    opacity: 1.0;
    }
    95% {
	    -moz-transform: scale(1.3);
	    opacity: 0;
    }
    to {
	    -moz-transform: scale(0.3);
    	opacity: 0;
    }
}
@-webkit-keyframes pulsate {
    from {
	    -webkit-transform: scale(0.25);
	    opacity: 1.0;
    }
    95% {
            -webkit-transform: scale(1.3);
	    opacity: 0;
    }
    to {
	    -webkit-transform: scale(0.3);
	    opacity: 0;
    }
}
/* get the container that's just outside the marker image, which just happens to have our Marker title in it */
#map-canvas div.gmnoprint[title="My location"] {
    -moz-animation: pulsate 1.5s ease-in-out infinite;
    -webkit-animation: pulsate 1.5s ease-in-out infinite;
    border:1pt solid #fff;
    /* make a circle */
    -moz-border-radius:51px;
    -webkit-border-radius:51px;
    border-radius:51px;
    /* multiply the shadows, inside and outside the circle */
    -moz-box-shadow:inset 0 0 5px #06f, inset 0 0 5px #06f, inset 0 0 5px #06f, 0 0 5px #06f, 0 0 5px #06f, 0 0 5px #06f;
    -webkit-box-shadow:inset 0 0 5px #06f, inset 0 0 5px #06f, inset 0 0 5px #06f, 0 0 5px #06f, 0 0 5px #06f, 0 0 5px #06f;
    box-shadow:inset 0 0 5px #06f, inset 0 0 5px #06f, inset 0 0 5px #06f, 0 0 5px #06f, 0 0 5px #06f, 0 0 5px #06f;
    /* set the ring's new dimension and re-center it */
    height:51px!important;
    margin:-18px 0 0 -18px;
    width:51px!important;
}
/* hide the superfluous marker image since it would expand and shrink with its containing element */
#map-canvas div.gmnoprint[title="My location"] img {
    display:none;
}

/* compensate for iPhone and Android devices with high DPI, add iPad media query */
@media only screen and (-webkit-min-device-pixel-ratio: 1.5), only screen and (device-width: 768px) {
    #map-canvas div.gmnoprint[title="My location"] {
	margin:-10px 0 0 -10px;
    }
}

.airQualityGood {color: #479b02;}
.airQualityModerate {color: #006fa1;}
.airQualityUnhealthy {color: #e7b60d;}
.airQualityVeryUnhealthy {color: #ea8522;}
.airQualityHazardous {color: #d60000;}

.airBGQualityGood {background-color: #479b02; color: #fff; padding: 0 1em 0 1em;}
.airBGQualityModerate {background-color: #006fa1; color: #fff; padding: 0 1em 0 1em;}
.airBGQualityUnhealthy {background-color: #e7b60d; padding: 0 1em 0 1em;}
.airBGQualityVeryUnhealthy {background-color: #ea8522; color: #fff; padding: 0 1em 0 1em;}
.airBGQualityHazardous {background-color: #d60000; color: #fff; padding: 0 1em 0 1em;}

.seperator {border-top: 1px solid silver; height: 0.5em; margin-top: 0.5em; clear: all;}

.gm-style-iw {
top: -3px !important;	
bottom: 3px !important;
}
