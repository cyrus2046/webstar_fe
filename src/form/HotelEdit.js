import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from '../AppNavbar';

class HotelEdit extends Component {

    emptyItem = {
        name: '',
        address: '',
        gpsLatitude: '',
        gpsLongitude: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const hotel = await (await fetch(`/api/hotel/${this.props.match.params.id}`)).json();
            this.setState({item: hotel});
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {item} = this.state;

        await fetch('/api/hotel', {
            method: (item.id) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/hotel');
    }

    render() {
        const {item} = this.state;
        const title = <h2>{item.id ? '更改酒店资料' : '新增酒店资料'}</h2>;

        return <div>
            <AppNavbar/>
            <Container>
            {title}
            <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                    <Label for="name">酒店名字</Label>
                    <Input type="text" name="name" id="model" value={item.name || ''}
                        onChange={this.handleChange} autoComplete="name"/>
                </FormGroup>
                <FormGroup>
                    <Label for="address">地址</Label>
                    <Input type="text" name="address" id="address" value={item.address || ''}
                        onChange={this.handleChange} autoComplete="address"/>
                </FormGroup>
                <FormGroup>
                    <Label for="gpsLatitude">地理位置 (Latitude)</Label>
                    <Input type="text" name="gpsLatitude" id="gpsLatitude" value={item.gpsLatitude || ''}
                        onChange={this.handleChange} autoComplete="gpsLatitude"/>
                </FormGroup>
                <FormGroup>
                    <Label for="gpsLongitude">地理位置 (Longitude)</Label>
                    <Input type="text" name="gpsLongitude" id="gpsLongitude" value={item.gpsLongitude || ''}
                        onChange={this.handleChange} autoComplete="gpsLongitude"/>
                </FormGroup>
                <FormGroup>
                    <Button color="primary" type="submit">储存</Button>{' '}
                    <Button color="secondary" tag={Link} to="/hotel">取消</Button>
                </FormGroup>
            </Form>
            </Container>
        </div>
    }
}
export default withRouter(HotelEdit);