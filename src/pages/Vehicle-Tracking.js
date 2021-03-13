import React from 'react';
import { constants } from '../utils/constants';
import { Alert } from 'react-bootstrap';
import { Link, Redirect, Switch } from 'react-router-dom';
import Header from './../components/Header.js';
import Footer from './../components/Footer.js';
import {Map, Marker, InfoWindow, GoogleApiWrapper} from 'google-maps-react';
import { PieChart } from 'react-minimal-pie-chart';


import io  from "socket.io-client";
const socket = io.connect("localhost:9001/");


const recentTripStyle = {padding: "2%", height: "500px"};
const recentTp = {fontSize: "10px", textAlign: "center", color: "white", backgroundColor: "#5EE2A0"};
const nineFontSize = {fontSize: "12px", paddingLeft:"5%"}
const recentImage = {width: "70%", borderRadius: "50%"};
const alignLeft = {textAlign: "left"}
const width90 = {width: "90%"}

class VehicleTracking extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
        isLoggedIn: true,

        total_drivers:0,
        total_vehicles:0,
        total_on_trip:0,

        on_road: 0,
        inactive_vehicles: 0,

        following_routes: 0,
        drivers_available:0,

        recent_trips: [],

        locations: [],

        ini_lat: 0,
        ini_lon: 0,

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

        current_tracking_id: "",

        start_address: "",
        dest_address: "",
        milage: "0",
        t_distance: "0",
        avg_speed: "0",

        driver_name: "",
        driver_contact: ""


    };


  }

  async getData() {

    this.setState({
        loading: true
    });
    
    var arr = [];
    var trip_arr = [];
    var loc_arr = [];
    const url = constants.SERVER_URL+"web/";
    const response = await fetch(url);
    const data = await response.json();

   
    for(var i=0; i< data.length; i++){
   
        var obj = {
          total_drivers: data[i].total_drivers,
          total_vehicles: data[i].total_vehicles,
          total_on_trip: data[i].ontrip,
          on_road: data[i].on_road,
          inactive_vehicles: data[i].inactive_vehicles,
          following_routes: data[i].following_routes,
          drivers_available: data[i].drivers_available
        };
        arr.push(obj);
    }

    for(var i=0; i< data[0]['recent_trips'].length; i++){
   
      var trip_obj = {
        schedule_date: data[0]['recent_trips'][i].schedule_date,
        driver_id: data[0]['recent_trips'][i].driver_id,
        driver_name: data[0]['recent_trips'][i].driver_name,
        driver_number: data[0]['recent_trips'][i].driver_number,
        start_time: data[0]['recent_trips'][i].start_time,
        end_time: data[0]['recent_trips'][i].end_time,
        vehicle_id: data[0]['recent_trips'][i].vehicle_id,
        vehicle_name: data[0]['recent_trips'][i].vehicle_name,
        vehicle_number: data[0]['recent_trips'][i].vehicle_number,

        distance: data[0]['recent_trips'][i].distance,
        pickup_address: data[0]['recent_trips'][i].pickup[0].address,
        pickup_lat: data[0]['recent_trips'][i].pickup[0].lat,
        pickup_lon: data[0]['recent_trips'][i].pickup[0].lon,
        dropoff_address: data[0]['recent_trips'][i].dropOff[0].address,
        dropoff_lat: data[0]['recent_trips'][i].dropOff[0].lat,
        dropoff_lon: data[0]['recent_trips'][i].dropOff[0].lon,

      };
      trip_arr.push(trip_obj);
    }

    for(var i=0; i< data[0]['driver_locations'].length; i++){
   
      var loc_obj = {
        id         : data[0]['driver_locations'][i].id,
        latitude   : data[0]['driver_locations'][i].lat,
        longitude  : data[0]['driver_locations'][i].lon,
      };

      loc_arr.push(loc_obj);
    }



    this.setState({
        total_drivers: arr[0].total_drivers,
        total_vehicles: arr[0].total_vehicles,
        total_on_trip: arr[0].total_on_trip,
        on_road: arr[0].on_road,
        inactive_vehicles: arr[0].inactive_vehicles,
        following_routes: arr[0].following_routes,
        drivers_available: arr[0].drivers_available,
        recent_trips: trip_arr,
        ini_lat: loc_arr[0].latitude,
        ini_lon: loc_arr[0].longitude,
        locations : loc_arr,
        loading: false,
        // socket_drivers : loc_arr
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
      if(props.name === this.state.socket_drivers[i].id){
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

    async getData() {

        this.setState({
            loading: true
        });
        
        var arr = [];
        var trip_arr = [];
        var loc_arr = [];
        const url = constants.SERVER_URL+"web/";
        const response = await fetch(url);
        const data = await response.json();
        
        if(data.length > 0){
            for(var i=0; i< data.length; i++){
    
                var obj = {
                total_drivers: data[i].total_drivers,
                total_vehicles: data[i].total_vehicles,
                total_on_trip: data[i].ontrip,
                on_road: data[i].on_road,
                inactive_vehicles: data[i].inactive_vehicles,
                following_routes: data[i].following_routes,
                drivers_available: data[i].drivers_available
                };
                arr.push(obj);
            }
    
            for(var i=0; i< data[0]['recent_trips'].length; i++){
        
            var trip_obj = {
                schedule_date: data[0]['recent_trips'][i].schedule_date,
                driver_id: data[0]['recent_trips'][i].driver_id,
                driver_name: data[0]['recent_trips'][i].driver_name,
                driver_number: data[0]['recent_trips'][i].driver_number,
                start_time: data[0]['recent_trips'][i].start_time,
                end_time: data[0]['recent_trips'][i].end_time,
                vehicle_id: data[0]['recent_trips'][i].vehicle_id,
                vehicle_name: data[0]['recent_trips'][i].vehicle_name,
                vehicle_number: data[0]['recent_trips'][i].vehicle_number,
    
                distance: data[0]['recent_trips'][i].distance,
                pickup_address: data[0]['recent_trips'][i].pickup[0].address,
                pickup_lat: data[0]['recent_trips'][i].pickup[0].lat,
                pickup_lon: data[0]['recent_trips'][i].pickup[0].lon,
                dropoff_address: data[0]['recent_trips'][i].dropOff[0].address,
                dropoff_lat: data[0]['recent_trips'][i].dropOff[0].lat,
                dropoff_lon: data[0]['recent_trips'][i].dropOff[0].lon,
    
            };
            trip_arr.push(trip_obj);
            }
    
            for(var i=0; i< data[0]['driver_locations'].length; i++){
        
            var loc_obj = {
                id         : data[0]['driver_locations'][i].id,
                latitude   : data[0]['driver_locations'][i].lat,
                longitude  : data[0]['driver_locations'][i].lon,
            };
    
            loc_arr.push(loc_obj);
            }
    
            this.setState({
                total_drivers: arr[0].total_drivers,
                total_vehicles: arr[0].total_vehicles,
                total_on_trip: arr[0].total_on_trip,
                on_road: arr[0].on_road,
                inactive_vehicles: arr[0].inactive_vehicles,
                following_routes: arr[0].following_routes,
                drivers_available: arr[0].drivers_available,
                recent_trips: trip_arr,
                ini_lat: loc_arr[0].latitude,
                ini_lon: loc_arr[0].longitude,
                locations : loc_arr,
                loading: false,
                // socket_drivers : loc_arr
            });
        }


    
    }

    async g_t_data (dr_id, e) {
        var driver_arr    = [];
        var vehicle_arr      = [];
        var schedule_arr  = [];
        const url = constants.SERVER_URL+"web/vehicle_tracking/"+dr_id;
        const response = await fetch(url);
        const data =  await response.json();


        if(data.length > 0){
            for(var i=0; i< data[0]['driver_details'].length; i++){
    
                var obj = {
                    id: data[0]['driver_details'][0][0]._id,
                    image: data[0]['driver_details'][0][0].image,
                    full_name: data[0]['driver_details'][0][0].full_name,
                    dob: data[0]['driver_details'][0][0].dob,
                    cnic: data[0]['driver_details'][0][0].cnic,
                    phone_no: data[0]['driver_details'][0][0].phone_no,
                    address: data[0]['driver_details'][0][0].address,
                    driving_license: data[0]['driver_details'][0][0].driving_license,
                    license_expiry: data[0]['driver_details'][0][0].license_expiry,
                    driving_experience: data[0]['driver_details'][0][0].driving_experience,
                    duty_hours: data[0]['driver_details'][0][0].duty_hours,
                    past_salary: data[0]['driver_details'][0][0].past_salary,
                    current_salary: data[0]['driver_details'][0][0].current_salary,
                    username: data[0]['driver_details'][0][0].username,
                    status: data[0]['driver_details'][0][0].status,
                    vehicle_id: data[0]['driver_details'][0][0].vehicle_id,
                    vehicle_name: data[0]['driver_details'][0][0].vehicle_name,
                    lat: data[0]['driver_details'][0][0].lat,
                    lon: data[0]['driver_details'][0][0].lon,
                    average_speed: data[0]['driver_details'][0][0].average_speed,
                    speed: data[0]['driver_details'][0][0].speed,
                };
                driver_arr.push(obj);
            }
    
            for(var i=0; i< data[0]['schedule_details'].length; i++){
        
                var obj = {
                    id: data[0]['schedule_details'][0][0]._id,
                    schedule_date: data[0]['schedule_details'][0][0].schedule_date,
                    driver_id: data[0]['schedule_details'][0][0].driver_id,
                    driver_name: data[0]['schedule_details'][0][0].driver_name,
                    driver_number: data[0]['schedule_details'][0][0].driver_number,
                    start_time: data[0]['schedule_details'][0][0].start_time,
                    end_time: data[0]['schedule_details'][0][0].end_time,
                    vehicle_id: data[0]['schedule_details'][0][0].vehicle_id,
                    vehicle_name: data[0]['schedule_details'][0][0].vehicle_name,
                    vehicle_number: data[0]['schedule_details'][0][0].vehicle_number,
                    distance: data[0]['schedule_details'][0][0].distance,
                    status: data[0]['schedule_details'][0][0].status,
                    pickup_address: data[0]['schedule_details'][0][0].pickup[0].address,
                    pickup_lat: data[0]['schedule_details'][0][0].pickup[0].lat,
                    pickup_lon: data[0]['schedule_details'][0][0].pickup[0].lon,
                    dropoff_address: data[0]['schedule_details'][0][0].dropOff[0].address,
                    dropoff_lat: data[0]['schedule_details'][0][0].dropOff[0].lat,
                    dropoff_lon: data[0]['schedule_details'][0][0].dropOff[0].lon,
                };
                schedule_arr.push(obj);
            }
    
            for(var i=0; i< data[0]['vehicle_details'].length; i++){
        
                var obj = {
                    id: data[0]['vehicle_details'][0][0]._id,
                    vehicle_model: data[0]['vehicle_details'][0][0].vehicle_model,
                    vehicle_name: data[0]['vehicle_details'][0][0].vehicle_name,
                    vehicle_number: data[0]['vehicle_details'][0][0].vehicle_number,
                    vehicle_brand: data[0]['vehicle_details'][0][0].vehicle_brand,
                    total_seats: data[0]['vehicle_details'][0][0].total_seats,
                    fuel_capacity: data[0]['vehicle_details'][0][0].fuel_capacity,
                    air_conditioning: data[0]['vehicle_details'][0][0].air_conditioning,
                    accidents: data[0]['vehicle_details'][0][0].accidents,
                    fuel_consumption: data[0]['vehicle_details'][0][0].fuel_consumption,
                    status: data[0]['vehicle_details'][0][0].status,
                    lat: data[0]['vehicle_details'][0][0].lat,
                    lon: data[0]['vehicle_details'][0][0].lon
                };
                vehicle_arr.push(obj);
            }
    
            this.setState({
                driver_name: driver_arr[0].full_name,
                driver_contact: driver_arr[0].phone_no,
                
                driving_license: driver_arr[0].driving_license,
                
                duty_hours: driver_arr[0].duty_hours,
                vehicle_id: driver_arr[0].vehicle_id,
                vehicle_name: driver_arr[0].vehicle_name,
                vehicle_number: vehicle_arr[0].vehicle_number,
                start_address: schedule_arr[0].pickup_address,
                dest_address: schedule_arr[0].dropoff_address,
                milage: "5.6",
                t_distance: schedule_arr[0].distance,
                avg_speed: driver_arr[0].average_speed,
                start_time : schedule_arr[0].start_time,

                ini_lat: driver_arr[0].lat,
                ini_lon: driver_arr[0].lon,
            });
        }
    }

    tracking_data = (dr_id) => {
        this.g_t_data(dr_id);
        // alert("Driver ID: "+dr_id);
    }


componentDidMount() {
    this.getData();


    socket.on("all_driver_location_update", data => {
      var loc_arr = [];      
      for(var i=0; i< data.length; i++){
        var loc_obj = {
          id         : data[i].id,
          latitude   : data[i].lat,
          longitude  : data[i].lon,
        };
  
        loc_arr.push(loc_obj);
      }
      this.setState({
        locations : loc_arr,
        socket_drivers : data
    });

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
            <div>
            <div class="main-content">
                <div class="row">
                    
                    <div class="col-12">
                    <section class="section">
                        <div class="section-header">
                        <h1>Vehicle Tracking</h1>
                        </div>
                        <div class="row">
                        <div class="col-xl-12 col-lg-12">
                            <div class="card">
                                <div class="card-body card-type-3">
                                <div class="row">
                                    
                                    <div class="col-auto">
                                    <div class="card-circle text-white" style={{ background: "#d5dcfc", marginTop: "50%" }}>
                                        <img src="assets/img/user.png" alt="User" style={{ borderRadius: "50%", width: "100%" }}/>
                                    </div>
                                    </div>
                                    <div class="col" style={{ color: "black", borderRight: "1px solid #DFDFDF" }}>
                                    <b style={{ fontSize: "14px" }}>
                                        <p class="font-weight-bold mb-0">{this.state.driver_name}</p>
                                    </b>
                                    <span class="mb-0" style={{ fontSize: "12px" }}><b>Driving License:</b> {this.state.driving_license}</span> <br/>
                                    <span class="mb-0" style={{ fontSize: "12px" }}><b>Duty Time:</b> {this.state.duty_hours}</span><br/>
                                    <span class="mb-0" style={{ fontSize: "12px" }}><b>Contact Number:</b> {this.state.driver_contact}</span>
                                    </div>
                                    
                                    <div class="col" style={{ color: "black", borderRight: "1px solid #DFDFDF" }}>
                                    <b style={{ fontSize: "14px" }}>
                                    <p class="font-weight-bold mb-0">Vehicle Detail</p>
                                    </b>
                                    <span class="mb-0" style={{ fontSize: "12px" }}><b>Vehicle ID:</b> {this.state.vehicle_id}</span> <br/>
                                    <span class="mb-0" style={{ fontSize: "12px" }}><b>Vehicle Name:</b> {this.state.vehicle_name}</span><br/>
                                    <span class="mb-0" style={{ fontSize: "12px" }}><b>Vehicle Number:</b> {this.state.vehicle_number}</span>
                                    </div>
                                    <div class="col" style={{ color: "black", borderRight: "1px solid #DFDFDF" }}>
                                    <b style={{ fontSize: "14px" }}>
                                    <p class="font-weight-bold mb-0">Current Status</p>
                                    </b>
                                    <span class="mb-0" style={{ fontSize: "12px" }}><b>Started Time:</b> {this.state.start_time}</span> <br/>
                                    <span class="mb-0" style={{ fontSize: "12px" }}><b>Pickup Location:</b> {this.state.start_address}</span><br/>
                                    <span class="mb-0" style={{ fontSize: "12px" }}><b>Dropoff Location:</b> {this.state.dest_address}</span>
                                    </div>
                                    <div class="col" style={{ color: "black" }}>
                                    <div class="row" style={{ paddingTop: "20%" }}>
                                        <div class="col-4">
                                        <i class="fa fa-gas-pump" style={{ color: "#FF7070", fontSize: "25px" }}></i><br/>
                                        <p style={{ fontSize: "13px" }}>{Math.round(this.state.milage * 10)/100} Litr</p>
                                        </div>
                                        <div class="col-4">
                                        <i class="fa fa-map-marker" style={{ color: "#687FE5", fontSize: "25px" }}></i><br/>
                                        <p style={{ fontSize: "13px" }}>{Math.round(this.state.t_distance * 10)/100} km</p>
                                        </div>
                                        <div class="col-4">
                                        <i class="fa fa-tachometer-alt" style={{ color: "#FFB84A", fontSize: "25px" }}></i><br/>
                                        <p style={{ fontSize: "13px" }}>{Math.round(this.state.avg_speed * 10)/100} km/h</p>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                
                                </div>
                                </div>
                        </div>
                        </div>
                    </section>
                    </div>
                </div>
                <div class="row">
                    <div class="col-8">
                    <div class="section-body">
                        <div class="row">
                        <div class="col-12">
                            <div class="card">
                            <div class="card-body" style={{ padding: "0px" }}>
                                {/* <div id="simple-map" data-height="600" style={{ borderRadius: "2%" }}></div> */}
                                <Map
                                    google={this.props.google}
                                    style={{ height: "400px", borderRadius: "2%" }}
                                    className={"map"}
                                    zoom={18}
                                    center={ {
                                        lat: this.state.ini_lat,
                                        lng: this.state.ini_lon
                                    }}
                                    onClick={this.onMapClicked}
                                    >
                                      {this.state.locations.map((object, i) => {
                                      return <Marker
                                          onClick={this.onMarkerClick}
                                          icon={{
                                              url: "./assets/img/driver_marker.png",
                                              scale: 0.1
                                          }} 
                                          key={i}
                                          title={object.id}
                                          name={object.id}
                                          position={ {lat: object.latitude, lng: object.longitude} }
                                      />                                      
                                    })}

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
                                                      <img src="./assets/img/from_marker.png" style={{ width: "20px" }} />
                                                  </div>
                                                  <div class="col-10" style={{ float:"left" }}>
                                                      <p style={{ fontSize: "9px", lineHeight: "0.5", padding: "0px" }}>Start Location</p> <br/>
                                                      <p style={{ fontSize: "10px", lineHeight: "1.2", padding: "0px", marginTop: "-15%" }}>{this.state.socket_pickup}</p>
                                                  </div>
                                              </div>

                                              <div class="row" style={{ marginTop:"5%" }}>
                                                  <div class="col-2" >
                                                      <img src="./assets/img/to_marker.png" style={{ width: "20px" }} />
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
                    </div>
                    <div class="col-4">
                    <section class="section">
                        
                        <div class="row">
                        
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 col-12">
                            <div class="card">
                            <div class="card-header">
                                <h4>Drivers & Vehicles</h4>
                            </div>
                            <div class="card-body" style={{ padding: "4%", height: "550px"}}>
                                
                            <div>
                                {this.state.recent_trips.map((object, i) => {
                                 return <div>
                                    <a href="javascript:;" onClick={this.tracking_data.bind(this, object.driver_id)} style={{ textDecoration: "none" }}>
                                        <div class="row">
                                        <div class="col-8">
                                            <h6 style={{ fontSize: "10px" }}>
                                            {object.pickup_address} - {object.dropoff_address}
                                            </h6>
                                        </div>
                                        <div class="col-3">
                                            <p style={recentTp}>
                                            On Time
                                            </p>
                                        </div>
                                        </div>


                                        <div class="row">
                                        <div class="col-8">
                                            
                                            <div class="row">
                                            <div class="col-4" style={{ textAlign: "center", marginTop: "1%" }}>
                                                <img src="assets/img/user.png" alt="User" style={recentImage}/>
                                            </div>
                                            <div class="col-6">
                                                
                                                <div class="row" style={alignLeft}>
                                                <p style={nineFontSize, {margin: "0px", fontSize: "10px", lineHeight: "1.5"}}><b>Driver Name:</b> {object.driver_name}</p>
                                                <p style={nineFontSize, {margin: "0px", fontSize: "9px", lineHeight: "1.5"}}><b>Vehicle Number:</b> {object.vehicle_number}</p>
                                                <p style={nineFontSize, {margin: "0px", fontSize: "9px", lineHeight: "1.5"}}><b>Time: </b> {object.start_time} - {object.end_time}</p>
                                                </div>
                                                
                                            </div>
                                            </div>

                                        </div>
                                        <div class="col-3">
                                            <img src="assets/img/arrow_map.png" alt="User" style={width90}/>
                                        </div>
                                        </div>
                                        <hr/>
                                    </a>
                                 </div>
                                })}
                                </div>
                                
                            </div>
                            </div>
                        </div>
                        </div>
                    </section>
                    </div>
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
})(VehicleTracking);