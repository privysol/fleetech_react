import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import auth from './../auth';

const width300px = {width: "300px"};
const onePxMarginTop = {marginTop: "1px"}
const btnColor = {backgroundColor: "#4F5ECE"};
const userImageStyle = {borderRadius: "50%", width: "100%"}
const greyColor = {color: "grey"}
const messageTitle = {color: "black", fontSize: "7px"}
const messageDetails = {color: "black", fontSize: "9px"}


class Header extends React.Component{
	
	constructor(props) {
		super(props);
		this.state = {
		  isLoggedIn: true,
		  success:false,
		};
	  }

	checkStatus = () => {
		var token = localStorage.getItem("token");
		if(token === null || token === ""){
		  this.setState({
			isLoggedIn: false,
		  });
		}
		else{
		  this.setState({
			isLoggedIn: true,
		  });	
		}
	  }

	handleLogout = (e) => {
		e.preventDefault();
		localStorage.setItem("token", "");
		localStorage.setItem("token", null);
		localStorage.removeItem("token");
	  
		// alert("Logged Out");
		this.setState({
			isLoggedIn: false
		});
		// return <Redirect to="/auth"/>;
	  }
	
	componentWillMount(){
		this.checkStatus();
	}

	render(){
		if(!this.state.isLoggedIn){
			return <Redirect to="/auth"/>
		}
		else{
			return(
				<div>
					<div class="navbar-bg"></div>
						<nav class="navbar navbar-expand-lg main-navbar">
							<div class="form-inline mr-auto">
							<ul class="navbar-nav mr-3">
								<li>
									<div class="input-group" style={width300px}>
									<input type="text" name="search" class="form-control" placeholder="Search Trucks, Drivers or Route"/>
									<div class="input-group-btn" style={onePxMarginTop}>
										<button class="btn btn-primary btn-icon" style={btnColor}>
											<i class="fas fa-search"></i>
										</button>
									</div>
									</div>
								</li>
							</ul>
							</div>
							<ul class="navbar-nav navbar-right">

							<li class="dropdown dropdown-list-toggle"><a href="#" data-toggle="dropdown"
								class="nav-link notification-toggle nav-link-lg beep"><i class="far fa-bell"></i></a>
								<div class="dropdown-menu dropdown-list dropdown-menu-right">
									<div class="dropdown-header">Notifications
									</div>
									<div class="dropdown-list-content dropdown-list-icons">
									<a href="#" class="dropdown-item">
										<span class="dropdown-item-icon  text-white">
										<img src="assets/img/user.png" alt="User" style={userImageStyle}/>
										</span>
										<span class="dropdown-item-desc">
										<div class="row">
											<div class="col-7">
											Muhammad Ahmad Ali
											</div>
											<div class="col-5">
											<i class="fa fa-clock" aria-hidden="true" style={greyColor}></i>&nbsp;&nbsp;10:00AM
											</div>
										</div>
										<span class="time" style={messageTitle}>Just started trip</span>
										<span class="time" style={messageDetails}>Jinnah Hospital, Main Boulevard Stop 1, Lahore</span>
										<span class="time" style={messageDetails}>Main Market, Main Boulevard opt UBL</span>
										</span>
									</a>
									
									</div>
								</div>
							</li>
							
							<li class="dropdown">
								<a href="#" data-toggle="dropdown"
								class="nav-link dropdown-toggle nav-link-lg nav-link-user">
								<img alt="image" src="/assets/img/user.png" class="user-img-radious-style"/>
								<span class="d-sm-none d-lg-inline-block"></span></a>
								<div class="dropdown-menu dropdown-menu-right">
								<div class="dropdown-title">Hello Admin</div>
								<a href="javascript:;" class="dropdown-item has-icon">
									<i class="fas fa-cog"></i> Settings
								</a>
								<div class="dropdown-divider"></div>
								<Link to="auth" class="dropdown-item has-icon text-danger">
									<i class="fas fa-sign-out-alt"></i> Logout
								</Link>
								</div>
							</li>

							</ul>
						</nav>
						<div class="main-sidebar sidebar-style-2">
							<aside id="sidebar-wrapper">
							<div class="sidebar-brand">
							<	Link to="/">
								<img alt="image" src="/assets/img/logo.png" class="header-logo" />
								</Link>
							</div>
							<ul class="sidebar-menu">
								<li class="menu-header"></li>
								<li>
								<Link class="nav-link" to="/">
									<i class="fas fa-signal"></i>
									<span>Dashboard</span>
								</Link>
								</li>

								<li>
								<Link class="nav-link" to="/tracking">
									<i class="fas fa-search"></i>
									<span>Vehicle Tracking</span>
								</Link>
								</li>

								<li>
								<Link class="nav-link" to="/drivers">
									<i class="fas fa-user"></i>
									<span>Drivers</span>
								</Link>
								</li>

								<li>
								<Link class="nav-link" to="/vehicles">
									<i class="fas fa-bus"></i>
									<span>Vehicles</span>
								</Link>
								</li>

								<li>
								<Link class="nav-link" to="/schedules">
									<i class="fas fa-calendar"></i>
									<span>Vehicle Scheduling</span>
								</Link>
								</li>

							</ul>
							</aside>
						</div>
				</div>
				)
		}
	}
}
export default Header;