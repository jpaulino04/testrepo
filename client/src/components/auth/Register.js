import React, {Fragment, useState} from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';

//
// import axios from 'axios';

const Register = ({setAlert}) => {

    //Get familiar with hooks
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    }); 

    const {name, email, password, password2} = formData;

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})


    const onSubmit = async e => {
        e.preventDefault();
        if(password !== password2) {
            setAlert('Passwords do not match', 'danger')
        } else {
            console.log('Success');
        }
    }
    return (
        <Fragment>
            <section className="container">
                <h1 className="large text-primary">Sign Up</h1>
                <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
                <form className="form" onSubmit = { e => onSubmit(e)}>
                    <div className="form-group">
                        {/* use 'value' to associate this input with the name on the state */}
                        <input 
                            type="text" 
                            placeholder="Name" 
                            name="name" 
                            onChange = { e => onChange(e)}
                            value = {name}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            name="email" 
                            value = {email}
                            onChange = { e => onChange(e)}
                            required
                        />                    
                    </div>
                    <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value = {password}
                        minLength="6"
                        onChange = { e => onChange(e)}
                        required
                    />
                    </div>
                    <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        value = {password2}
                        minLength="6"
                        onChange = { e => onChange(e)}
                        required
                    />
                    </div>
                    <input type="submit" className="btn btn-primary" value="Register" />
                </form>
                <p className="my-1">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </section>
        </Fragment>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired
}

export default connect(null, {setAlert})(Register);
//When you bring an action, you  need to pass it in
//The first parameter to connect would be state (if any).
//The second parameter is an object with any action: allows you to access props.setAlert
