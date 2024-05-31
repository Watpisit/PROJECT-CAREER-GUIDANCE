import Header from './Header';
import Navbar from './Navbar';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import './MenuCourse.css'
import './MenuCareer.css'
import './MenuAptitudeCareer.css'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function MenuAptitudeCareer() {


    const isActive = 8;



    const [careerAll, setCareerAll] = useState([]);
    const [aptitudeAll, setAptitudeAll] = useState([]);
    const [aptitudeCareerAll, setAptitudeCareerAll] = useState([]);
    const [aptitudeCareerdata, setAptitudeCareerdata] = useState([]);







    const getCareer = async () => {

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
    }

    const getAptitude = async () => {
        const response = await fetch(
            "http://localhost:8080/api/get_aptitude",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                }
            }
        );
        const aptitude = await response.json();
        setAptitudeAll(aptitude.data);
    }

    const getAptitudeCareer = async () => {
        const response = await fetch(
            "http://localhost:8080/api/get_aptitude_career",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                }
            }
        );
        const result = await response.json();
        setAptitudeCareerAll(result.data);
    }


    useEffect(() => {
        getAptitudeCareer();
        getAptitude();
        getCareer();
    }, []);

    useEffect(() => {

        if (aptitudeCareerAll.length > 0 && careerAll.length > 0 && aptitudeAll.length > 0) {
            const aptitudeCareerData = []; // สร้างอาเรย์เพื่อเก็บข้อมูล

            aptitudeCareerAll.forEach(item => {
                const aptitudeCareerAllID = item.aptitude_careerID;
                const aptitude = aptitudeAll.find(a => a.aptitudeID === item.aptitudeID);
                const career = careerAll.find(c => c.careerID === item.careerID);

                if (aptitude && career) {
                    aptitudeCareerData.push({
                        aptitude_careerID: aptitudeCareerAllID,
                        aptitudeID: aptitude.aptitudeID,
                        aptitudeName: aptitude.aptitudeName,
                        careerID: career.careerID,
                        careerName: career.careerName,
                    });
                }
            });

            setAptitudeCareerdata(aptitudeCareerData);
        }

    }, [aptitudeCareerAll, careerAll, aptitudeAll]);


    const onDelete = async (aptitudeCareer) => {
        const result = await Swal.fire({
            title: 'คุณต้องการลบการจับคู่ความถนัดที่สอดคล้องกับอาชีพนี้หรือไม่?',
            text: aptitudeCareer.aptitudeName + " จับคู่กับอาชีพ" + aptitudeCareer.careerName,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ตกลง',
            cancelButtonText: "ยกเลิก"
        });

        if (result.isConfirmed) {
            await confirmDelete(aptitudeCareer);
            await Swal.fire({
                title: 'ลบข้อมูลสำเร็จ',
                text: 'กรุณากด "เสร็จสิ้น" เพื่อดำเนินการต่อ',
                icon: 'success',
                confirmButtonText: 'เสร็จสิ้น'
            });
        }
    }

    const confirmDelete = async (aptitudeCareer) => {
        await fetch(
            "http://localhost:8080/api/delete_aptitude_career",
            {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    aptitude_careerID: aptitudeCareer.aptitude_careerID
                })
            }
        );
        // const result = await response.json();
        getAptitudeCareer();

    }








    return (

        <>
            <Header />
            <Container fluid >
                <Row className='row-content-aptitudecareer-maxheight'>
                    <Navbar isActive={isActive} />

                    <Col sm={9} md={10} className='col-content-aptitudecareer' >
                        <div className='div-content-aptitudecareer-true'>

                            <div className='header-aptitudecareer-add ' >
                                <div>เพิ่ม ลบ แก้ไขการจับคู่ความถนัดที่สอดคล้องกับอาชีพ</div>
                                <Link to={`/match_aptitude_career/add`}>
                                    <img
                                        src='https://cdn-icons-png.flaticon.com/128/1090/1090923.png'
                                        alt='add'
                                    >
                                    </img>
                                </Link>
                            </div>


                            {/* ทำตาราง */}
                            {aptitudeCareerdata.length > 0 && (
                                <div className='div-table-ranking'>
                                    <Table striped bordered hover className='table-ranking'>
                                        <thead>
                                            <tr>
                                                <th className='text-center'>
                                                    No.
                                                </th >
                                                <th className='text-center'>
                                                    ความถนัด
                                                </th>
                                                <th className='text-center'>
                                                    อาชีพ
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
                                            {aptitudeCareerdata.map((item, idx) => (

                                                <tr key={item.aptitude_careerID}>
                                                    <td className='text-center'>
                                                        <div className='d-flex align-items-center justify-content-center '>
                                                            {idx + 1}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='d-flex align-items-center justify-content-center '>
                                                            {item.aptitudeName}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='d-flex align-items-center justify-content-center '>
                                                            {item.careerName}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <Link to={`/match_aptitude_career/${item.aptitude_careerID}/${item.aptitudeID}/${item.careerID}/${item.careerName}`}
                                                            className="d-flex justify-content-center">
                                                            <img
                                                                src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                                                alt='edit'>
                                                            </img>
                                                        </Link>
                                                    </td>
                                                    <td className="d-flex justify-content-center">
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
                            )}















                        </div>
                    </Col>
                </Row>

            </Container>



        </>
    )
}