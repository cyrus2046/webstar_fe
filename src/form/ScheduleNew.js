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
            fetch('/api/hotels')
                    .then(response => response.json())
                    .then( data => this.setState({hotels: data.map(({ id, name, gpsLatitude, gpsLongitude }) => ({ value: id, name: name, gpsLatitude: gpsLatitude, gpsLongitude: gpsLongitude })), isLoading: false}));

            fetch('/api/cars')
                .then(response => response.json())
                .then(data => this.setState({cars: data.map(({ id, license }) => ({ value: id, name: license })), isLoading: false}));

            fetch('/api/views')
                .then(response => response.json())
                .then(data => this.setState({views: data.map(({ id, name, open, close, gpsLatitude, gpsLongitude})=>({ value: id, name: name, open: open, close: close,
                        gpsLatitude: gpsLatitude, gpsLongitude: gpsLongitude})), isLoading: false}));
            this.initialLoad=false;
        }
    }

    checkRoute(event){
        console.log("checkRoute");
        const {item} = this.state;
        const {views} = this.state;
        const {hotels} = this.state;

        if(!item.hotel.id ||!item.view.id || !item.car.id) {
            console.log('Some mandatory fields is null.');
            return;
        }

        //get selected view object
        let curView= views.filter((value, index, array)=>value.value == item.view.id);

        //get selected hotel object
        let curHotel= hotels.filter((value, index, array)=>value.value == item.hotel.id);

        console.log(curView);
        console.log(curHotel);
        let url = '/api/route/'+curHotel[0].gpsLatitude+'/'
            +curHotel[0].gpsLongitude+'/'+curView[0].gpsLatitude+'/'+curView[0].gpsLongitude;
        fetch(url)
            .then(response => response.json())
            .then(data=>{
                console.log(data);
                item.toDuration = data.toDuration;
                item.backDuration = data.backDuration;
                this.setState({item});
            });
    }

    genTimetable(event){
        const {item} = this.state;
        const {views} = this.state;

        console.log(item);
        console.log(views);

        //get selected view object
        let curView= views.filter((value, index, array)=>value.value == item.view.id);

        const openTime = curView[0].open;
        const closeTime = curView[0].close;

        let startTime = moment(openTime, ['H:m']);
        let endTime = moment(closeTime, ['H:m']);
        let arrivalTime = null;
        let toDuration = item.toDuration;
        let backDuration = item.backDuration;
        var type=1;

        //toDuration and backDuration should have value
        if(toDuration<=0 || backDuration <=0)
            return;

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

        if(!item.hotel.id ||!item.view.id || !item.car.id) {
            console.log('Some mandatory fields is null.');
            return;
        }
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
        const {travelTime} = this.state;

        const title = <h2>新增定期行程</h2>;

        const scheduleToList = item.scheduleDetails.map(scheduleDetail => {
            if(scheduleDetail.type == 1 ) {
                return  <tr key={scheduleDetail.id}>
                <td>{scheduleDetail.startTime}</td>
                <td>{scheduleDetail.arrivalTime}</td>
                <td></td>
                <td></td>
                </tr>
            } else{
                return "";}
        });

        const scheduleBackList = item.scheduleDetails.map(scheduleDetail => {
            if(scheduleDetail.type == 2 ) {
                return  <tr key={scheduleDetail.id}>
                <td>{scheduleDetail.startTime}</td>
                <td>{scheduleDetail.arrivalTime}</td>
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
                                <td><SelectSearch search="true" options={hotels} name="hotel" id="hotel" placeholder="选择酒店" onChange={this.handleSelectHotelChange} /></td>
                                <td><SelectSearch search="true" options={views} name="view" id="view" placeholder="选择景店" onChange={this.handleSelectViewChange} /></td>
                                <td><SelectSearch  search="true" options={cars}  name="car" id="car" placeholder="选择汽车" onChange={this.handleSelectCarChange} /></td>
                                <td></td>
                            </tr>
                            <tr height="10"/>
                            <tr>
                                <td>去程所需时间 (分钟) : </td>
                                <td>回程所需时间 (分钟) : </td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><Input type="number" name="toDuration" id="toDuration" value={item.toDuration || ''}
                                                                                 onChange={this.handleChange} autoComplete="toDuration"/></td>
                                <td><Input type="number" name="backDuration" id="backDuration" value={item.backDuration || ''}
                                                                                 onChange={this.handleChange} autoComplete="backDuration"/></td>
                                <td><Button color="info" onClick={this.checkRoute}>计算路程时间</Button>{' '}
                                    <Button color="success" onClick={this.genTimetable}>产生定期行程</Button></td>
                                <td></td>
                            </tr>
                        </table>
                        <br/>
                        <table>
                        <tr>
                            <td style={{width: '20%'}}>去程</td>
                            <td style={{width: '20%'}}>到达景点时间</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tbody>
                            {scheduleToList}
                        </tbody>
                        <tr>
                            <td>回程</td>
                            <td>到达酒店时间</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tbody>
                            {scheduleBackList}
                        </tbody>
                        </table>
                        <br/>

                        <FormGroup>
                            <Button color="primary" type="submit">储存</Button>{' '}
                            <Button color="secondary" tag={Link} to="/schedule">取消</Button>
                        </FormGroup>
                    </Form>
                    </Container>
                </div>
    }
}
export default withRouter(ScheduleNew);