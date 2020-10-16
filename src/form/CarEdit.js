import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from '../AppNavbar';

class CarEdit extends Component {

    emptyItem = {
        model: '',
        license: '',
        seat: '',
        remark: ''
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
            const car = await (await fetch(`/api/car/${this.props.match.params.id}`)).json();
            this.setState({item: car});
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

        await fetch('/api/car', {
                method: (item.id) ? 'PUT' : 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/car');
    }

    render() {
        const {item} = this.state;
        const title = <h2>{item.id ? '更改汽车资料' : '新增汽车资料'}</h2>;

        return <div>
            <AppNavbar/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="name">型号</Label>
                        <Input type="text" name="model" id="model" value={item.model || ''}
                            onChange={this.handleChange} autoComplete="model"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="license">牌照号</Label>
                        <Input type="text" name="license" id="license" value={item.license || ''}
                            onChange={this.handleChange} autoComplete="license"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="seat">载人数</Label>
                        <Input type="number" name="seat" id="seat" value={item.seat || ''}
                            onChange={this.handleChange} autoComplete="seat"/>
                    </FormGroup>
                        <FormGroup>
                        <Button color="primary" type="submit">储存</Button>{' '}
                        <Button color="secondary" tag={Link} to="/car">取消</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(CarEdit);