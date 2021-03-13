import React from 'react';
import { Link, Redirect, Switch } from 'react-router-dom';
import Header from './../components/Header.js';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import axios from 'axios';
import { constants } from '../utils/constants';


class ScheduleBus extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
        isLoggedIn: true,
        success:false,
        error:"",
        loading: true,

        schedule_date:"",
        start_time:"",
        end_time:"",

        vehicle_id:"",
        vehicle_name: "",
        vehicle_number: "",
        vehicle_model: "",
        vehicles:[], 
        drivers:[],
        driver_id:"",
        driver_name:"",
        driver_number: "",

        pickup_lat:"",
        pickup_lon:"",
        pickup_address:"",
        dropoff_lat:"",
        dropoff_lon:"",
        dropoff_address:"",

        pickupMarker: [
            {
            title: "Pickup Location",
            name: "Pickup Location",
            position: { lat: 31.40295285107847, lng: 74.21283820613242 }
            }
        ],
        dropoffMarker: [
            {
                title: "Dropoff Location",
                name: "Dropoff Location",
                position: { lat: 31.40295285107847, lng: 74.21283820613242 }
            }
        ],

    };

  }

dateChange = (event) => {
    if(event.target.value === ""){
        this.setState({error: "Please Enter Schedule Date"});
    }
    else{
        this.setState({error: ""});
    }  
    this.setState({schedule_date: event.target.value});
}

startTimeChange = (event) => {
    if(event.target.value === ""){
        this.setState({error: "Please Start Time"});
    }
    else{
        this.setState({error: ""});
    }  
    this.setState({start_time: event.target.value});
}

endTimeChange = (event) => {
    if(event.target.value === ""){
        this.setState({error: "Please Enter End Time"});
    }
    else{
        this.setState({error: ""});
    }  
    this.setState({end_time: event.target.value});
}

vehicleChange = (event) => {
    this.setState({
        vehicle_id: event.target.value,
        vehicle_name: event.target.selectedOptions[0].label
    });
}

driverChange = (event) => {
    this.setState({
        driver_id: event.target.value,
        driver_name: event.target.selectedOptions[0].label
    });
}

onPickupClick = (t, map, coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();

    var address = this.getAddress(lat, lng, "pickup");

    this.setState({
        pickup_lat: lat,
        pickup_lon: lng,
        pickup_address: address
    });


}

onDropoffClick = (t, map, coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();

    var address = this.getAddress(lat, lng, "dropoff");

    this.setState({
        dropoff_lat: lat,
        dropoff_lon: lng,
        dropoff_address: address
    });


}

async getAddress(lat, lng, type="pickup"){

    var URL = "https://us1.locationiq.com/v1/reverse.php?key=pk.87a53fb560ec6f6bc1e1e36aa3c2bd51&lat="+lat+"&lon="+lng+"&format=json";

    const requestOptions = {
        method: 'GET'
        };
    fetch(URL, requestOptions)
        .then(response => response.json())
        .then((response) => {

            if(type === "pickup"){
                this.setState({
                    pickup_address: response.display_name
                });
            }
            else if(type === "dropoff"){
                this.setState({
                    dropoff_address: response.display_name
                });
            }
        });


}

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

