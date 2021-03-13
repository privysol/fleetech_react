/*global google*/
import React from 'react';
import { constants } from '../utils/constants';
import { Alert } from 'react-bootstrap';
import { Link, Redirect, Switch } from 'react-router-dom';
import Header from './../components/Header.js';
import Footer from './../components/Footer.js';
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
import { convertLatLngToObj } from "../../src/utils/helper";

import io  from "socket.io-client";
import { fromRenderProps } from 'recompose';
const socket = io.connect("localhost:9001/");

const colorBlack = {color:"black"};
const onePpadding = {padding: "1%"};


// const pathCoordinates = [
//     {
//         "lat":31.403350000000003,
//         "lng":74.21271
//      },
//      {
//         "lat":31.403440000000003,
//         "lng":74.21261000000001
//      },
//      {
//         "lat":31.4035,
//         "lng":74.21254
//      },
//      {
//         "lat":31.403710000000004,
//         "lng":74.21231
//      },
//      {
//         "lat":31.40397,
//         "lng":74.21201
//      },
//      {
//         "lat":31.404010000000003,
//         "lng":74.21197000000001
//      },
//      {
//         "lat":31.404300000000003,
//         "lng":74.21167000000001
//      },
//      {
//         "lat":31.404640000000004,
//         "lng":74.21131000000001
//      },
//      {
//         "lat":31.404760000000003,
//         "lng":74.21118000000001
//      },
//      {
//         "lat":31.405170000000002,
//         "lng":74.2107
//      },
//      {
//         "lat":31.40555,
//         "lng":74.21029
//      }
//     ];

// const DIRECTION_URL = "https://maps.googleapis.com/maps/api/directions/json?origin=31.403188186768677,74.2125090994906&destination=31.403040249839915,74.20589156323823&avoid=highways%20&mode=driving&key=AIzaSyBjrQpQc3KV7UqkYj2ke0NSTd1SBRebs-4";


