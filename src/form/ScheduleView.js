import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Table } from 'reactstrap';
import AppNavbar from '../AppNavbar';

class ScheduleEdit extends Component {

    emptyItem = {
        hotel: {},
        car: {},
        view: {},
        scheduleDetails: [],
        toDuration: '',
        backDuration: '',
        remark: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem
        };
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const schedule = await (await fetch(`/api/schedule/${this.props.match.params.id}`)).json();
            this.setState({item: schedule});
        }
    }

    render() {
        const {item} = this.state;
        const title = <h2>定期行程</h2>;

        const scheduleToList = item.scheduleDetails.map(scheduleDetail => {
            console.log(scheduleDetail);
            if(scheduleDetail.type == 1 ) {
                return  <tr key={scheduleDetail.id}>
                <td style={{whiteSpace: 'nowrap'}}>{scheduleDetail.startTime}</td>
                <td >{scheduleDetail.arrivalTime}</td>
                <td></td>
                <td></td>
                </tr>
            } else{
                return "";}
        });

        const scheduleBackList = item.scheduleDetails.map(scheduleDetail => {
            console.log(scheduleDetail);
            if(scheduleDetail.type == 2 ) {
                return  <tr key={scheduleDetail.id}>
                <td style={{whiteSpace: 'nowrap'}}>{scheduleDetail.startTime}</td>
                <td >{scheduleDetail.arrivalTime}</td>
                <td></td>
                <td></td>
                </tr>
            } else{
                return "";}
        });

        return <div>
                    <AppNavbar/>
                    <Container>
                    {title}
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="20%">酒店</th>
                            <th width="20%">景点</th>
                            <th width="20%">汽车</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tr>
                            <td>{item.hotel.name}</td>
                            <td>{item.view.name}</td>
                            <td>{item.car.license}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>去程</td>
                            <td>到達景点</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tbody>
                            {scheduleToList}
                        </tbody>
                        <tr>
                            <td>回程</td>
                            <td>到達酒店</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tbody>
                            {scheduleBackList}
                        </tbody>
                    </Table>
                    <Button color="primary" tag={Link} to="/schedule">關閉</Button>
                    </Container>
                </div>
            }
    }

export default withRouter(ScheduleEdit);