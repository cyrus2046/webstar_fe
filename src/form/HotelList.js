import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';

class HotelList extends Component {

  constructor(props) {
    super(props);
    this.state = {hotels: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch('api/hotels')
      .then(response => response.json())
      .then(data => this.setState({hotels: data, isLoading: false}));
  }

  async remove(id) {
	await fetch(`/api/hotel/${id}`, {
	  method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedHotels = [...this.state.hotels].filter(i => i.id !== id);
      this.setState({hotels: updatedHotels});
    });
  }

  render() {
    const {hotels, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const hotelList = hotels.map(hotel => {
      return  <tr key={hotel.id}>
        <td style={{whiteSpace: 'nowrap'}}>{hotel.name}</td>
        <td>{hotel.address}</td>
        <td>{hotel.gpsLatitude}</td>
        <td>{hotel.gpsLongitude}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/hotel/" + hotel.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(hotel.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/hotel/new">Add Hotel</Button>
          </div>
          <h3>酒店资料</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="20%">酒店名字</th>
              <th width="20%">地址</th>
              <th width="20%">地理位置 (Latitude)</th>
              <th >地理位置 (Longitude)</th>
            </tr>
            </thead>
            <tbody>
            {hotelList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default HotelList;