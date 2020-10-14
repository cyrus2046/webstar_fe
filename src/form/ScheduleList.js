import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';

class ScheduleList extends Component {

  constructor(props) {
    super(props);
    this.state = {schedules: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch('api/schedules')
      .then(response => response.json())
      .then(data => this.setState({schedules: data, isLoading: false}));
  }

  async remove(id) {
	await fetch(`/api/schedule/${id}`, {
	  method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedSchedules = [...this.state.schedules].filter(i => i.id !== id);
      this.setState({schedules: updatedSchedules});
    });
  }

  render() {
    const {schedules, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const scheduleList = schedules.map(schedule => {
      console.log(schedule);
      return  <tr key={schedule.id}>
        <td style={{whiteSpace: 'nowrap'}}>{schedule.hotel.name}</td>
        <td>{schedule.view.name}</td>
        <td>{schedule.car.license}</td>
        <td>{schedule.car.seat}</td>
        <td>
          <ButtonGroup>

            <Button size="sm" color="primary" tag={Link} to={"/schedule/" + schedule.id}>View</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/schedule/new">Add Schedule</Button>
          </div>
          <h3>定期行程表</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="20%">酒店</th>
              <th width="20%">景点</th>
              <th width="20%">型号</th>
              <th>载人数</th>
            </tr>
            </thead>
            <tbody>
            {scheduleList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default ScheduleList;