import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner, Button,  Form } from 'react-bootstrap';
import Header from './Header';
import Navbar from './Navbar';
import './MenuCourse.css'
import Select from 'react-select'

export default function MenuCourseAddEdit(props) {

    let params = useParams();
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const isActive = 5;

    const [courseAll, setCourseAll] = useState([]);
    const [courseName, setCourseName] = useState("");
    const [courseDetails, setCourseDetails] = useState("");
    const [courseStatusID, setCourseStatusID] = useState("");

    const [facultyAll, setFacultyAll] = useState([]);
    const [courseStatusAll, setCourseStatusAll] = useState([]);
    const [paramsCourseID, setParamsCourseID] = useState('');
    const [paramsFacultyID, setParamsFacultyID] = useState('');

   
    const [isDisabled, setIsDisabled] = useState(false);
    const [options, setOptions] = useState([]); //Faculty
    const [defaultOptionIdx, setDefaultOptionIdx] = useState(0);
    const [optionsCourseStatus, setOptionsCourseStatus] = useState([]);
    const [defaultOptionCourseIdx, setDefaultOptionCourseIdx] = useState(0);


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
        const course1 = await response.json();
        setCourseAll(course1.data);
    }

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

    const getCourseStatus = async () => {
        const response = await fetch(
            "http://localhost:8080/api/get_courseStatus",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                }
            }
        );
        const courseStatus1 = await response.json();
        setCourseStatusAll(courseStatus1.data);
    }


    useEffect(() => {
        if (props.data === 'update') {
            getCourse();
            getFaculty();
            getCourseStatus();
            setParamsCourseID(params.courseID);
        } else if (props.data === 'add') {
            getCourse();
            getFaculty();
            getCourseStatus();
            setParamsFacultyID(params.facultyID);
        }
    }, [courseStatusID,params.courseID,params.facultyID,props.data]);

    useEffect(() => {
        if (props.data === 'update' && courseAll.length > 0) {
          const courseAll1 = courseAll.find(item => item.courseID === paramsCourseID.toString());
          setCourseName(courseAll1.courseName);
          setCourseDetails(courseAll1.courseDetails);
          setCourseStatusID(courseAll1.courseStatusID);
      
          let optionsFaculty = facultyAll.map(({ facultyID, facultyName }) => ({
            value: facultyID,
            label: facultyName
          }));
          setOptions(optionsFaculty);
      
          facultyAll.find((faculty, idx) => {
            if (faculty.facultyID === courseAll1.facultyID) {
              setDefaultOptionIdx(idx);
              return true;
            }
            return false;
          });
      
          let optionsCourseStatus = courseStatusAll.map(({ courseStatusID, status }) => ({
            value: courseStatusID,
            label: status
          }));
          setOptionsCourseStatus(optionsCourseStatus);
      
          courseStatusAll.find((status, idx1) => {
            if (status.courseStatusID === courseStatusID) {
              setDefaultOptionCourseIdx(idx1);
              return true;
            }
            return false;
          });
        } else if (props.data === 'add' && courseAll.length > 0) {
          let optionsFaculty = facultyAll.map(({ facultyID, facultyName }) => ({
            value: facultyID,
            label: facultyName
          }));
          setOptions(optionsFaculty);
      
          facultyAll.find((faculty1, index) => {
            if (faculty1.facultyID === paramsFacultyID) {
              setDefaultOptionIdx(index);
              return true;
            }
            return false;
          });
          setIsDisabled(true);
      
          let optionsCourseStatus = courseStatusAll.map(({ courseStatusID, status }) => ({
            value: courseStatusID,
            label: status
          }));
          setOptionsCourseStatus(optionsCourseStatus);
        }
      }, [courseAll, facultyAll, courseStatusAll, paramsCourseID, paramsFacultyID, props.data,courseStatusID]);
      










    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault(); //ป้องกันไม่ให้เกิดการเปลี่ยนหน้าจากการกด submit

        if (form.checkValidity() === false) {
            event.stopPropagation(); //ถ้ากรอกข้อมูลไม่ครบจะไม่ให้เกิดอีเว้นใดๆ
        } else {
            if (props.data === "add") {
                addCourse();
            } else if (props.data === "update") {
                //พน.ทำถ้าผู้ใช้กดปุ่มจะทำฟังก์ชันอัพเดทและ ใช้ condition rendering แสดงส่วนหัวเป็นแก้ไข
                updateCourse();
            }
        }
        setValidated(true);
    }

    const addCourse = async () => {
        setLoading(true);
        const requestData = {
            courseID: courseAll.length + 1,
            courseName: courseName,
            courseDetails: courseDetails,
            courseStatusID: defaultOptionCourseIdx,
            facultyID: defaultOptionIdx
        };

        const response = await fetch(
            "http://localhost:8080/api/add_course",
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
        setLoading(false);
        if (result.success) {
            navigate("/CourseDetails/"+paramsFacultyID, { replace: false });
        }
    };


    const updateCourse = async () => {
        setLoading(true);
        const data = {
            courseID: paramsCourseID,
            courseName: courseName,
            courseDetails: courseDetails,
            courseStatusID: defaultOptionCourseIdx,
            facultyID: defaultOptionIdx
        };


        try {
            const response = await fetch(`http://localhost:8080/course/update/${paramsCourseID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            setLoading(false);
            if (responseData.result === true) {
                navigate("/course", { replace: true });
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleCancel = () => {
        navigate("/course", { replace: false });
    };



    return (
        <>
            <Header />


            <Container fluid >
                <Row className='row-content-assessment-add'>
                    <Navbar isActive={isActive} />

                    <Col sm={9} md={10} className='col-content-assessment-add' >
                        <div className='div-content-assessment-add'>


                            {   //ทำแบบนี้เรียกว่า Conditional Rendering (การแสดงผลแบบเงื่อนไข) 
                                loading ? (
                                    <div className='div-loading-addedit'>
                                        <Button variant="primary" disabled style={{ opacity: '1' }}>
                                            <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"
                                            />
                                            Loading...
                                        </Button>
                                    </div>
                                ) : null
                            }



                            {props.data === 'add' ? (
                                <div className='div-editassessment'>
                                    <img className='img-edit'
                                        src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                        alt='add'
                                    ></img>
                                    <div className='text-assessment'>
                                        เพิ่มหลักสูตร
                                    </div>
                                </div>
                            ) : <div className='div-editassessment'>
                                <img className='img-edit'
                                    src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                    alt='edit'
                                ></img>
                                <div className='text-assessment'>
                                    เเก้ไขหลักสูตร
                                </div>

                            </div>}

                            <div className='div-form'>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>หลักสูตร          :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่หลักสูตร"
                                                value={courseName}
                                                onChange={(e) => setCourseName(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่หลักสูตร
                                            </Form.Control.Feedback>
                                        </div>
                                    </div>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>รายละเอียดหลักสูตร :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่รายละเอียดหลักสูตร"
                                                as="textarea" rows={9}
                                                value={courseDetails}
                                                onChange={(e) => setCourseDetails(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่รายละเอียดหลักสูตร
                                            </Form.Control.Feedback>
                                        </div>
                                    </div>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label ><pre className='pre-label'>คณะที่เปิดสอน     :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Select
                                                value={options[defaultOptionIdx]}
                                                isClearable
                                                isSearchable
                                                options={options}
                                                placeholder="ค้นหา"
                                                noOptionsMessage={() => "ไม่มีคณะ"}
                                                onChange={(options) => setDefaultOptionIdx(options.value - 1)}
                                                isDisabled={isDisabled}
                                            // isRtl={isRtl}
                                            // isLoading={isLoading}
                                            // autoFocus เมื่อหน้าเว็บรีโหลดจะให้ผู้ใช้ใส่ข้อมูลช่องนี้ทันที
                                            />
                                        </div>
                                    </div>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>สถานะหลักสูตร     :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Select
                                                value={optionsCourseStatus[defaultOptionCourseIdx]}   //อเรย์เริ่มจาก 0 
                                                isClearable
                                                isSearchable
                                                options={optionsCourseStatus}
                                                placeholder="ค้นหา"
                                                noOptionsMessage={() => "ไม่มีสถานะ"}
                                                onChange={(optionsCourseStatus) => setDefaultOptionCourseIdx(optionsCourseStatus.value - 1)} //value คือ ไอดีเริ่มจาก 1
                                            // isDisabled={isDisabled}
                                            // isRtl={isRtl}
                                            // isLoading={isLoading}
                                            // autoFocus เมื่อหน้าเว็บรีโหลดจะให้ผู้ใช้ใส่ข้อมูลช่องนี้ทันที
                                            />

                                        </div>
                                    </div>

                                    <div className='div-button' style={{top:'500px'}}>
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