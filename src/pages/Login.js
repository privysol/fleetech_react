import React from 'react';
import auth from '../auth';
import { constants } from '../utils/constants';

import { Link, Redirect } from 'react-router-dom';


class Login extends React.Component{

    constructor(props) {
		super(props);
		this.state = {
            isLoggedIn: false,
            email:"",
            password:"",
        };
		this.checkLogin();
       
    }

    checkLogin = () => {

        var token = localStorage.getItem("token");
		if(token === null || token === ""){
			this.state = {
				isLoggedIn: false,
			};
		}
        else {
            this.state = {
                isLoggedIn: true,
            };	
        }

    }

    onChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        });
    }

    submitForm = (event) => {
        this.performLogin();
        event.preventDefault();
      }
    
    async performLogin(){
        const URL = constants.SERVER_URL+"archon/login";

        var email = this.state.email;
        var password = this.state.password;

        // alert("Email: "+email+"\nPassword: "+password);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email,
              password: password,
            })
        };
        // fetch(URL, requestOptions)
        //     .then(response => response.json())
        //     .then(data => this.setState({ success: true }));

        const response = await fetch(URL, requestOptions);
        const data = await response.json();

        if(data.code === "success"){
            // alert("Response\nCode: "+data.code+"\nMessage: "+data.message+"\nTOKEN: "+data.token);

            var token = data.token;
            localStorage.setItem("token", token);
            this.setState({
                isLoggedIn: true,
            });

        }
        // this.setState({
        //     isLoggedIn: true,
        //   });



        // var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhhbXphc2hhaWtoMTQ4MEBnbWFpbC5jb20iLCJwYXNzd29yZCI6ImhhbXphIiwiaWF0IjoxNTk4MjU0OTM1LCJleHAiOjE1OTgyNTQ5OTV9.jtoZqG-QKpZbnkHuz5M_n0SiZpGCDTmx06VUGIIGANc";
		// localStorage.setItem("token", token);
		// this.setState({
		// 	isLoggedIn: true,
        // });
	}


    render(){

        if(this.state.isLoggedIn){
			return <Redirect to="/"/>
		}

        return(
            <div>
    
            
            <section class="section">
            <div class="container mt-5">
                <div class="row">
                <div class="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
                    <div class="card card-primary">
                    <div class="card-header">
                        <h4>Login</h4>
                    </div>
                    <div class="card-body">
                        <form onSubmit={this.submitForm} class="needs-validation" novalidate="">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input id="email" type="email" class="form-control" name="email" tabindex="1" value={this.state.email} onChange={this.onChange} required autofocus/>
                            <div class="invalid-feedback">
                            Please fill in your email
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="d-block">
                            <label for="password" class="control-label">Password</label>
                            </div>
                            <input id="password" type="password" class="form-control" name="password" value={this.state.password} onChange={this.onChange} tabindex="2" required />
                            <div class="invalid-feedback">
                            Please fill in your password
                            </div>
                        </div>
                      
                        <div class="form-group">
                        </div>
                        <div class="form-group">
                            <button type="submit" name="submit" class="btn btn-primary btn-lg btn-block" tabindex="4">
                            Login
                            </button>
                        </div>
                        </form>
                    
                    </div>
                    </div>
    
                </div>
                </div>
            </div>
            </section>
    
    
        </div>
        )

    }
}
export default Login;