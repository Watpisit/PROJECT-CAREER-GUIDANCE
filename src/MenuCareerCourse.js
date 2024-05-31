import Header from './Header';
import Navbar from './Navbar';
import { Container, Row, Col,  Table,  } from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import './MenuCourse.css'
import './MenuCareer.css'
import './MenuAptitudeCareer.css'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function MenuCareerCourse() {
    const isActive = 9;

    const [careerAll, setCareerAll] = useState([]);
    const [courseAll, setCourseAll] = useState([]);
    const [careerCourseAll, setCareerCourseAll] = useState([]);
    const [careerCoursedata, setCareerCoursedata] = useState([]);


    useEffect(() => {
        getCareerCourse();
        getCareer();
        getCourse();
    }, []);



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

    const getCourse = async () => {
        const response = await fetch(
            "http://localhost:8080/api/get_course",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                }
            }
        );
        const course = await response.json();
        setCourseAll(course.data);
    }

    const getCareerCourse = async () => {
        const response = await fetch(
            "http://localhost:8080/api/get_career_course",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                }
            }
        );
        const result = await response.json();
        setCareerCourseAll(result.data);
    }


    useEffect(() => {

        if (careerCourseAll.length > 0 && careerAll.length > 0 && courseAll.length > 0) {
            const careerCourseData = []; // สร้างอาเรย์เพื่อเก็บข้อมูล

            careerCourseAll.forEach(item => {
                const careerCourseAllID = item.career_courseID;
                const career = careerAll.find(career => career.careerID === item.careerID);
                const course = courseAll.find(course => course.courseID === item.courseID);

                if (career && course) {
                    careerCourseData.push({
                        career_courseID: careerCourseAllID,
                        careerID: career.careerID,
                        careerName: career.careerName,
                        courseID:course.courseID,
                        courseName: course.courseName,
                    });
                }
            });

            setCareerCoursedata(careerCourseData);
        }

    }, [careerCourseAll, careerAll, courseAll]);


    const onDelete = async (careerCourse) => {
        const result = await Swal.fire({
            title: 'คุณต้องการลบการจับคู่อาชีพที่สอดคล้องกับหลักสูตรนี้หรือไม่?',
            text: "อาชีพ" + careerCourse.careerName + " จับคู่กับหลักสูตร" + careerCourse.courseName,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ตกลง',
            cancelButtonText: "ยกเลิก"
        });

        if (result.isConfirmed) {
            await confirmDelete(careerCourse);
            await Swal.fire({
                title: 'ลบข้อมูลสำเร็จ',
                text: 'กรุณากด "เสร็จสิ้น" เพื่อดำเนินการต่อ',
                icon: 'success',
                confirmButtonText: 'เสร็จสิ้น'
            });
        }


    }

    const confirmDelete = async (careerCourse) => {
        const response = await fetch(
            "http://localhost:8080/api/delete_career_course",
            {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    career_courseID: careerCourse.career_courseID
                })
            }
        );
        await response.json();
        getCareerCourse();

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
                                <div>เพิ่ม ลบ แก้ไขการจับคู่อาชีพที่สอดคล้องกับหลักสูตร</div>
                                <Link to={`/match_career_course/add`}>
                                    <img
                                        src='https://cdn-icons-png.flaticon.com/128/1090/1090923.png'
                                        alt='add'
                                    >
                                    </img>
                                </Link>
                            </div>


                            {/* ทำตาราง */}
                            {careerCoursedata.length > 0 && (
                                <div className='div-table-ranking'>
                                    <Table striped bordered hover className='table-ranking'>
                                        <thead>
                                            <tr>
                                                <th className='text-center'>
                                                    No.
                                                </th >
                                                <th className='text-center'>
                                                    อาชีพ
                                                </th>
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
                                            {careerCoursedata.map((item, idx) => (

                                                <tr key={item.career_courseID}>
                                                    <td className='text-center'>
                                                        <div className='d-flex align-items-center justify-content-center '>
                                                            {idx + 1}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='d-flex align-items-center justify-content-center '>
                                                            {item.careerName}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='d-flex align-items-center justify-content-center '>
                                                            {item.courseName}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <Link to={`/match_career_course/${item.career_courseID}/${item.careerID}/${item.courseID}/${item.courseName}/${item.careerName}`}
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