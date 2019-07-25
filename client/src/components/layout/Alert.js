import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//Use connect to interact with redux: wether using an action or getting the state

//notice how we access/destructure the props
const Alert = ({alerts}) => alerts !== null &&  alerts.length > 0 && alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        { alert.msg } 
    </div>
));

Alert.propTypes = {
    alerts: PropTypes.array.isRequired
}

//This time we want to get the state and map it to the props
//You get the state from the root reducer
const mapStateToProps = state => ({
    alerts: state.alert
})

export default connect(mapStateToProps)(Alert);
