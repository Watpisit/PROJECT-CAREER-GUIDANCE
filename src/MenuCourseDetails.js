import Header from './Header';
import Navbar from './Navbar';
import { Container, Row, Col, Button, Alert, Table} from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import './MenuCourse.css'
import { Link, useNavigate, useParams} from 'react-router-dom';

export default function MenuCourseDetails() {

    const isActive = 5;
    const navigate = useNavigate();
    let params = useParams();

    //const [loading, setLoading] = useState(true);
    //const [grayBackground, setGrayBackground] = useState(false);
    const [show, setShow] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [rowClass, setRowClass] = useState('row-content-course-heightlock');
    const [divClass, setDivClass] = useState('div-content-course-false ');


    const [courseAll, setCourseAll] = useState([]);
    const [dataCourse, setDataCourse] = useState([]);
    const [paramsFacultyID, setParamsFacultyID] = useState("");
    const [deleteCourseID, setDeleteCourseID] = useState("");
    const [deleteName, setDeleteName] = useState("");

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
        const result = await response.json();
        setCourseAll(result.data);
    }

    useEffect(() => {
        setParamsFacultyID(params.facultyID);
        getCourse();
    }, [params.facultyID]);

    useEffect(() => {
        const courseAll1 = courseAll.filter(item => item.facultyID === paramsFacultyID.toString());
        setDataCourse(courseAll1);
    }, [courseAll,paramsFacultyID]);


    useEffect(() => {
        
        const handleResize = () => {
            const divHeight = document.querySelector('.div-table-add').clientHeight;
            if (divHeight <= 75 * window.innerHeight / 100) {
                setRowClass('row-content-course-heightlock');
                setDivClass('div-content-course-false');
                document.body.style.overflowY = 'hidden';
            } else {
                setRowClass('row-content-course-maxheight');
                setDivClass('div-content-course-true');
                document.body.style.overflowY = 'auto'
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [dataCourse, courseAll]);



    const onDelete = (ID, Name) => {
        setShow(true);
        //setGrayBackground(true);
        setDeleteCourseID(ID);
        setDeleteName(Name);
    }

    const handleConfirmDelete = async () => {
        setShow(false);
        await deleteCourse();
        await getCourse();
    };


    const deleteCourse = async () => {
        //setGrayBackground(false);
        //setLoading(true);
        const response = await fetch(
            "http://localhost:8080/api/delete_course",
            {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    courseID: deleteCourseID
                })
            }
        );
        const result = await response.json();
        console.log(result.message);
        //setLoading(false);
        // setRow(false);
        //setGrayBackground(true);
        setConfirmDelete(true);
    }


    const handleSuccess = () => {
        setConfirmDelete(false);

    };




    const handleCancel = () => {
        navigate("/course", { replace: false });
    };







    return (
        <>
            <Header />


            <Container fluid >
                <Row className={rowClass}>
                    {/* edit class row col divranking */}
                    <Navbar isActive={isActive} />

                    <Col sm={9} md={10} className='col-content-course '  >
                        <div className={divClass}>

                            <div className='header-course-add'>
                                <div>เพิ่ม ลบ แก้ไขหลักสูตร</div>
                                <Link to={`/course/add/${params.facultyID}`}>
                                    <img
                                        src='https://cdn-icons-png.flaticon.com/128/1090/1090923.png'
                                        alt='add'
                                    >
                                    </img>
                                </Link>
                            </div>



                            <div className='div-table-add'>
                                <Table striped bordered hover className='table'>
                                    <thead>
                                        <tr>
                                            <th className='text-center'>
                                                No.
                                            </th >
                                            <th className='text-center width-th'>
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
                                        {dataCourse.map((item, idx) => (

                                            <tr key={item.courseID}>
                                                <td className='text-center'>
                                                    {idx + 1}
                                                </td>
                                                <td className='text-center'>
                                                    {item.courseName}
                                                </td>
                                                <td className='text-center'>
                                                    <Link to={`/course/update/${item.courseID}`}>
                                                        <img
                                                            src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                                            alt='edit'
                                                        />
                                                    </Link>
                                                </td>
                                                <td className='d-flex justify-content-center'>
                                                    <img
                                                        src='https://cdn-icons-png.flaticon.com/128/6861/6861362.png'
                                                        alt='delete'
                                                        onClick={() => onDelete(item.courseID, item.courseName)}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>
                                </Table>


                                <div className='logo-Back'>
                                    <Link to={`/course`} >
                                        <img
                                            src='https://cdn-icons-png.flaticon.com/128/981/981150.png'
                                            alt='back'
                                        />
                                    </Link>
                                    <div>ย้อนกลับ</div>
                                </div>


                            </div>



                            {show ? (
                                <div className='div-alert-delete-course' >
                                    <Alert className='alert-delete-course' onClose={() => {
                                        setShow(false);
                                        // setGrayBackground(false); 
                                    }} dismissible
                                    >
                                        <section>
                                            <img src='https://icons.veryicon.com/png/o/miscellaneous/8atour/be-careful-6.png' alt='be careful' />

                                            <Alert.Heading>คุณต้องการลบหลักสูตรนี้หรือไม่?</Alert.Heading>
                                            <p>{deleteName}</p>
                                        </section>

                                        <div className='alert-button-course'>
                                            <Button variant='secondary' onClick={handleCancel}>
                                                ยกเลิก
                                            </Button>
                                            <Button variant='danger' onClick={handleConfirmDelete}>ตกลง</Button>
                                        </div>
                                    </Alert>
                                </div>
                            ) : null}


                            {confirmDelete ? (
                                <div className='div-alert-delete-course'>
                                    <Alert className='alert-delete-course-success' onClose={() => setShow(false)}>
                                        <section>
                                            <img src='https://cdn-icons-png.flaticon.com/128/4436/4436481.png' alt='correct' />
                                            <Alert.Heading>ลบข้อมูลสำเร็จ</Alert.Heading>
                                            <p>กรุณากด เสร็จสิ้น เพื่อดำเนินการต่อ</p>
                                        </section>

                                        <div className='alert-button-course'>
                                            <Button variant='success' onClick={handleSuccess}>เสร็จสิ้น</Button>
                                        </div>
                                    </Alert>
                                </div>
                            ) : null}

                        </div>
                    </Col>
                </Row>

            </Container>

        </>
    )
}