async fetchData(){
    var vehicleArr = [];
    var driverArr = [];
    const url = constants.SERVER_URL+"schedule/data";
    const response = await fetch(url);
    const data = await response.json();
  
  
    
    for(var i=0; i< data[0].length; i++){ // DRIVER ARRAY
            
        var id        = data[0][i].id;
        var name      = data[0][i].name;
        var phone_no  = data[0][i].phone_no;
        var obj = {
            id: id,
            name: name,
            phone_no: phone_no
        };
        driverArr.push(obj);

    }

    for(var i=0; i< data[1].length; i++){ // VEHICLE ARRAY
        
        var id              = data[1][i].id;
        var vehicle_name    = data[1][i].vehicle_name;
        var vehicle_number  = data[1][i].vehicle_number;
        var vehicle_model   = data[1][i].vehicle_model;

        var obj = {
            id: id,
            name: vehicle_name,
            number: vehicle_number,
            model: vehicle_model,
        };
        vehicleArr.push(obj);

    }

    this.setState({
        drivers           : driverArr,
        vehicles          : vehicleArr,

        vehicle_id        : data[1][0].id,
        vehicle_name      : data[1][0].vehicle_name,
        vehicle_number    : data[1][0].vehicle_number,
        vehicle_model     : data[1][0].vehicle_model,

        driver_id         : data[0][0].id,
        driver_name       : data[0][0].name,
        driver_number     : data[0][0].phone_no,
    });


}

formSubmit = (event) => {
    this.saveDetails();
    event.preventDefault();
  }

  saveDetails(){

    this.setState({
      saving: true,
    });

    const URL = constants.SERVER_URL+"schedule/";

    var schedule_date     = this.state.schedule_date;
    var driver_id         = this.state.driver_id;
    var driver_name       = this.state.driver_name;
    var driver_number     = this.state.driver_number;
    var start_time        = this.state.start_time;
    var end_time          = this.state.end_time;
    var vehicle_id        = this.state.vehicle_id;
    var vehicle_name      = this.state.vehicle_name;
    var vehicle_number    = this.state.vehicle_number;
    var pickup_address    = this.state.pickup_address;
    var pickup_lat        = this.state.pickup_lat;
    var pickup_lon        = this.state.pickup_lon;
    var dropoff_address   = this.state.dropoff_address;
    var dropoff_lat       = this.state.dropoff_lat;
    var dropoff_lon       = this.state.dropoff_lon;
    var distance          = this.calculateDistance(pickup_lat, pickup_lon, dropoff_lat, dropoff_lon);
    var status            = "active";


    var postData = {
        schedule_date     : schedule_date,
        driver_id         : driver_id,
        driver_name       : driver_name,
        driver_number     : driver_number,
        start_time        : start_time,
        end_time          : end_time,
        vehicle_id        : vehicle_id,
        vehicle_name      : vehicle_name,
        vehicle_number    : vehicle_number,
        status            : status,
        pickup_address    : pickup_address,
        pickup_lat        : pickup_lat,
        pickup_lon        : pickup_lon,
        dropoff_address   : dropoff_address,
        dropoff_lat       : dropoff_lat,
        dropoff_lon       : dropoff_lon,
        distance          : distance,
    };


    axios.post(URL, postData)
    .then(res => {
      
      this.setState({
        schedule_date     : "",
        driver_id         : "",
        driver_name       : "",
        driver_number     : "",
        start_time        : "",
        end_time          : "",
        vehicle_id        : "",
        vehicle_name      : "",
        vehicle_number    : "",
        status            : "",
        pickup_address    : "",
        pickup_lat        : "",
        pickup_lon        : "",
        dropoff_address   : "",
        dropoff_lat       : "",
      });
  
      setTimeout(function(){
        this.setState({success:false});
      }.bind(this),3000);
        
    });

  }


