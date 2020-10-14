import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';

class ViewList extends Component {

  constructor(props) {
    super(props);
    this.state = {views: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch('api/views')
      .then(response => response.json())
      .then(data => this.setState({views: data, isLoading: false}));
  }

  async remove(id) {
	await fetch(`/api/view/${id}`, {
	  method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedViews = [...this.state.views].filter(i => i.id !== id);
      this.setState({views: updatedViews});
    });
  }

  render() {
    const {views, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const viewList = views.map(view => {
      return  <tr key={view.id}>
        <td style={{whiteSpace: 'nowrap'}}>{view.name}</td>
        <td>{view.address}</td>
        <td>{view.gpsLatitude}</td>
        <td>{view.gpsLongitude}</td>
        <td>{view.open}</td>
        <td>{view.close}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/view/" + view.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(view.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/view/new">Add View</Button>
          </div>
          <h3>景点资料</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="20%">景点名字</th>
              <th width="20%">地址</th>
              <th width="20%">地理位置 (Latitude)</th>
              <th width="20%">地理位置 (Longitude)</th>
              <th width="10%">开放时间</th>
              <th>关闭时间</th>
            </tr>
            </thead>
            <tbody>
            {viewList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default ViewList;