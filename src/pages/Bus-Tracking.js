/*global google*/
import React from 'react';
import { constants } from '../utils/constants';
import { Alert } from 'react-bootstrap';
import { Link, Redirect, Switch } from 'react-router-dom';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import {withGoogleMap, 
    withScriptjs, 
    Map, 
    Marker, 
    InfoWindow, 
    GoogleApiWrapper, 
    DirectionsRenderer,
    Polyline,
    lineSymbol
} from 'google-maps-react';
import { PieChart } from 'react-minimal-pie-chart';

import io  from "socket.io-client";
const socket = io.connect("localhost:9001/");


const colorBlack = {color:"black"};
const onePpadding = {padding: "1%"};

class BusTracking extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
        isLoggedIn: true,
        success:false,
        error:"",
        vehicles: [],
        vehicle_id:"",
        vehicle_name:"",
        vehicle_model:"",
        vehicle_number:"",
        total_seats:"",
        fuel_capacity:"",
        air_conditioning:"",
        accidents:"",
        fuel_consumption:"",
        status:"",

        routes: [],

        recent_trips: [],

        vehicle_lat : 0,
        vehicle_lon : 0,

        activeMarker: {},
        selectedPlace: {},
        showingInfoWindow: false,

        socket_drivers: [],

        socket_speed: "",
        socket_status: "",
        socket_name: "",
        socket_contact: "",
        socket_time: "",
        socket_distance: "",
        socket_distance: "",
        socket_pickup : "",
        socket_destination: "",
        driver_lat: 0,
        driver_lon: 0,
        dest_lat: 0,
        dest_lon: 0,
        driver_status: "ontrip",

        directions: null,

        pathCoordinates: []

    };


  }

