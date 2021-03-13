import React from 'react';
import { constants } from '../utils/constants';
import { Alert } from 'react-bootstrap';
import { Link, Redirect, Switch } from 'react-router-dom';
import Header from './../components/Header.js';
import Footer from './../components/Footer.js';
import {Map, Marker, InfoWindow, GoogleApiWrapper} from 'google-maps-react';
import { PieChart } from 'react-minimal-pie-chart';


import auth from './../auth';

import io  from "socket.io-client";
const socket = io.connect("localhost:9001/");

const blackColor = {color: "black", fontSize: "20px"};
const colorBlack = {color:"black"};
const bgColor    = {background: "#d5dcfc"};
const bgColor01  = {color: "#2c51ee"};
const bgColor001 = {color: "#2c51ee", fontSize: "12px"};

const bgColor2   = {background: "#D1F4E8"};
const bgColor02  = {color: "#1CC78D"};
const bgColor002 = {color: "#1CC78D", fontSize: "12px"};

const bgColor3   = {background: "#FCD3D5"};
const bgColor03  = {color: "#F0202D"};
const bgColor003 = {color: "#F0202D", fontSize: "12px"};

const fivePpadding = {padding: "5%"};
const onePpadding = {padding: "1%"};
const zeroPpadding = {padding: "0%"};

const radius2P = {borderRadius: "2%"};

const recentTripStyle = {padding: "2%", height: "500px"};
const recentTp = {fontSize: "10px", textAlign: "center", color: "white", backgroundColor: "#5EE2A0"};
const nineFontSize = {fontSize: "12px", paddingLeft:"5%"}
const recentImage = {width: "70%", borderRadius: "50%"};
const alignLeft = {textAlign: "left"}
const marginTopmForty = {marginTop: "-40%"}
const width90 = {width: "90%"}


const error = {color: "red"}
const decoration = {textDecoration: 'none'};
  

