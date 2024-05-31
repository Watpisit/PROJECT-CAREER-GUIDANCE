import Header from './Header';
import Navbar from './Navbar';
import { Container, Row, Col, Spinner, Button, Table } from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import './MenuCourse.css'
import { Link} from 'react-router-dom';

export default function MenuCourse() {


    const [loading, setLoading] = useState(false);
    const [grayBackground, setGrayBackground] = useState(false);
    const [row, setRow] = useState(false);
    const isActive = 5;



    const [facultyAll ,setFacultyAll ] = useState([]);
    document.body.style.overflowY = 'auto'


    const getFaculty = async () => {
        setGrayBackground(false)
        setRow(true)
        setLoading(true);

        const response = await fetch(
            "http://localhost:8080/api/get_faculty",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                }
            }
        );
        const result = await response.json();
        setFacultyAll(result.data);

        setRow(false);
        setLoading(false);
    }

    useEffect(() => {
        getFaculty();
    }, []);











    return (

        <>
            <Header />


            <Container fluid >
                <Row className={row ? 'row-content-course-heightlock' : 'row-content-course-maxheight'}>
                    <Navbar isActive={isActive} />

                    <Col sm={9} md={10} className='col-content-course' >
                        <div className='div-content-course-true'>
                            <div className={grayBackground ? 'gray-background' : ''} >
                                <div className='header-course'>
                                    หลักสูตร
                                    <img
                                        src='https://cdn-icons-png.flaticon.com/128/8074/8074800.png'
                                        alt='logo-faculty'
                                    >
                                    </img>
                                </div>


                                {facultyAll.length > 0 ? (
                                    <div className='div-table-ranking'>
                                        <Table striped bordered hover className='table-ranking'>
                                            <thead>
                                                <tr>
                                                    <th className='text-center'>
                                                        No.
                                                    </th >
                                                    <th className='text-center'>
                                                        คณะ
                                                    </th>
                                                    <th className='text-center'>
                                                        รายละเอียด
                                                    </th>
                                                 
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {facultyAll.map((item, idx) => (

                                                    <tr key={item.facultyID}>
                                                        <td className='text-center'>
                                                            <div className='d-flex align-items-center justify-content-center '>
                                                                {idx + 1} 
                                                            </div>
                                                        </td>
                                                        <td className='text-center'>
                                                            <div className='d-flex align-items-center justify-content-center' >
                                                                {item.facultyName}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <Link to={`/CourseDetails/${item.facultyID}`} 
                                                            className="d-flex justify-content-center">
                                                                <img
                                                                src='https://cdn-icons-png.flaticon.com/128/3352/3352681.png'
                                                                alt='course'>
                                                                </img>
                                                            </Link>
                                                        </td>
                                                      
                                                    </tr>
                                                ))
                                                }
                                            </tbody>
                                        </Table>
                                    </div>

                                ) : loading ? (
                                    <div className='div-button-loading'>
                                        <Button variant="primary" disabled style={{ opacity: '1' }}>
                                            <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                                            Loading...
                                        </Button>
                                    </div>
                                ) : <div className='div-button-loading'>
                                    <Button variant="primary" disabled style={{ opacity: '1' }}>
                                        <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                                        Loading...
                                    </Button>
                                </div>}
                            </div>







                        </div>
                    </Col>
                </Row>

            </Container>



        </>
    )
}