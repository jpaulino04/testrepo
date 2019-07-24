import React, {Fragment, useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

const Register = () => {

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
            console.log("password don't match")
        } else {
            const newUser = {
                name, 
                email,
                password
            }

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }                        
                }
                const body = JSON.stringify(newUser);

                const res = await axios.post('/api/users', body, config);
                console.log(res.data)
            } catch(err){
                console.log(err.response.data);
            }
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

export default Register;
