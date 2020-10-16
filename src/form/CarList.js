import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';

class CarList extends Component {

    constructor(props) {
        super(props);
        this.state = {cars: [], isLoading: true};
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: true});
        fetch('api/cars')
            .then(response => response.json())
            .then(data => this.setState({cars: data, isLoading: false}));
    }

    async remove(id) {
        await fetch(`/api/car/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedCars = [...this.state.cars].filter(i => i.id !== id);
            this.setState({cars: updatedCars});
        });
    }

    render() {
    const {cars, isLoading} = this.state;

    if (isLoading) {
        return <p>Loading...</p>;
    }

    const carList = cars.map(car => {
        return  <tr key={car.id}>
            <td style={{whiteSpace: 'nowrap'}}>{car.model}</td>
            <td>{car.license}</td>
            <td>{car.seat}</td>
            <td>
            <ButtonGroup>
                <Button size="sm" color="primary" tag={Link} to={"/car/" + car.id}>Edit</Button>
                <Button size="sm" color="danger" onClick={() => this.remove(car.id)}>Delete</Button>
            </ButtonGroup>
            </td>
        </tr>
        });

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/car/new">Add Car</Button>
                    </div>
                    <h3>汽车资料</h3>
                    <Table className="mt-4">
                        <thead>
                            <tr>
                                <th width="20%">型号</th>
                                <th width="20%">牌照号</th>
                                <th>载人数</th>
                            </tr>
                        </thead>
                        <tbody>
                        {carList}
                    </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}
export default CarList;