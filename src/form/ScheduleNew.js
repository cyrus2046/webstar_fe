import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from '../AppNavbar';

import moment from 'moment'
import SelectSearch from 'react-select-search';
import './SelectSearch.css';

class ScheduleNew extends Component {

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
        this.initialLoad = true;

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectHotelChange = this.handleSelectHotelChange.bind(this);
        this.handleSelectViewChange = this.handleSelectViewChange.bind(this);
        this.handleSelectCarChange = this.handleSelectCarChange.bind(this);
        this.checkRoute = this.checkRoute.bind(this);
        this.genTimetable = this.genTimetable.bind(this);
    }

    async componentDidMount() {
        if(this.initialLoad){
        console.log(fetch('/api/hotels')
                .then(response => response.json())
                .then( data => this.setState({hotels: data.map(({ id, name }) => ({ value: id, name: name })), isLoading: false})));

        fetch('/api/cars')
            .then(response => response.json())
            .then(data => this.setState({cars: data.map(({ id, license }) => ({ value: id, name: license })), isLoading: false}));

        fetch('/api/views')
            .then(response => response.json())
            .then(data => this.setState({views: data.map(({ id, name, open, close}) => ({ value: id, name: name, open: open, close: close })), isLoading: false}));
        this.initialLoad=false;
        }
    }

    checkRoute(event){
        console.log(event);
        const target = event.target;
        const value = target.value;
        const name = target.name;
    }

    genTimetable(event){
        console.log(event);
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const {item} = this.state;
        const {views} = this.state;

        console.log(item);
        console.log(views);


        let curView= views.filter((value, index, array)=>value.value == item.view.id);

        console.log("curView = " +  JSON.stringify(curView));

        console.log("item.view.id = " + item.view.id);

        const openTime = curView[0].open;
        const closeTime = curView[0].close;

        let startTime = moment(openTime, ['H:m']);
        let endTime = moment(closeTime, ['H:m']);
        let arrivalTime = null;
        let toDuration = 30;
        let backDuration = 40;
        var type=1;

        for(;;){

            if(type==1){
                //going to viewpoint
                arrivalTime=moment(startTime).add(toDuration,'minutes');
                if(!arrivalTime.isBefore(endTime))
                    break;
                var detail={startTime:moment(startTime).format('HH:mm'),arrivalTime:moment(arrivalTime).format('HH:mm'),type:1};
                item.scheduleDetails.push(detail);
                startTime=arrivalTime;
                type=2;
            }else{
                //coming back to hotel
                arrivalTime=moment(startTime).add(backDuration,'minutes');
                var detail={startTime:moment(startTime).format('HH:mm'),arrivalTime:moment(arrivalTime).format('HH:mm'),type:2};
                item.scheduleDetails.push(detail);
                startTime=arrivalTime;
                type=1;
            }
        }
        this.setState({item});
    }

    handleChange(event) {

        const target = event.target;
        const value = target.value;
        const name = target.name;

        let {item} = this.state;
        item[name] = value;
        this.setState({item});
    }

    handleSelectHotelChange(event){
        const {hotels} = this.state;
        let {item} = this.state;
        item.hotel.id = event;
    }

    handleSelectViewChange(event){
        const {views} = this.state;
        let {item} = this.state;
        item.view.id = event;
    }

    handleSelectCarChange(event){
        const {cars} = this.state;
        let {item} = this.state;
        item.car.id = event;
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {item} = this.state;
        console.log(item);

        await fetch('/api/schedule', {
            method: (item.id) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/schedule');
    }

    render() {
        const {item} = this.state;
        const {hotels} = this.state;
        const {views} = this.state;
        const {cars} = this.state;

        const title = <h2>新增定期行程</h2>;

        const scheduleToList = item.scheduleDetails.map(scheduleDetail => {
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
                    {title}<br/>
                    <Form onSubmit={this.handleSubmit}>
                        <table>
                            <tr>
                                <td>酒店</td>
                                <td>景点</td>
                                <td>汽车</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><SelectSearch search="true" options={hotels} name="hotel" id="hotel" placeholder="Choose your language" onChange={this.handleSelectHotelChange} /></td>
                                <td><SelectSearch search="true" options={views} name="view" id="view" placeholder="Choose your language" onChange={this.handleSelectViewChange} /></td>
                                <td><SelectSearch  search="true" options={cars}  name="car" id="car" placeholder="Choose your language" onChange={this.handleSelectCarChange} /></td>
                                <td></td>
                            </tr>
                            <tr height="10"/>
                            <tr>
                                <td>去程所需时间 (分鐘) : </td>
                                <td>回程所需时间 (分鐘) : </td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><Input type="number" name="toDuration" id="toDuration" value={item.toDuration || ''}
                                                                                 onChange={this.handleChange} autoComplete="toDuration"/></td>
                                <td><Input type="number" name="backDuration" id="backDuration" value={item.backDuration || ''}
                                                                                 onChange={this.handleChange} autoComplete="backDuration"/></td>
                                <td><Button color="info" onClick={this.checkRoute}>計算路程時間</Button>{' '}
                                    <Button color="success" onClick={this.genTimetable}>产生定期行程</Button></td>
                                <td></td>
                            </tr>
                        </table>
                        <br/>
                        <table>
                        <tr>
                            <td>去程</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tbody>
                            {scheduleToList}
                        </tbody>
                        <tr>
                            <td>回程</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tbody>
                            {scheduleBackList}
                        </tbody>
                        </table>
                        <br/>

                        <FormGroup>
                            <Button color="primary" type="submit">Save</Button>{' '}
                            <Button color="secondary" tag={Link} to="/schedule">Cancel</Button>
                        </FormGroup>
                    </Form>
                    </Container>
                </div>
    }
}
export default withRouter(ScheduleNew);