componentDidMount() {
    this.fetchData();
}


	render(){
      return(
        <div>
            <Header/>
            <Switch>
            <div>
                <div class="main-content">
                <section class="section">
                    <div class="section-header">
                        <Link to="schedules">
                        <h1><i class="fa fa-arrow-left"></i> Schedule Bus</h1>
                        </Link>
                    </div>
                    <div class="section-body">
                        

                        <div class="col-12 col-md-12 col-lg-12">
                            <div class="card">
                            <form novalidate="true" onSubmit={this.formSubmit} enctype="multipart/form-data">
                                <div class="card-header">
                                <h4>Schedule New Bus</h4>
                                </div>
                                <div class="card-body">
                                
                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label">Schedule Date</label>
                                    <div class="col-sm-9">
                                    <input type="date" name="schedule_date" value={this.state.schedule_date} class="form-control" required="" onChange={this.dateChange}/>
                                    <div class="invalid-feedback">
                                        Please Enter Schedule Date
                                    </div>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label">Assign Driver</label>
                                    <div class="col-sm-9">
                                        <select class="form-control" onChange={this.driverChange}>
                                          {this.state.drivers.map(item => (
                                              <option value={item.id}>{item.name}</option>
                                          ))}
                                        </select>
                                    </div>
                                </div>
                                

                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label">Start Time</label>
                                    <div class="input-group col-sm-9">
                                    <input type="time" name="start_time" value={this.state.start_time} class="form-control" onChange={this.startTimeChange}/>
                                    </div>
                                    <div class="invalid-feedback">
                                    Please Enter Start Time
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label">End Time</label>
                                    <div class="input-group col-sm-9">
                                    <input type="time" name="end_time" value={this.state.end_time} class="form-control" onChange={this.endTimeChange}/>
                                    </div>
                                    <div class="invalid-feedback">
                                    Please Enter End Time
                                    </div>
                                </div>


                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label">Select Vehicle</label>
                                    <div class="input-group col-sm-9">
                                        <select class="form-control" onChange={this.vehicleChange}>
                                          {this.state.vehicles.map(item => (
                                              <option value={item.id}>{item.name}</option>
                                          ))}
                                        </select>
                                    </div>
                                    <div class="invalid-feedback">
                                    Please Enter Vehicle Number
                                    </div>
                                </div>


                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label">Pickup Location</label>
                                    <div class="col-sm-9">
                                    
                                    <div class="container" style={{ height: "350px",  }}>
                                    <Map
                                            google={this.props.google}
                                            style={{ width: "95%", marginLeft:"-2%", borderRadius: "2%" }}
                                            className={"map"}
                                            zoom={16}
                                            onClick={this.onPickupClick}
                                            initialCenter={ {
                                                lat: 31.40295285107847,
                                                lng: 74.21283820613242
                                            }}>

                                            <Marker
                                                icon={{
                                                    url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                                                    scale: 3
                                                }}
                                                key={1}
                                                title={this.state.pickupMarker.title}
                                                name={this.state.pickupMarker.name}
                                                position={ {lat: this.state.pickup_lat, lng: this.state.pickup_lon} }
                                            />

                                        </Map>
                                    </div>

                                   
                                   
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-sm-3 col-form-label">Dropoff Location</label>
                                    <div class="col-sm-9">
                                    
                                    <div class="container" style={{ height: "350px",  }}>
                                        <Map
                                            google={this.props.google}
                                            style={{ width: "95%", marginLeft:"-2%", borderRadius: "2%" }}
                                            className={"map"}
                                            zoom={16}
                                            onClick={this.onDropoffClick}
                                            initialCenter={ {
                                                lat: 31.40295285107847,
                                                lng: 74.21283820613242
                                            }}>

                                            <Marker
                                                icon={{
                                                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                                    scale: 3
                                                }}
                                                key={1}
                                                title={this.state.dropoffMarker.title}
                                                name={this.state.dropoffMarker.name}
                                                position={ {lat: this.state.dropoff_lat, lng: this.state.dropoff_lon} }
                                            />

                                        </Map>
                                    </div>

                                   
                                   
                                    </div>
                                </div>




                                </div>
                                <div class="card-footer text-right">
                                <button type="submit" class="btn btn-primary">Submit</button>
                                </div>
                            </form>
                            </div>
                        </div>


                    </div>
                    </section>

                </div>
            </div>

            </Switch>
        </div>
        )
    }
}
// export default ScheduleBus;
export default GoogleApiWrapper({
    apiKey: "AIzaSyDuHH2oGoC2GaZyFXevN0tLqJ3hGzAe3mw"
  })(ScheduleBus);