class Dashboard extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      success:false,
      error:"",
      
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

  // this.setState({
  //   activeMarker: marker,
  //   selectedPlace: props,
  //   showingInfoWindow: true
  // });

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
    else {
      this.getData();
    }



    
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
            <div class="main-content">
                <div class="row">

                  <div class="col-8">
                      <section class="section">
                        <div class="section-header">
                          <h1>Dashboard</h1>
                        </div>
                        <div class="row">

                          <div class="col-xl-4 col-lg-6">
                            <Link to="vehicles" style={decoration}>
                              <div class="card">
                                <div class="card-body card-type-3" style={fivePpadding}>
                                  <div class="row">
                                    <div class="col-auto">
                                        <div class="card-circle text-white" style={bgColor}>
                                          <i class="fas fa-car" style={bgColor01}></i>
                                        </div>
                                    </div>
                                    <div class="col">
                                      <b style={bgColor001}>
                                        <p class="font-weight-bold mb-0">Total Vehicles</p>
                                      </b>
                                      <span class="font-weight-bold mb-0" style={blackColor}>{ this.state.total_vehicles }</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>

                          <div class="col-xl-4 col-lg-6">
                            <Link to="drivers" style={decoration}>
                              <div class="card">
                                <div class="card-body card-type-3" style={fivePpadding}>
                                  <div class="row">
                                    <div class="col-auto">
                                        <div class="card-circle text-white" style={bgColor2}>
                                            <i class="fas fa-user" style={bgColor02}></i>
                                        </div>
                                    </div>
                                    <div class="col">
                                      <b style={bgColor002}>
                                        <p class="font-weight-bold mb-0">Total Drivers</p>
                                      </b>
                                      <span class="font-weight-bold mb-0" style={blackColor}>{ this.state.total_drivers }</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div> 

                          <div class="col-xl-4 col-lg-6">
                            <Link to="schedules" style={decoration}>
                              <div class="card">
                                <div class="card-body card-type-3" style={fivePpadding}>
                                  <div class="row">
                                    <div class="col-auto">
                                        <div class="card-circle text-white" style={bgColor3}>
                                            <i class="fas fa-bus" style={bgColor03}></i>
                                        </div>
                                    </div>
                                    <div class="col">
                                      <b style={bgColor003}>
                                        <p class="font-weight-bold mb-0">Vehicles on Trip</p>
                                      </b>
                                      <span class="font-weight-bold mb-0" style={blackColor}>{ this.state.total_on_trip }</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>

                        </div>
                        
                        <div class="row">
                        
                          <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7 col-7">
                            <div class="card">
                              <div class="card-header">
                                <h4 style={colorBlack}>Vehicle Status</h4>
                              </div>
                              <div class="card-body">
                                {/* <div id="piechart"></div> */}
                                <div class="row">
                                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 col-6" style={{ textAlign: 'center', height: "200px" }}>

                                    <table class="table table-responsive">
                                      <tbody>
                                        <tr>
                                          <td>
                                            <p style={{ fontSize: "11px", paddingTop: "20%" }}>
                                            <i class="fa fa-dot-circle" style={{ color: "#2C50EE" }}></i>&nbsp;&nbsp;On The Road
                                            </p>
                                          </td>
                                          <td>
                                            <b>{ this.state.total_on_trip }</b>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <p style={{ fontSize: "11px", paddingTop: "20%" }}>
                                              <i class="fa fa-dot-circle" style={{ color: "#FFB84A" }}></i>&nbsp;&nbsp;Inactive Vehicle
                                            </p>
                                          </td>
                                          <td><b>{ this.state.total_vehicles - this.state.total_on_trip }</b></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 col-6">
                                      <PieChart
                                        style={{
                                          fontFamily:
                                            '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
                                          fontSize: '5px',
                                          marginTop: "-20%"
                                        }}
                                        data={[
                                          { title: 'Inactive Vehicles', value: this.state.total_vehicles - this.state.total_on_trip, color: '#FFB84A' },
                                          { title: 'On The Road', value: this.state.total_on_trip , color: '#2C50EE' },
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
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5 col-5">
                            <div class="card">
                              <div class="card-header">
                                <h4 style={colorBlack}>Driver Status</h4>
                              </div>
                              <div class="card-body" style={onePpadding}>
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
                                                  { title: 'Inactive Vehicles', value: this.state.total_vehicles - this.state.total_on_trip, color: '#DADADB' },
                                                  { title: 'Following Route', value: this.state.total_on_trip , color: '#00B274' },
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
                                              <i class="fa fa-dot-circle" style={{ color: "#00B274", fontSize: "8px" }}></i>&nbsp;&nbsp;<b>Following Routes</b>
                                      </div>
                                      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 col-6">
                                          <PieChart
                                                style={{
                                                  fontFamily:
                                                    '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
                                                  fontSize: '5px',
                                                }}
                                                data={[
                                                  { title: 'Drivers Available', value: this.state.total_drivers - this.state.total_on_trip, color: '#FF6565' },
                                                  { title: 'Total Drivers', value: this.state.total_drivers, color: '#DADADB' },
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
                                              <i class="fa fa-dot-circle" style={{ color: "#FF6565", fontSize: "8px" }}></i>&nbsp;<b>Drivers Available</b>
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
                                <div class="card-body" style={zeroPpadding}>
                                  {/* <div id="simple-map" data-height="400" style={radius2P}></div> */}
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
                      </section>
                  </div>

                  <div class="col-4">
                      <section class="section">
                        <div class="section-header">
                        </div>
                        
                        <div class="row">
                        
                          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 col-12">
                            <div class="card" style={{ height: "860px", overflowY: "scroll", overflowX: "hidden" }}>
                              <div class="card-header">
                                <h4>Recent Trips</h4>
                              </div>
                              <div class="card-body" style={recentTripStyle}>
                              
                                <div>
                                {this.state.recent_trips.map(function(object, i){
                                 return <div>
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

            
            </Switch>
        </div>
        )
    }
	}
// }
// export default Dashboard;
export default GoogleApiWrapper({
  apiKey: constants.GOOGLE_API
})(Dashboard);