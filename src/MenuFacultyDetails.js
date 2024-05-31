import Header from './Header';
import Navbar from './Navbar';
import { Container, Row, Col } from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import './MenuFaculty.css'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function MenuFacultyDetails() {

    const isActive = 6;
    const navigate = useNavigate();
    let params = useParams();

    const [facultyAll, setFacultyAll] = useState([]);
    const [dataFaculty, setDataFaculty] = useState([]); //ข้อมูลที่กรองแล้วว
    const [paramsFacultyID, setParamsFacultyID] = useState("");


    const getFaculty = async () => {
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
    }


    useEffect(() => {
        setParamsFacultyID(params.facultyID);
        getFaculty();
    }, [params.facultyID]);


    useEffect(() => {
        const facultyAll1 = facultyAll.filter(item => item.facultyID === paramsFacultyID.toString())
        setDataFaculty(facultyAll1);
    }, [facultyAll, paramsFacultyID]);



    const onDelete = async (facultyName, facultyID) => {
        const result = await Swal.fire({
            title: 'คุณต้องการลบคณะนี้หรือไม่?',
            text: facultyName,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ตกลง',
            cancelButtonText: "ยกเลิก"
        });

        if (result.isConfirmed) {
            await confirmDelete(facultyID);
            await Swal.fire({
                title: 'ลบข้อมูลสำเร็จ',
                text: 'กรุณากด "เสร็จสิ้น" เพื่อดำเนินการต่อ',
                icon: 'success',
                confirmButtonText: 'เสร็จสิ้น'
            });
        }


    }

    const confirmDelete = async (facultyID1) => {
        const response = await fetch(
            "http://localhost:8080/api/delete_faculty",
            {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    facultyID: facultyID1
                })
            }
        );
        await response.json();
        navigate("/faculty", { replace: false });

    }







    return (
        <>
            <Header />


            <Container fluid >
                <Row className="row-content-faculty-details">
                    <Navbar isActive={isActive} />

                    <Col sm={9} md={10} className='col-content-faculty-details'  >
                        <div className="div-content-faculty-details">

                            <div className='header-faculty-add '>
                                <img
                                    src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                    alt='add'
                                    className='img-logoedit'
                                >
                                </img>
                                <div className='text-faculty'>แก้ไข ลบคณะ</div>
                            </div>




                            {dataFaculty.map((item, idx) => (
                                <div className='div-faculty-details'>
                                    <div className='faculty-details'>
                                        <p>ชื่อคณะ : {item.facultyName}</p>
                                        <p>ตัวย่อคณะ : {item.keyword}</p>
                                        <p>รายละเอียดคณะ : {item.facultyDetails}</p>
                                        <p>ละติจูด : {item.latitude}</p>
                                        <p>ลองจิจูด : {item.longitude}</p>
                                        <p>เว็บไซต์คณะ : {item.facultyWebsite}</p>
                                        <p>เบอร์โทรศัพท์ : {item.phoneNumber}</p>
                                        <p>อีเมล : {item.email} </p>
                                        <p>ลิ้งก์รูปภาพ : {item.image}</p>
                                        <p>สถานะคณะ : {item.facultyStatusID.toString() === "1" ? 'เปิด' : 'ปิด'}</p>
                                        <div className='icon-faculty-details'>
                                            <Link to={`/faculty/update/${item.facultyID}`}>
                                                <img src='https://cdn-icons-png.flaticon.com/128/10629/10629723.png' alt='edit' />
                                            </Link>
                                            <img src='https://cdn-icons-png.flaticon.com/128/6861/6861362.png' alt='delete' onClick={() => onDelete(item.facultyName, item.facultyID)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
















                            <div className='logo-Back'>
                                <Link to={`/faculty`} >
                                    <img
                                        src='https://cdn-icons-png.flaticon.com/128/981/981150.png'
                                        alt='back'
                                    />
                                </Link>
                                <div>ย้อนกลับ</div>
                            </div>

                        </div>
                    </Col>
                </Row>

            </Container>

        </>
    )
}