import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button,  Form } from 'react-bootstrap';
import Header from './Header';
import Navbar from './Navbar';
import './MenuCourse.css'
import './MenuAssessment.css'
import './MenuFaculty'
import Select from 'react-select'

export default function MenuFacultyAddEdit(props) {

    let params = useParams();
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const isActive = 6;


    const [facultyAll, setFacultyAll] = useState([]);
    const [facultyID, setFacultyID] = useState("");
    const [facultyName, setFacultyName] = useState('');
    const [facultyDetails, setFacultyDetails] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('')
    const [image, setImage] = useState('')
    const [facultyWebsite, setFacultyWebsite] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [facultyStatusID, setFacultyStatusID] = useState('')
    const [keyword, setKeyword] = useState('')


    const [facultyStatusAll, setFacultyStatusAll] = useState([]);
    const [paramsFacultyID, setParamsFacultyID] = useState('');


    const [optionsFacultyStatus, setOptionsFacultyStatus] = useState([]);
    const [defaultOptionFacultyIdx, setDefaultOptionFacultyIdx] = useState(0);




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
        const faculty1 = await response.json();
        setFacultyAll(faculty1.data);
    }

    const getFacultyStatus = async () => {
        const response = await fetch(
            "http://localhost:8080/api/get_facultyStatus",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                }
            }
        );
        const facultyStatus1 = await response.json();
        setFacultyStatusAll(facultyStatus1.data);
    }

 
    useEffect(() => {
        if (props.data === 'update') {
            setParamsFacultyID(params.facultyID);
            getFaculty();
            getFacultyStatus();
        } else if (props.data === 'add') {
            getFaculty();
            getFacultyStatus();
            //  setParamsFacultyID(params.facultyID);
        }
    }, [params.facultyID,props.data]);

    useEffect(() => {
        if (props.data === 'update' && facultyAll.length > 0 ) {
            const facultyAll1 = facultyAll.find(item => item.facultyID === paramsFacultyID.toString());
            setFacultyAll(facultyAll1);
            setFacultyID(facultyAll1.facultyID);
            setFacultyName(facultyAll1.facultyName);
            setFacultyDetails(facultyAll1.facultyDetails);
            setLatitude(facultyAll1.latitude);
            setLongitude(facultyAll1.longitude);
            setImage(facultyAll1.image);
            setFacultyWebsite(facultyAll1.facultyWebsite);
            setPhoneNumber(facultyAll1.phoneNumber);
            setEmail(facultyAll1.email);
            setFacultyStatusID(facultyAll1.facultyStatusID);
            setKeyword(facultyAll1.keyword);

            //วันนี้ทำดรอปดาวน์สถานะคณะ

     
            let optionsFacultyStatus = facultyStatusAll.map(({ facultyStatusID, status }) => ({
                value: facultyStatusID,
                label: status
            }));
            setOptionsFacultyStatus(optionsFacultyStatus);






        } else if (props.data === 'add' && facultyAll.length > 0) {

            let optionsFacultyStatus = facultyStatusAll.map(({ facultyStatusID, status }) => ({
                value: facultyStatusID,
                label: status
            }));
            setOptionsFacultyStatus(optionsFacultyStatus);
        }


    }, [facultyAll, facultyStatusAll,paramsFacultyID,props.data]);

    useEffect(() => {
        // แยกค่าเริ่มต้นดรอปดาวมาใส่ useeffect นี้เพราะเมื่อค่า optionsFacultyStatus มีการเปลี่ยนแปลงจะให้ทำแค่ในยูสเอฟเฟคนี้ถ้าใส่ useefect
        // อันบนมันจะมีการเรียกใช้บ่อยทำให้ดีฟอลไม่มีค่า แต่คอมโพแนนหลักสูตรทำได้ปกติ
        facultyStatusAll.find((status, idx1) => {
          if (status.facultyStatusID === facultyStatusID) {
            setDefaultOptionFacultyIdx(idx1);
            return true;
          }
          return false; // คืนค่าเป็น false ในกรณีที่เงื่อนไขไม่เป็นจริง
        });
      }, [optionsFacultyStatus, facultyStatusAll, facultyStatusID]);
      

    





    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault(); //ป้องกันไม่ให้เกิดการเปลี่ยนหน้าจากการกด submit

        if (form.checkValidity() === false) {
            event.stopPropagation(); //ถ้ากรอกข้อมูลไม่ครบจะไม่ให้เกิดอีเว้นใดๆ
        } else {
            if (props.data === "add") {
                addFaculty();
            } else if (props.data === "update") {
                updateFaculty();
            }
        }
        setValidated(true);
    }

    const addFaculty = async () => {
        const requestData = {
            facultyID: facultyAll.length + 1,
            facultyName: facultyName,
            facultyDetails: facultyDetails,
            latitude: latitude,
            longitude: longitude,
            image: image,
            facultyWebsite: facultyWebsite,
            phoneNumber: phoneNumber,
            email: email,
            facultyStatusID: defaultOptionFacultyIdx,
            keyword: keyword
        };

        const response = await fetch(
            "http://localhost:8080/api/add_faculty",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            }
        );
        const result = await response.json();
        console.log(result.message);
        if (result.success) {
            navigate("/faculty", { replace: false });
        }
    };


    const updateFaculty = async () => {
        const data = {
            facultyID: facultyID,
            facultyName: facultyName,
            facultyDetails: facultyDetails,
            latitude: latitude,
            longitude: longitude,
            image: image,
            facultyWebsite: facultyWebsite,
            phoneNumber: phoneNumber,
            email: email,
            facultyStatusID: defaultOptionFacultyIdx+1, 
            Keyword: keyword
        };


        try {
            const response = await fetch(`http://localhost:8080/faculty/update/${paramsFacultyID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            if (responseData.result === true) {
                navigate("/faculty", { replace: true });
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleCancel = () => {
        navigate("/faculty", { replace: false });
    };

    // console.log(facultyName)
    // console.log(facultyDetails)
    // console.log(latitude)
    // console.log(longitude)
    // console.log(image)
    // console.log(facultyWebsite)
    // console.log(phoneNumber)
    // console.log(email)
    // console.log(defaultOptionFacultyIdx)
    // console.log(keyword)

    return (
        <>
            <Header />


            <Container fluid >
                <Row className='row-content-faculty-add'>
                    <Navbar isActive={isActive} />

                    <Col sm={9} md={10} className='col-content-faculty-add' >
                        <div className='div-content-faculty-add'>

                            {props.data === 'add' ? (
                                <div className='div-editassessment'>
                                    <img className='img-edit'
                                        src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                        alt='add'
                                    ></img>
                                    <div className='text-assessment'>
                                        เพิ่มคณะ
                                    </div>
                                </div>
                            ) : <div className='div-editassessment'>
                                <img className='img-edit'
                                    src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                    alt='edit'
                                ></img>
                                <div className='text-assessment'>
                                    เเก้ไขคณะ
                                </div>

                            </div>}

                            <div className='div-form-add'>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>ชื่อคณะ       :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่ชื่อคณะ"
                                                value={facultyName}
                                                onChange={(e) => setFacultyName(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่ชื่อคณะ
                                            </Form.Control.Feedback>
                                        </div>
                                    </div>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>ตัวย่อคณะ     :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่ตัวย่อคณะ 2 ตัวอักษร เช่น SC LW TM "
                                                value={keyword}
                                                onChange={(e) => setKeyword(e.target.value)}
                                                maxLength={2} // กำหนดความยาวสูงสุดให้เป็น 2 ตัวอักษร
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่ตัวย่อคณะ 2 ตัวอักษร
                                            </Form.Control.Feedback>
                                        </div>
                                    </div>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>รายละเอียดคณะ :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่รายละเอียดคณะ"
                                                as="textarea" rows={9}
                                                value={facultyDetails}
                                                onChange={(e) => setFacultyDetails(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่รายละเอียดคณะ
                                            </Form.Control.Feedback>
                                        </div>
                                    </div>


                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>ละติจูด        :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่ละติจูด"
                                                value={latitude}
                                                onChange={(e) => setLatitude(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่ละติจูด
                                            </Form.Control.Feedback>
                                        </div>
                                    </div>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>ลองจิจูด       :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่ลองจิจูด"
                                                value={longitude}
                                                onChange={(e) => setLongitude(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่ลองจิจูด
                                            </Form.Control.Feedback>
                                        </div>
                                    </div>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>เว็บไซต์คณะ    :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่ลิงก์เว็บไซต์คณะ (https)"
                                                value={facultyWebsite}
                                                onChange={(e) => setFacultyWebsite(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่เว็บไซต์คณะ
                                            </Form.Control.Feedback>
                                        </div>
                                    </div>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>เบอร์โทรศัพท์   :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่เบอร์โทรศัพท์ "
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่เบอร์โทรศัพท์
                                            </Form.Control.Feedback>
                                        </div>
                                    </div>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>อีเมล         :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่อีเมล "
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่อีเมล
                                            </Form.Control.Feedback>
                                        </div>
                                    </div>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>ลิงก์รูปภาพ     :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่ลิงก์รูปภาพ (https) "
                                                value={image}
                                                onChange={(e) => setImage(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่ลิงก์รูปภาพ
                                            </Form.Control.Feedback>
                                        </div>
                                    </div>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>สถานะคณะ     :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Select
                                                value={optionsFacultyStatus[defaultOptionFacultyIdx]}
                                                isClearable
                                                isSearchable
                                                options={optionsFacultyStatus}
                                                placeholder="ค้นหา"
                                                noOptionsMessage={() => "ไม่มีสถานะ"}
                                                onChange={(optionsFacultyStatus) => setDefaultOptionFacultyIdx(optionsFacultyStatus.value - 1)}
                                            // isDisabled={isDisabled} // ถ้าต้องการปิดใช้งาน dropdown ให้ใส่ค่า true
                                            // isRtl={isRtl}  ถ้าต้องการแสดงเนื้อหาของ dropdown จากข้างขวาไปซ้ายให้ใส่ค่า true
                                            // isLoading={isLoading} ถ้าต้องการแสดง loading spinner ใน dropdown ให้ใส่ค่า true
                                            // autoFocus เมื่อหน้าเว็บรีโหลดจะให้ผู้ใช้ใส่ข้อมูลช่องนี้ทันที
                                            />
                                        </div>
                                    </div>







                                    <div className='div-button'>
                                        <Button variant="primary" type="submit" className='button-save'>
                                            บันทึก
                                        </Button>

                                        <Button variant="danger"
                                            onClick={handleCancel}
                                            className='button-cancel'>
                                            ยกเลิก
                                        </Button>
                                    </div>

                                </Form>

                            </div>





                        </div>
                    </Col>
                </Row>

            </Container>




        </>
    )
}