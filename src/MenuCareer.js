import Header from './Header';
import Navbar from './Navbar';
import { Container, Row, Col, Spinner, Button, Table,OverlayTrigger ,Tooltip  } from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import './MenuCourse.css'
import './MenuCareer.css'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function MenuCourse() {


    const [loading, setLoading] = useState(false);
    const [grayBackground, setGrayBackground] = useState(false);
    const [row, setRow] = useState(false);
    const isActive = 7;
    const [careerAll, setCareerAll] = useState([]);

    document.body.style.overflowY = 'auto'



    const getCareer = async () => {
        setGrayBackground(false)
        setRow(true)
        setLoading(true);

        const response = await fetch(
            "http://localhost:8080/api/get_career",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                }
            }
        );
        const result = await response.json();
        setCareerAll(result.data);

        setRow(false);
        setLoading(false);
    }

    useEffect(() => {
        getCareer();
    }, []);


    const onDelete = async (career) => {
        const result = await Swal.fire({
            title: 'คุณต้องการลบอาชีพนี้หรือไม่?',
            text: career.careerName,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ตกลง',
            cancelButtonText: "ยกเลิก"
        });

        if (result.isConfirmed) {
            await confirmDelete(career);
            await Swal.fire({
                title: 'ลบข้อมูลสำเร็จ',
                text: 'กรุณากด "เสร็จสิ้น" เพื่อดำเนินการต่อ',
                icon: 'success',
                confirmButtonText: 'เสร็จสิ้น'
            });
        }


    }

    const confirmDelete = async (career1) => {
        const response = await fetch(
            "http://localhost:8080/api/delete_career",
            {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    careerID: career1.careerID
                })
            }
        );
        await response.json();
        getCareer();

    }











    return (

        <>
            <Header />
            <Container fluid >
                <Row className={row ? 'row-content-course-heightlock' : 'row-content-course-maxheight'}>
                    <Navbar isActive={isActive} />

                    <Col sm={9} md={10} className='col-content-course' >
                        <div className='div-content-course-true'>
                            <div className={grayBackground ? 'gray-background' : ''} >
                                <div className='header-course-add ' >
                                    <div>เพิ่ม ลบ แก้ไขอาชีพ</div>
                                    <Link to={`/career/add`}>
                                        <img
                                            src='https://cdn-icons-png.flaticon.com/128/1090/1090923.png'
                                            alt='add'
                                        >
                                        </img>
                                    </Link>
                                </div>


                                {careerAll.length > 0 ? (
                                    <div className='div-table-ranking'>
                                        <Table striped bordered hover className='table-ranking'>
                                            <thead>
                                                <tr>
                                                    <th className='text-center'>
                                                        No.
                                                    </th >
                                                    <th className='text-center'>
                                                        หลักสูตร
                                                    </th>
                                                    <th className='text-center'>
                                                        แก้ไข
                                                    </th>
                                                    <th className='text-center'>
                                                        ลบ
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {careerAll.map((item, idx) => (

                                                    <tr key={item.careerID}>
                                                        <td className='text-center'>
                                                            <div className='d-flex align-items-center justify-content-center '>
                                                                {idx + 1}
                                                            </div>
                                                        </td>
                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{item.careerDetails}</Tooltip>}>
                                                        <td className='text-center'>
                                                            <div className='d-flex align-items-center justify-content-center' >
                                                                {item.careerName}
                                                            </div>
                                                        </td>
                                                        </OverlayTrigger>
                                                        <td>
                                                            <Link to={`/career/update/${item.careerID}`}
                                                                className="d-flex justify-content-center">
                                                                <img
                                                                    src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                                                    alt='edit'>
                                                                </img>
                                                            </Link>
                                                        </td>
                                                        <td   className="d-flex justify-content-center">
                                                                <img
                                                                    src='https://cdn-icons-png.flaticon.com/128/6861/6861362.png'
                                                                    alt='delete'
                                                                    onClick={() => onDelete(item)}
                                                                    style={{ cursor: 'pointer' }}
                                                                    >                                                                   
                                                                </img>
                                                        </td>

                                                    </tr>
                                                ))
                                                }
                                            </tbody>
                                        </Table>
                                    </div>


                                )
                                    :
                                    loading ? (
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