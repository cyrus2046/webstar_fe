import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from '../AppNavbar';

class ViewEdit extends Component {

  emptyItem = {
    name: '',
    address: '',
    gpsLatitude: '',
    gpsLongitude: '',
    open: '',
    close: ''
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
      const view = await (await fetch(`/api/view/${this.props.match.params.id}`)).json();
      this.setState({item: view});
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

    /*await fetch('/api/group', {
		*/
	await fetch('/api/view/' , {
      method: (item.id) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push('/view');
  }

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? '更改景点资料' : '新增景点资料'}</h2>;

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="name">景点名字</Label>
            <Input type="text" name="name" id="name" value={item.name || ''}
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
            <Label for="open">开放时间</Label>
            <Input type="time" name="open" id="open" value={item.open || ''}
                   onChange={this.handleChange} autoComplete="seat"/>
          </FormGroup>
          <FormGroup>
            <Label for="close">关闭时间</Label>
            <Input type="time" name="close" id="close" value={item.close || ''}
                   onChange={this.handleChange} autoComplete="close"/>
          </FormGroup>
          <FormGroup>open
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to="/view">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(ViewEdit);