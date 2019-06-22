import React from 'react';
import { Card, CardBody, Col, Row, Container, Button } from 'reactstrap';

class ProfileCard extends React.Component{

    constructor(props){
        super(props)
    }

    enter = () => {
        this.props.enter(this.props.type);
    }

    render = () => {
        return (
            <button onClick={() => this.enter()} className='button-hover card__type-user'>  
                <Container style={{paddingBottom : 20}}>
                    <div>  
                        <img className='application__user__image' src={this.props.image}/>
                    </div>
                    <div style={{marginTop : 20}} >
                        <div className="dashboard__visitors-chart">
                            <p className="dashboard__visitors-chart-title text-center" style={{fontSize : 25}}> {this.props.name} </p>
                        </div>
                        <div className="dashboard__visitors-chart">
                            <p className="application__span text-center" style={{fontSize : 12, marginTop : 20}} > {this.props.text} </p>
                        </div>
                    </div>
                </Container>
            </button>
        )
    }
}





export default ProfileCard;