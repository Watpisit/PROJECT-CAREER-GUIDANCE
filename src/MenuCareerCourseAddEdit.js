import Header from './Header';
import Navbar from './Navbar';
import { Container, Row, Col,Button, Form } from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import './MenuCourse.css'
import './MenuCareer.css'
import './MenuAptitudeCareer.css'
import {  useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select'

export default function MenuCareerCourseAddEdit(props) {


    const isActive = 9;
    let params = useParams();
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const [careerAll, setCareerAll] = useState([]);
    const [careerCourseAll, setCareerCourseAll] = useState([]);
    const [paramsCareerCourseID, setParamsCareerCourseID] = useState('');
    const [selectedCareers, setSelectedCareers] = useState(params.careerID ? [{ value: params.careerID, label: params.careerName }] : []);
    const [careersOptions, setCareersOptions] = useState([]);
    const [courseAll, setCourseAll] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(params.courseID ? [{ value: params.courseID, label: params.courseName }] : []);
    const [courseOptions, setCourseOptions] = useState([]);


    useEffect(() => {
        if (props.data === 'update') {
            getCareer();
            getCourse();
            getCareerCourse();
            setParamsCareerCourseID(params.career_courseID);
        } else if (props.data === 'add') {
            getCareer();
            getCourse();
            getCareerCourse();
        }
    }, [params.career_courseID,props.data]);



    useEffect(() => {
        if (props.data === 'update' && careerAll.length > 0) {
            let careerOptions1 = careerAll.map(career => ({
                value: career.careerID,
                label: career.careerName,
            }));
            setCareersOptions(careerOptions1);

            let careerOptions2 = courseAll.map(course => ({
                value: course.courseID,
                label: course.courseName,
            }));
            setCourseOptions(careerOptions2);


        } else if (props.data === 'add' && careerAll.length > 0 && courseAll.length > 0) {
            let careerOptions1 = careerAll.map(career => ({
                value: career.careerID,
                label: career.careerName,
            }));
            setCareersOptions(careerOptions1);

            let careerOptions2 = courseAll.map(course => ({
                value: course.courseID,
                label: course.courseName,
            }));
            setCourseOptions(careerOptions2);
        }


    }, [careerAll, courseAll,props.data]);




    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault(); //ป้องกันไม่ให้เกิดการเปลี่ยนหน้าจากการกด submit

        if (form.checkValidity() === false) {
            event.stopPropagation(); //ถ้ากรอกข้อมูลไม่ครบจะไม่ให้เกิดอีเว้นใดๆ
        } else {
            if (props.data === "add") {
                await addCareerCourse();
            } else if (props.data === "update") {
                await updateCareerCourse();
            }
        }
        setValidated(true);
    }

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




    const addCareerCourse = async () => {
        let maxID = 0;
        for (let i = 0; i < careerCourseAll.length; i++) {  //ค้นหาไอดีสูงสุด
            let aptitudeCareerID1 = parseInt(careerCourseAll[i].career_courseID, 10); //เลขฐาน10
            if (aptitudeCareerID1 > maxID) {
                maxID = aptitudeCareerID1;
            }
        }

        //selectedCareers เก็บข้อมูลเป็นออบเจ็ค Ex.  [{label : "สัตวแพทย์", value : "1"},{label : "แพทย์", value : "2"}]
        //แปลงเอาแค่ไอดี
        const selectedCourseID = [];
        for (let i1 = 0; i1 < selectedCourse.length; i1++) {
            selectedCourseID.push(selectedCourse[i1].value)
        }


        const requestData = {
            career_courseID: maxID + 1,
            careerID: selectedCareers.value,
            courseID: selectedCourseID
        };


        const response = await fetch(
            "http://localhost:8080/api/add_career_course",
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
            navigate("/match_career_course", { replace: false });
        }

    };






    const updateCareerCourse = async () => {
        for (var i = 0; i < careerCourseAll.length; i++) {

            if (careerCourseAll[i].career_courseID.toString() === params.career_courseID.toString()) {
                const rowUpdateInt = parseInt(i) + 2
                // setRowUpdate(rowUpdateInt);

                const data = {
                    career_courseID: paramsCareerCourseID,
                    careerID: selectedCareers,
                    courseID: selectedCourse
                };  //selectedCourse[0] idx0 เพราะอัปเดทจะมีไอดีเดียว โครงสร้างดรอปดาวเป็นอเรย์สองมิติดังนั้นจึงทำอันนี้เป็นอเรย์2มิติ
   


                try {
                    const response = await fetch(`http://localhost:8080/career_course/update/${rowUpdateInt}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    });

                    const responseData = await response.json();
                    if (responseData.result === true) {
                        navigate("/match_career_course", { replace: true });
                    }
                } catch (error) {
                    console.error(error);
                }


                break;
            }
        }


  
    };





    const handleCancel = () => {
        navigate("/match_career_course", { replace: false });
    };

    // console.log(selectedCourse)



    return (

        <>
            <Header />
            <Container fluid >
                <Row className='row-content-aptitudecareer-heightlock'>
                    <Navbar isActive={isActive} />

                    <Col sm={9} md={10} className='col-content-aptitudecareer' >
                        <div className='div-content-aptitudecareer-true'>


                            {props.data === 'add' ? (
                                <div className='div-editassessment' >
                                    <img className='img-edit'
                                        src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                        alt='add'
                                    ></img>
                                    <div className='text-assessment'>
                                        เพิ่มการจับคู่อาชีพที่สอดคล้องกับหลักสูตร
                                    </div>
                                </div>
                            ) : <div className='div-editassessment'>
                                <img className='img-edit'
                                    src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                    alt='edit'
                                ></img>
                                <div className='text-assessment'>
                                    เเก้ไขการจับคู่อาชีพที่สอดคล้องกับหลักสูตร
                                </div>

                            </div>}




                            {props.data === "add" && careerAll.length > 0 && (
                                <div className='div-form-career-add' >
                                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                        <div className='d-flex' >
                                            <div className='text-content' >อาชีพ</div>
                                            <pre className='text-content'>      : </pre>

                                            <div className='div-form-control'>
                                                <Select
                                                    isSearchable
                                                    placeholder="ค้นหา"
                                                    noOptionsMessage={() => "ไม่มีอาชีพ"}
                                                    options={careersOptions}
                                                    value={selectedCareers}  //เก็บค่าที่ผู้ใช้เลือกไว้ในselectedCareers
                                                    onChange={(selectedCareers) => setSelectedCareers(selectedCareers)}  //เมื่อเพิ่มหรือลบอาชีพฟังชันก์ไม่มีชื่อนี้เรียกว่าแอโร่ฟังก์ชัน
                                                />
                                            </div>
                                        </div>

                                        <br></br>
                                        <div className='d-flex' >
                                            <div className='text-content' >หลักสูตร</div>
                                            <pre className='text-content'>    : </pre>

                                            <div className='div-form-control'>
                                                <Select
                                                    isMulti
                                                    isSearchable
                                                    placeholder="ค้นหา"
                                                    noOptionsMessage={() => "ไม่มีหลักสูตร"}
                                                    options={courseOptions}
                                                    value={selectedCourse}
                                                    onChange={(selectedCourse) => setSelectedCourse(selectedCourse)}
                                                //เมื่อผู้ใช้เลือกหลักสูตรข้อมูลอเรย์อินเด็กนั้น (event)จะถูกเซ็ทไว้ใน setSelectedCourse ตัวแปร value={selectedCourse} เป็นสเตทก็จะเปลี่ยนตาม
                                                />
                                            </div>
                                        </div>


                                        <div className='div-button-aptitude-career'>
                                            {/* 1 rem ปกติจะเท่ากับ 16px ทั้งนี้ขึ้นยุการปรับ px ของเรา */}
                                            <Button variant="primary" type="submit" className='button-save'>
                                                บันทึก
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={handleCancel}
                                                className='button-cancel'
                                            >
                                                ยกเลิก
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            )}





                            {props.data === "update" && careerAll.length > 0 && (
                                <div className='div-form-career-add' >
                                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                        <div className='d-flex' >
                                            <div className='text-content' >อาชีพ</div>
                                            <pre className='text-content'>      : </pre>

                                            <div className='div-form-control'>
                                                <Select
                                                    isSearchable
                                                    placeholder="ค้นหา"
                                                    noOptionsMessage={() => "ไม่มีอาชีพ"}
                                                    options={careersOptions}
                                                    value={selectedCareers}  //เก็บค่าที่ผู้ใช้เลือกไว้ในselectedCareers
                                                    onChange={(selectedCareers) => setSelectedCareers(selectedCareers)}  //เมื่อเพิ่มหรือลบอาชีพฟังชันก์ไม่มีชื่อนี้เรียกว่าแอโร่ฟังก์ชัน
                                                />
                                            </div>
                                        </div>

                                        <br></br>
                                        <div className='d-flex' >
                                            <div className='text-content' >หลักสูตร</div>
                                            <pre className='text-content'>    : </pre>

                                            <div className='div-form-control'>
                                                <Select
                                                    //isMulti
                                                    isSearchable
                                                    placeholder="ค้นหา"
                                                    noOptionsMessage={() => "ไม่มีหลักสูตร"}
                                                    options={courseOptions}
                                                    value={selectedCourse}
                                                    onChange={(selectedCourse) => setSelectedCourse(selectedCourse)}
                                                //เมื่อผู้ใช้เลือกหลักสูตรข้อมูลอเรย์อินเด็กนั้น (event)จะถูกเซ็ทไว้ใน setSelectedCourse ตัวแปร value={selectedCourse} เป็นสเตทก็จะเปลี่ยนตาม
                                                />
                                            </div>
                                        </div>


                                        <div className='div-button-aptitude-career'>
                                            {/* 1 rem ปกติจะเท่ากับ 16px ทั้งนี้ขึ้นยุการปรับ px ของเรา */}
                                            <Button variant="primary" type="submit" className='button-save'>
                                                บันทึก
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={handleCancel}
                                                className='button-cancel'
                                            >
                                                ยกเลิก
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            )}











                        </div>
                    </Col>
                </Row>

            </Container>



        </>
    )
}