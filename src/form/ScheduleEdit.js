import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from '../AppNavbar';

class ScheduleEdit extends Component {

  emptyItem = {
    duration: '',
    hotel: {},
    car: {},
    view: {},
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
      const schedule = await (await fetch(`/api/schedule/${this.props.match.params.id}`)).json();
      this.setState({item: schedule});
    }
  }

  handleChange(event) {
    console.log("in handlechange");
    console.log(event);
    
    const target = event.target;
    const value = target.value;
    const name = target.name;

    console.log(target);
    console.log(value);
    console.log(name);

    let item = {...this.state.item};
    if(name=='view'){ item.view.id = value;}
    else if(name=='hotel'){ item.hotel.id = value;}
    else if(name=='car') {item.car.id = value;}
    else
      item[name] = value;
    this.setState({item});
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
    const title = <h2>{item.id ? '更改汽车' : '新增汽车'}</h2>;

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="duration">duration</Label>
            <Input type="text" name="duration" id="duration" value={item.duration || ''}
                   onChange={this.handleChange} autoComplete="duration"/>
          </FormGroup>
          <FormGroup>
            <Label for="hotel">hotel</Label>
            <Input type="text" name="hotel" id="hotel" value={item.hotel.id || ''}
                   onChange={this.handleChange} autoComplete="hotel"/>
          </FormGroup>
          <FormGroup>
            <Label for="car">car</Label>
            <Input type="text" name="car" id="car" value={item.car.id || ''}
                   onChange={this.handleChange} autoComplete="car"/>
          </FormGroup>
          <FormGroup>
            <Label for="view">hotel</Label>
            <Input type="text" name="view" id="view" value={item.view.id || ''}
                   onChange={this.handleChange} autoComplete="view"/>
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to="/schedule">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(ScheduleEdit);