class DriverTracking extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
        isLoggedIn: true,
        success:false,
        error:"",

        driver_name: "",
        driver_contact: "",
        driver_cnic: "",
        driver_dob: "",
        driver_address: "",
        duty_time: "",
        license_no: "",
        average_speed: "",

        vehicle_id: "",
        vehicle_name: "",
        vehicle_number: "",
        
        recent_trips: [],
        driver_lat: 0,
        driver_lon: 0,
        dest_lat: 0,
        dest_lon: 0,
        driver_status: "ontrip",

        directions: null,

        pathCoordinates: []
        
        };


    }

    


    onMarkerClick = (props, marker) =>{

        this.setState({
          activeMarker: marker,
          selectedPlace: props,
          showingInfoWindow: true,
        });
      
        var len = this.state.socket_drivers.length;
      
        for(var i=0; i < len; i++){
            if(props.name === this.state.socket_drivers[i].driver_id){
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

    async getDirection(o_lat, o_lon, d_lat, d_lon) { 
        // const DIRECTION_URL = "https://maps.googleapis.com/maps/api/directions/json?origin="+origin+"&destination="+destination+"&avoid=highways%20&mode=driving&key="+constants.GOOGLE_API;
        const directionsService = new google.maps.DirectionsService();

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

    async getDrivers(id) {

        this.setState({
            loading: true
        });

        var arr = [];
        const url = constants.SERVER_URL+"driver/detail/"+id;
        const response = await fetch(url);
        const data = await response.json();

    
        for(var i=0; i< data.length; i++){
            var obj = {
                image               : data[i].image,
                full_name           : data[i].full_name,
                dob                 : data[i].dob,
                cnic                : data[i].cnic,
                phone_no            : data[i].phone_no,
                address             : data[i].address,
                driving_license     : data[i].driving_license,
                license_expiry      : data[i].license_expiry,
                driving_experience  : data[i].driving_experience,
                average_speed       : data[i].average_speed,
                duty_hours          : data[i].duty_hours,
                past_salary         : data[i].past_salary,
                current_salary      : data[i].current_salary,
                username            : data[i].username,
                password            : data[i].password,
                vehicle_id          : data[i].vehicle_id,
                vehicle_name        : data[i].vehicle_name,
                vehicle_number      : data[i].vehicle_number,
                status              : data[i].status,
                lat                 : data[i].lat,
                lon                 : data[i].lon,
                created_at          : data[i].created_at,
            };
            arr.push(obj);
        }


        this.setState({
            drivers: arr,
            loading: false,

            driver_name      : arr[0].full_name,
            driver_contact   : arr[0].phone_no,
            driver_cnic      : arr[0].cnic,
            driver_dob       : arr[0].dob,
            driver_address   : arr[0].address,
            duty_time        : arr[0].duty_hours,
            license_no       : arr[0].driving_license,
            vehicle_id       : arr[0].vehicle_id,
            vehicle_name     : arr[0].vehicle_name,
            vehicle_number   : arr[0].vehicle_number,
            average_speed    : arr[0].average_speed,

            driver_lat       : arr[0].lat,
            driver_lon       : arr[0].lon,

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

            directions: null,

        });


        
    }

    async getOtherDetails(id) {

        this.setState({
            loading: true
        });

        var trip_arr = [];
        const url = constants.SERVER_URL+"web/driver-tracking/"+id;
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
       
        // this.getDirection();

        const { match: { params } } = this.props;
        this.setState({
            driver_id: params.id
        });

        this.getDrivers(params.id);

        this.getOtherDetails(params.id);

        socket.on("new_location", data => {

            if(data[0].driver_id === params.id){
                this.setState({
                    driver_lat: data[0].lat,
                    driver_lon: data[0].lon,
                    dest_lat:   data[0].destination_lat,
                    dest_lon:   data[0].destination_lon,
                    socket_drivers : data,
                    driver_status: "ontrip",
                });
                this.getDirection(this.state.driver_lat, this.state.driver_lon, this.state.dest_lat, this.state.dest_lon);
            }
            console.clear();
            console.log("Got Socket Data: "+JSON.stringify(data));
        });


    }
    

	render(){
    // if(!this.state.isLoggedIn){
		// 	return <Redirect to="/auth"/>
		// }
		// else{
        const data = this.state.drivers;
      return(
        <div>
        <Header/>
            <Switch>
            <div class="main-content">
                
            <div class="row">
                
                <div class="col-8">
                    <section class="section">
                    <div class="section-header">
                        <Link to="/drivers">
                        <h1><i class="fa fa-arrow-left"></i> Driver Profile</h1>
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
                                    <span class="font-weight-bold mb-0">{Math.round(this.state.average_speed * 10)/100} km/h</span>
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
                                    <p class="font-weight-bold mb-0">Total Traveling</p>
                                    </b>
                                    <span class="font-weight-bold mb-0">400 km</span>
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
                                    <p class="font-weight-bold mb-0">Total Drive Time</p>
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
                        <div class="card" style={{ height: "200px" }}>
                            <div class="card-header">
                            <h4>Recent Trips</h4>
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
                            <div class="card" style={{ height: "200px" }}>
                              <div class="card-header">
                                <h4 style={colorBlack}>Driving Status</h4>
                              </div>
                              <div class="card-body" style={{ padding: "1%" }}>
                                <div class="row">
                                  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 col-12" style={{ textAlign: 'center', padding: "10%",  height: "235px" }}>

                                    <div class="row" style={{ marginTop: "-20%" }}>
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
                                                lineWidth={30}
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
                                              <i class="fa fa-dot-circle" style={{ color: "#00B274", fontSize: "10px" }}></i>&nbsp;&nbsp;<b>Run Time</b>
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
                                                lineWidth={30}
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
                                              <i class="fa fa-dot-circle" style={{ color: "#FF6565", fontSize: "10px" }}></i>&nbsp;<b>Idle Time</b>
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
                               
                                <Map
                                    google={this.props.google}
                                    style={{ height: "400px", borderRadius: "2%" }}
                                    className={"map"}
                                    zoom={18}
                                    center={ {
                                        lat: this.state.driver_lat,
                                        lng: this.state.driver_lon
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
                                        position={ {lat: this.state.driver_lat, lng: this.state.driver_lon} }
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

                <div class="col-4" style={{ marginTop: "3%" }}>
                    <section class="section">
                    <div class="section-header">
                    </div>
                    
                    <div class="row">
                    
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 col-12">
                        <div class="card">
                            <div class="card-header">
                            </div>
                            <div class="card-body" style={{ padding: "4%", height: "670px" }}>
                            
                            <div>

                                <div style={{ width: "100%", textAlign: "center" }}>
                                <img src="/assets/img/user.png" alt="User" style={{ width: "40%", borderRadius: "50%" }}/>
                                <p style={{ fontSize: "13px", fontWeight: "bolder", color: "black", marginTop: "5%", lineHeight: "0.5" }}>
                                    {this.state.driver_name}
                                </p>
                                <p style={{ fontSize: "10px", lineHeight: "0.5" }}>
                                    Duty Time: {this.state.duty_time}
                                </p>
                                <p style={{ fontSize: "10px", lineHeight: "0.5" }}>
                                    Driving License: {this.state.license_no}
                                </p>
                                </div>
                                
                                <div style={{ width: "100%", textAlign: "left" }}>
                                <h6>Basic Info</h6>
                                <div style={{ paddingLeft: "10%" }}>
                                    <i class="fa fa-calendar-alt" style={{ color: "#FCC164" }}>&nbsp;&nbsp;{this.state.driver_dob}</i><br/><br/>
                                    <i class="fa fa-id-card" style={{ color: "#4D6AEC" }}>&nbsp;&nbsp;{this.state.driver_cnic}</i><br/><br/>
                                    <i class="fa fa-phone" style={{ color: "#01B274" }}>&nbsp;&nbsp;{this.state.driver_contact}</i><br/><br/>
                                    <i class="fa fa-map-marker-alt" style={{ color: "#F0202D" }}>&nbsp;&nbsp;{this.state.driver_address}</i>
                                </div>
                                <hr/>
                                </div>

                                <div style={{ width: "100%", textAlign: "left" }}>
                                <h6>Vehicle Detail</h6>
                                <br/>
                                <div style={{ paddingLeft: "10%" }}>
                                    <p style={{lineHeight: "0.5"}}><b>Vehicle ID:</b>     {this.state.vehicle_id}</p>
                                    <p style={{lineHeight: "0.5"}}><b>Vehicle Name:</b>   {this.state.vehicle_name}</p>
                                    <p style={{lineHeight: "0.5"}}><b>Vehicle Number:</b> {this.state.vehicle_number}</p>
                                </div>
                                <br/>
                                <div style={{ textAlign: "center" }}>
                                    <img src="/assets/img/bus.png" alt="User" style={{ width: "80%" }}/>
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
})(DriverTracking);