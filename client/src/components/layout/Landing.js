import React, {Fragment} from 'react'
import {Link} from 'react-router-dom';

const Landing = () => {
    return (
        <Fragment>
            <section className="landing">
                <div className="dark-overlay">
                    <div className="landing-inner">
                    <h1 className="x-large">Developer Connector</h1>
                    <p className="lead">
                        Create a developer profile/portfolio, share posts and get help from
                        other developers
                    </p>
                    <div className="buttons">
                        <Link to="/register" clLinkss="btn btn-primLinkry">Sign Up |</Link>
                        <Link to="/login" clLinkss="btn btn-light"> Login</Link>
                    </div>
                    </div>
                </div>
            </section>
        </Fragment>
    )
}

export default Landing;