async getDirection(o_lat, o_lon, d_lat, d_lon) { 
    // const DIRECTION_URL = "https://maps.googleapis.com/maps/api/directions/json?origin="+origin+"&destination="+destination+"&avoid=highways%20&mode=driving&key="+constants.GOOGLE_API;
    const directionsService = new google.maps.DirectionsService();


    // alert("Origin: "+o_lat+","+o_lon+"\nDestination: "+d_lat+","+d_lon);

    var that = this;
    directionsService.route({
        origin: new google.maps.LatLng(o_lat, o_lon),
        destination: new google.maps.LatLng(d_lat, d_lon),
        travelMode: 'DRIVING'
    }, function(response, status) {
        if (status === 'OK') {
            that.updateCoords(response.routes[0].legs[0].steps);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    }); 

    
}

updateCoords = (data) => {
    var loc = [];

    for(var i=0; i<data.length; i++){
        for(var j=0; j < data[i].path.length; j++){
            loc.push(data[i].path[j]);
        }
    }
    this.setState({
        pathCoordinates: loc
    });

}

onMarkerClick = (props, marker) =>{

    this.setState({
      activeMarker: marker,
      selectedPlace: props,
      showingInfoWindow: true,
    });
  
    var len = this.state.socket_drivers.length;
  
    for(var i=0; i < len; i++){
        if(props.name === this.state.socket_drivers[i].vehicle_id){
            this.setState({
                socket_speed: this.state.socket_drivers[i].speed,
                socket_status: "On my way",
                socket_name: this.state.socket_drivers[i].driver_name,
                socket_contact: this.state.socket_drivers[i].driver_contact,
                socket_time: this.state.socket_drivers[i].total_time,
                socket_distance: this.state.socket_drivers[i].total_distance,
                socket_pickup: this.state.socket_drivers[i].start_address,
                socket_destination: this.state.socket_drivers[i].destination_address,
    
            });
        } 
    }
};

onInfoWindowClose = () =>
  this.setState({
    activeMarker: null,
    showingInfoWindow: false
  });

onMapClicked = () => {
  if (this.state.showingInfoWindow)
    this.setState({
      activeMarker: null,
      showingInfoWindow: false
    });
};

calculateDistance = (lat1, lon1, lat2, lon2) => {

const R = 6371e3; // metres
const φ1 = lat1 * Math.PI/180; // φ, λ in radians
const φ2 = lat2 * Math.PI/180;
const Δφ = (lat2-lat1) * Math.PI/180;
const Δλ = (lon2-lon1) * Math.PI/180;

const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

const d = R * c; // in metres
const finalDistance = Number(Math.round(d/1000+'e'+2)+'e-'+2); // in KM
return finalDistance;
}

async getDetails(id) {

    this.setState({
        loading: true
    });

    var arr = [];
    const url = constants.SERVER_URL+"vehicle/detail/"+id;
    const response = await fetch(url);
    const data = await response.json();

   
    for(var i=0; i< data.length; i++){
        var obj = {
            vehicle_id           : data[i].id,
            vehicle_name         : data[i].vehicle_name,
            vehicle_model        : data[i].vehicle_model,
            vehicle_number       : data[i].vehicle_number,
            total_seats          : data[i].total_seats,
            fuel_capacity        : data[i].fuel_capacity,
            air_conditioning     : data[i].air_conditioning,
            accidents            : data[i].accidents,
            fuel_consumption     : data[i].fuel_consumption,
            lat                  : data[i].lat,
            lon                  : data[i].lon,
            status               : data[i].status,
        };
        arr.push(obj);
    }


    this.setState({
        vehicles: arr,
        loading: false,

        vehicle_id       : arr[0].vehicle_id,
        vehicle_name     : arr[0].vehicle_name,
        vehicle_model    : arr[0].vehicle_model,
        vehicle_number   : arr[0].vehicle_number,
        total_seats      : arr[0].total_seats,
        fuel_capacity    : arr[0].fuel_capacity,
        air_conditioning : arr[0].air_conditioning,
        accidents        : arr[0].accidents,
        fuel_consumption : arr[0].fuel_consumption,
        status           : arr[0].status,

        vehicle_lat      : arr[0].lat,
        vehicle_lon      : arr[0].lon,
    });


    
}

async getRoutes(id) {

    this.setState({
        loading: true
    });

    var arr = [];
    const url = constants.SERVER_URL+"vehicle/routes/"+id;
    const response = await fetch(url);
    const data = await response.json();

   
    for(var i=0; i< data.length; i++){
        var fi_distance = this.calculateDistance(data[i].pickup_lat, data[i].pickup_lon, data[i].dropoff_lat, data[i].dropoff_lon);

        var obj = {
            pickup_address     : data[i].pickup_address,
            pickup_lat         : data[i].pickup_lat,
            pickup_lon         : data[i].pickup_lon,
            dropoff_address    : data[i].dropoff_address,
            dropoff_lat        : data[i].dropoff_lat,
            dropoff_lon        : data[i].dropoff_lon,
            status             : data[i].status,
            total_distance     : fi_distance,
        };
        arr.push(obj);
    }


    this.setState({
        routes: arr,
        loading: false,
    });


    
}


async getOtherDetails(id) {

    this.setState({
        loading: true
    });

    var trip_arr = [];
    const url = constants.SERVER_URL+"web/vehicle-tracking/"+id;
    const response = await fetch(url);
    const data = await response.json();

   
    for(var i=0; i< data.length; i++){
        var obj = {
            schedule_date     : data[i].schedule_date,
            driver_id         : data[i].driver_id,
            driver_name       : data[i].driver_name,
            driver_number     : data[i].driver_number,
            start_time        : data[i].start_time,
            end_time          : data[i].end_time,
            vehicle_id        : data[i].vehicle_id,
            vehicle_name      : data[i].vehicle_name,
            vehicle_number    : data[i].vehicle_number,
            distance          : data[i].distance,
            pickup_address    : data[i].pickup[0].address,
            pickup_lat        : data[i].pickup[0].lat,
            pickup_lon        : data[i].pickup[0].lon,
            dropoff_address   : data[i].dropOff[0].address,
            dropoff_lat       : data[i].dropOff[0].lat,
            dropoff_lon       : data[i].dropOff[0].lon,
            status            : data[i].status,
            created_at        : data[i].created_at,
        };
        trip_arr.push(obj);
    }


    this.setState({
        recent_trips: trip_arr,
        loading: false,
    });


    
}

componentDidMount() {
    const { match: { params } } = this.props;
    this.setState({
        driver_id: params.id
    });

    this.getDetails(params.id);
    this.getRoutes(params.id);

    this.getOtherDetails(params.id);

    socket.on("new_location", data => {
        if(data[0].vehicle_id === params.id){
            this.setState({
                vehicle_lat: data[0].lat,
                vehicle_lon: data[0].lon,
                socket_drivers : data,
                dest_lat:   data[0].destination_lat,
                dest_lon:   data[0].destination_lon,
                socket_drivers : data,
                driver_status: "ontrip",
            });
            this.getDirection(this.state.vehicle_lat, this.state.vehicle_lon, this.state.dest_lat, this.state.dest_lon);
        }
        console.clear();
        console.log("Got Socket Data: "+data);
      });

}


	render(){
    // if(!this.state.isLoggedIn){
		// 	return <Redirect to="/auth"/>
		// }
		// else{
      return(
        <div>
        <Header/>
            <Switch>
            <div class="main-content">
                
            <div class="row">
                
                <div class="col-8">
                    <section class="section">
                    <div class="section-header">
                        <Link to="/vehicles">
                        <h1><i class="fa fa-arrow-left"></i> All Vehicles</h1>
                        </Link>
                    </div>
                    <div class="row">

                        <div class="col-xl-4 col-lg-6">
                        <a href="javascript:;" style={{ textDecoration: "none" }}>
                            <div class="card">
                            <div class="card-body card-type-3" style={{ padding: "5%" }}>
                                <div class="row">
                                <div class="col-auto">
                                    <div class="card-circle text-white" style={{ background: "#d5dcfc" }}>
                                        <i class="fas fa-tachometer-alt" style={{ color: "#2c51ee" }}></i>
                                    </div>
                                </div>
                                <div class="col">
                                    <b style={{ color: "#2c51ee", fontSize: "12px" }}>
                                    <p class="font-weight-bold mb-0">Average Speed</p>
                                    </b>
                                    <span class="font-weight-bold mb-0">55 km/h</span>
                                </div>
                                </div>
                            </div>
                            </div>
                        </a>
                        </div>

                        <div class="col-xl-4 col-lg-6">
                        <a href="javascript:;" style={{ textDecoration: "none" }}>
                            <div class="card">
                            <div class="card-body card-type-3" style={{ padding: "5%" }}>
                                <div class="row">
                                <div class="col-auto">
                                    <div class="card-circle text-white" style={{ background: "#D1F4E8" }}>
                                        <i class="fas fa-map-marked-alt" style={{ color: "#1CC78D" }}></i>
                                    </div>
                                </div>
                                <div class="col">
                                    <b style={{ color: "#1CC78D", fontSize: "12px" }}>
                                    <p class="font-weight-bold mb-0">Milage</p>
                                    </b>
                                    <span class="font-weight-bold mb-0">95,000 km</span>
                                </div>
                                </div>
                            </div>
                            </div>
                        </a>
                        </div> 

                        <div class="col-xl-4 col-lg-6">
                        <a href="javascript:;" style={{ textDecoration: "none" }}>
                            <div class="card">
                            <div class="card-body card-type-3" style={{ padding: "5%" }}>
                                <div class="row">
                                <div class="col-auto">
                                    <div class="card-circle text-white" style={{ background: "#FCD3D5" }}>
                                        <i class="fas fa-bus" style={{ color: "#F0202D" }}></i>
                                    </div>
                                </div>
                                <div class="col">
                                    <b style={{ color: "#F0202D", fontSize: "12px" }}>
                                    <p class="font-weight-bold mb-0">Total on Route Time</p>
                                    </b>
                                    <span class="font-weight-bold mb-0">35:00:00</span>
                                </div>
                                </div>
                            </div>
                            </div>
                        </a>
                        </div>

                    </div>
                    
                    <div class="row">
                    
                        <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 col-8">
                        <div class="card" style={{ height: "250px" }}>
                            <div class="card-header">
                            <h4 style={{ color: "black" }}>Recent Trips</h4>
                            </div>
                            <div class="card-body" style={{ height: "200px" }}>
                            {this.state.recent_trips.map(function(object, i){
                                return <div>
                                    <div class="row" style={{ width: "100%" }}>
                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 col-4">
                                            <div class="row">
                                                <div class="col-4">
                                                <img src="/assets/img/locationicon.png" alt="icon" style={{ height: "40px", marginTop: "60%" }}/>
                                                </div>
                                                <div class="col-8" style={{ marginLeft: "-10%" }}>
                                                    <p style={{ fontSize: "10px" }}><b> { object.start_time } </b></p>
                                                    <p style={{ fontSize: "10px", marginTop: "-30%" }}><b> { object.end_time } </b></p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5 col-5" style={{ textAlign: "left", marginTop: "0%" }}>
                                        <p style={{ fontSize: "10px", lineHeight: "1.0" }}> { object.pickup_address } </p>
                                        <p style={{ fontSize: "10px", lineHeight: "1.0" }}> { object.dropoff_address } </p>
                                        </div>

                                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 col-3" style={{ textAlign: "left", marginTop: "5%" }}>
                                        <div class="row">
                                            <div class="col-4">
                                                <img src="/assets/img/locmarker.png" alt="icon" style={{ height: "30px" }}/>&nbsp;&nbsp;
                                            </div>
                                            <div class="col-8">
                                                <p style={{ fontSize: "12px", color: "black", fontWeight: "bolder" }}> { object.distance } KM </p>
                                            </div>
                                        </div>
                                        </div>
                                    
                                    </div>
                                    </div>
                            })}    
                            </div>
                        </div>
                        </div>

                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 col-4">
                            <div class="card" style={{ height: "250px" }}>
                              <div class="card-header">
                                <h4 style={colorBlack, { fontSize: "14px", color: "black" }}>Estimated Fuel Status</h4>
                              </div>
                              <div class="card-body" style={{ padding: "1%" }}>
                                <div class="row">
                                  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 col-12" style={{ textAlign: 'center', padding: "10%",  height: "235px" }}>

                                    <div class="row" style={{ marginTop: "-10%" }}>
                                      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 col-6">
                                          <PieChart
                                                style={{
                                                  fontFamily:
                                                    '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
                                                  fontSize: '5px',
                                                }}
                                                data={[
                                                  { title: 'Inactive Vehicles', value: 65, color: '#00B274' },
                                                  { title: 'Active Vehicles', value: 35, color: '#DADADB' },
                                                ]}
                                                radius={50}
                                                lineWidth={60}
                                                segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
                                                animate
                                                label={({ dataEntry }) => Math.round(dataEntry.percentage) + '%'}
                                                labelPosition={25}
                                                labelStyle={{
                                                  fill: '#fff',
                                                  opacity: 0.75,
                                                  pointerEvents: 'none',
                                                }}
                                               
                                              />
                                              <i class="fa fa-dot-circle" style={{ color: "#00B274", fontSize: "10px" }}></i>&nbsp;&nbsp;<b>Used</b>
                                      </div>
                                      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 col-6">
                                          <PieChart
                                                style={{
                                                  fontFamily:
                                                    '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
                                                  fontSize: '5px',
                                                }}
                                                data={[
                                                  { title: 'Drivers Available', value: 55, color: '#FF6565' },
                                                  { title: 'Total Drivers', value: 45, color: '#DADADB' },
                                                ]}
                                                radius={50}
                                                lineWidth={60}
                                                segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
                                                animate
                                                label={({ dataEntry }) => Math.round(dataEntry.percentage) + '%'}
                                                labelPosition={25}
                                                labelStyle={{
                                                  fill: '#fff',
                                                  opacity: 0.75,
                                                  pointerEvents: 'none',
                                                }}
                                               
                                              />
                                              <i class="fa fa-dot-circle" style={{ color: "#FF6565", fontSize: "9px" }}></i>&nbsp;<b>Remaining</b>
                                      </div>
                                    </div>

                                  </div>

                                </div>
                              </div>
                            </div>
                          </div>

                    </div>
                    <div class="section-body">
                        <div class="row">
                        <div class="col-12">
                            <div class="card">
                            <div class="card-body" style={{ padding: "0px" }}>
                                {/* <div id="simple-map" data-height="400" style={{ borderRadius: "2%" }}></div> */}
                                
                                <Map
                                    google={this.props.google}
                                    style={{ height: "400px", borderRadius: "2%" }}
                                    className={"map"}
                                    zoom={18}
                                    center={ {
                                        lat: this.state.vehicle_lat,
                                        lng: this.state.vehicle_lon
                                    }}
                                    onClick={this.onMapClicked}
                                    >

                                        <Marker
                                            icon={{
                                                url: "/assets/img/driver_marker.png",
                                                scale: 3
                                            }}
                                            onClick={this.onMarkerClick}
                                            key={this.state.driver_id}
                                            title={this.state.driver_name}
                                            name={this.state.driver_id}
                                            position={ {lat: this.state.vehicle_lat, lng: this.state.vehicle_lon} }
                                        />

                                        {this.state.driver_status && 
                                            <Marker
                                                icon={{
                                                    url: "/assets/img/to_marker.png",
                                                    scale: 3
                                                }}
                                                onClick={this.onMarkerClick}
                                                key={this.state.dest_lat}
                                                title={this.state.dest_lat}
                                                name={this.state.dest_lat}
                                                position={ {lat: this.state.dest_lat, lng: this.state.dest_lon} }
                                            />

                                        }


                                        {this.state.driver_status && 

                                            <Polyline
                                                path={this.state.pathCoordinates}
                                                geodesic={true}
                                                options={{
                                                    strokeColor: "#ff2527",
                                                    strokeOpacity: 0.75,
                                                    strokeWeight: 2,
                                                    icons: [
                                                        {
                                                            icon: lineSymbol,
                                                            offset: "0",
                                                            repeat: "20px"
                                                        }
                                                    ]
                                                }}
                                            />

                                        }

                                        <InfoWindow
                                          marker={this.state.activeMarker}
                                          onClose={this.onInfoWindowClose}
                                          visible={this.state.showingInfoWindow}>

                                          <div style={{ width: "200px", height: "350px", overflowX: 'hidden' }}>
                                              <div class="row">
                                                  <div class="col-5">
                                                      <p style={{ fontSize: "10px" }}>{Math.round(this.state.socket_speed * 10)/100} km/h</p>
                                                  </div>
                                                  <div class="col-7">
                                                      <p style={{ fontSize: "10px", float: "right" }}>{this.state.socket_status}</p>
                                                  </div>
                                              </div>

                                              <div class="row">
                                                  <div class="col-12">
                                                      <b>
                                                          <p style={{ fontSize: "12px", textAlign: "center", fontWeight: "bold" }}>{this.state.socket_name}</p>
                                                      </b>
                                                  </div>
                                                  <div class="col-12" style={{ marginTop: "-8%" }}>
                                                      <p style={{ fontSize: "10px", textAlign: "center" }}><i class="fa fa-phone"></i> {this.state.socket_contact}</p>
                                                  </div>

                                                  <div class="col-12" style={{ marginTop: "-5%" }}>
                                                      <p style={{ fontSize: "10px", textAlign: "center" }}>Heno Bus</p>
                                                  </div>
                                              </div>

                                              <div class="row">
                                                  <div class="col-6" style={{ borderRight: "1px solid grey", textAlign: "right" }}>
                                                      <p style={{ fontSize: "9px", lineHeight: "0.1", marginTop: "10%" }}>Travel Time</p> <br/>
                                                      <p style={{ fontSize: "10px", lineHeight: "0.1", marginTop: "-20%" }}>{this.state.socket_time}</p>
                                                  </div>
                                                  <div class="col-6" style={{ float:"left" }}>
                                                      <p style={{ fontSize: "9px", lineHeight: "0.01", padding: "0px", marginTop: "10%" }}>Distance</p> <br/>
                                                      <p style={{ fontSize: "10px", lineHeight: "0.01", padding: "0px", marginTop: "-20%" }}>{this.state.socket_distance}</p>
                                                  </div>
                                              </div>


                                              <div class="row" style={{ marginTop:"5%" }}>
                                                  <div class="col-2" >
                                                      <img src="/assets/img/from_marker.png" style={{ width: "20px" }} />
                                                  </div>
                                                  <div class="col-10" style={{ float:"left" }}>
                                                      <p style={{ fontSize: "9px", lineHeight: "0.5", padding: "0px" }}>Start Location</p> <br/>
                                                      <p style={{ fontSize: "10px", lineHeight: "1.2", padding: "0px", marginTop: "-15%" }}>{this.state.socket_pickup}</p>
                                                  </div>
                                              </div>

                                              <div class="row" style={{ marginTop:"5%" }}>
                                                  <div class="col-2" >
                                                      <img src="/assets/img/to_marker.png" style={{ width: "20px" }} />
                                                  </div>
                                                  <div class="col-10" style={{ float:"left" }}>
                                                      <p style={{ fontSize: "9px", lineHeight: "0.5", padding: "0px" }}>Destination Location</p> <br/>
                                                      <p style={{ fontSize: "10px", lineHeight: "1.2", padding: "0px", marginTop: "-15%" }}>{this.state.socket_destination}</p>
                                                  </div>
                                              </div>

                                          </div>
                                      </InfoWindow>



                                  </Map>

                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </section>
                </div>

                <div class="col-4">
                    <section class="section">
                    <div class="section-header">
                    </div>
                    
                    <div class="row">
                    
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 col-12">
                        <div class="card">
                            <div class="card-header">
                            </div>
                            <div class="card-body" style={{ padding: "4%", height: "800px" }}>
                            
                            <div>

                                <div style={{ width: "100%", textAlign: "center" }}>
                                <img src="/assets/img/bus.png" alt="User" style={{ width: "80%" }}/>
                                <p style={{ fontSize: "13px", fontWeight: "bolder", color: "black" }}>
                                    { this.state.vehicle_number }
                                </p>
                                <p style={{ fontSize: "10px", lineHeight:"0.5" }}>
                                   <b>Vehicle Name:</b> { this.state.vehicle_name }
                                </p>
                                <p style={{ fontSize: "10px", lineHeight:"0.5" }}>
                                    <b>Vehicle ID:</b> { this.state.vehicle_id }
                                </p>
                                </div>
                                
                                <div style={{ width: "100%", textAlign: "left" }}>
                                <h6>Basic Info</h6>
                                <div >
                                    <div class="table-responsive">
                                        <table class="table table-condensed" style={{ width: "100%" }}>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                    <i class="fa fa-chair"></i>&nbsp;&nbsp;<b>Total Seats</b>
                                                    </td>
                                                    <td>
                                                        <b> { this.state.total_seats }</b>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                    <i class="fa fa-gas-pump"></i>&nbsp;&nbsp;<b>Fuel Capacity</b>
                                                    </td>
                                                    <td>
                                                        <b> { this.state.fuel_capacity }</b>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                    <i class="fa fa-snowflake"></i>&nbsp;&nbsp;<b>Air Conditioning</b>
                                                    </td>
                                                    <td>
                                                        <b> { this.state.air_conditioning }</b>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                    <i class="fa fa-car-crash"></i>&nbsp;&nbsp;<b>Accidents</b>
                                                    </td>
                                                    <td>
                                                        <b> { this.state.accidents }</b>
                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>

                                    </div>                                
                                </div>
                                <hr/>
                                </div>

                                <div style={{ width: "100%", textAlign: "left", overflowY: "scroll" }}>
                                <h6 style={{ color: "black" }}>Bus Routes</h6>
                                {this.state.routes.map(item =>
                                    <div style={{ marginTop: "10%" }}>
                                <div class="row" style={{ width: "100%" }}>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 col-2">
                                    <img src="/assets/img/locationicon.png" alt="icon" style={{ height: "70px" }}/>
                                </div>

                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 col-6" style={{ textAlign: "left", marginTop: "0%" }}>
                                <p style={{ fontSize: "10px", lineHeight: "1.0" }}>{item.pickup_address}</p>
                                <p style={{ fontSize: "10px", lineHeight: "1.0" }}>{item.dropoff_address}</p>
                                </div>

                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 col-4" style={{ textAlign: "left" }}>
                                <div class="row">
                                    <div class="col-4">
                                        <img src="/assets/img/locmarker.png" alt="icon" style={{ height: "20px" }}/>&nbsp;&nbsp;
                                    </div>
                                    <div class="col-8">
                                        <p style={{ fontSize: "10.5px", color: "black", fontWeight: "bolder" }}>{item.total_distance} KM</p>
                                    </div>
                                </div>
                                </div>
                            
                            </div>
                                </div>
                                )} 
                                </div>

                            </div>

                            </div>
                        </div>
                    </div>
                    </div>
                    </section>
                </div>


            </div>
                
            </div>

            
            </Switch>
        </div>
        )
    }
	}
// }
// export default Dashboard;
export default GoogleApiWrapper({
  apiKey: constants.GOOGLE_API
})(BusTracking);