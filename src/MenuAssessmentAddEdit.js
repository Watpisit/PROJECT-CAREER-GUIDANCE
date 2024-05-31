import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner, Button, Form } from 'react-bootstrap';
import Header from './Header';
import Navbar from './Navbar';
import './MenuAssessment.css'

export default function MenuAssessmenAddEdit(props) {
 
    let params = useParams();
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const [assessmentAll, setAssessmentAll] = useState([]);
    const [assessmentID, setAssessmentID] = useState(0);
    const [assessmentName, setAssessmentName] = useState('');
    const [choice01, setChoice01] = useState('');
    const [choice02, setChoice02] = useState('');
    const [choice03, setChoice03] = useState('');
    const [loading, setLoading] = useState(false);
    const isActive = 2;

    useEffect(() => {
        const getAssessment = async () => {
            const response = await fetch(
                "http://localhost:8080/api/get_Assessment",
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        'Content-Type': "application/json"
                    }
                }
            );
            const assessment = await response.json();
            setAssessmentAll(assessment.data);
        }
        getAssessment();

        if (props.data === 'update') {
            const getAssessmentUpdate = async () => {

                const response = await fetch(
                    `http://localhost:8080/api/get_Assessment/${params.assessmentID}`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            'Content-Type': "application/json"
                        }
                    }
                );
                const assessmentUpdate = await response.json();
                setAssessmentID(assessmentUpdate.data[0].assessmentID);
                setAssessmentName(assessmentUpdate.data[0].assessmentName);
                setChoice01(assessmentUpdate.data[0].choice01);
                setChoice02(assessmentUpdate.data[0].choice02);
                setChoice03(assessmentUpdate.data[0].choice03);
            }
            getAssessmentUpdate();
        }


    }, [params.assessmentID,props.data,]);



    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault(); //ป้องกันไม่ให้เกิดการเปลี่ยนหน้าจากการกด submit

        if (form.checkValidity() === false) {
            event.stopPropagation(); //ถ้ากรอกข้อมูลไม่ครบจะไม่ให้เกิดอีเว้นใดๆ
        } else {
            if (props.data === "add") {
                addAssessment();
            } else if (props.data === "update") {
                //พน.ทำถ้าผู้ใช้กดปุ่มจะทำฟังก์ชันอัพเดทและ ใช้ condition rendering แสดงส่วนหัวเป็นแก้ไข
                updateAssessment();
            }
        }
        setValidated(true);
    }

    const addAssessment = async () => {
        setLoading(true);
        const requestData = {
            assessmentID: assessmentAll.length + 1,
            assessmentName: assessmentName,
            choice01: choice01,
            choice02: choice02,
            choice03: choice03
        };

        const response = await fetch(
            "http://localhost:8080/api/add_Assessment",
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
            navigate("/assessment", { replace: false });
        }
    };


    const updateAssessment = async () => {
        setLoading(true);
        const data = {
            assessmentName: assessmentName,
            choice01: choice01,
            choice02: choice02,
            choice03: choice03
        };

        try {
            const response = await fetch(`http://localhost:8080/assessment/update/${assessmentID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            setLoading(false);
            if (responseData.result === true) {
                navigate("/assessment", { replace: false });
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleCancel = () => {
        navigate("/assessment", { replace: false });
    };





    return (
        <>
            <Header />

            {/* 1.ดึงข้อมูลมาเพื่อดูว่า ID ที่ผู้ใช้กรอกซ้ำไหม
            2.เพิ่มข้อมูล 3.แก้ไขโดยเปลี่ยน url*/}

            <Container fluid >
                <Row className='row-content-assessment-add'>
                    <Navbar isActive={isActive} />

                    <Col sm={9} md={10} className='col-content-assessment-add' >
                        <div className='div-content-assessment-add'>


                        {   //ทำแบบนี้เรียกว่า Conditional Rendering (การแสดงผลแบบเงื่อนไข) 
                                    loading ? (
                                        <div className='div-loading-addedit'>
                                            <Button variant="primary" disabled style={{opacity:'1'}}>
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
                                        เพิ่มแบบประเมิน
                                    </div>
                                </div>
                            ) : <div className='div-editassessment'>
                                <img className='img-edit'
                                    src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                    alt='edit'
                                ></img>
                                <div className='text-assessment'>
                                    เเก้ไขแบบประเมิน
                                </div>

                            </div>}

                            <div className='div-form'>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>


                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>คำถาม     :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่คำถาม"
                                                value={assessmentName}
                                                onChange={(e) => setAssessmentName(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่คำถาม
                                            </Form.Control.Feedback>
                                        </div>
                                    </div>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>ตัวเลือกที่ 1 :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่ตัวเลือกที่ 1"
                                                value={choice01}
                                                onChange={(e) => setChoice01(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่ตัวเลือกที่ 1
                                            </Form.Control.Feedback>
                                        </div>
                                    </div>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label ><pre className='pre-label'>ตัวเลือกที่ 2 :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่ตัวเลือกที่ 2"
                                                value={choice02}
                                                onChange={(e) => setChoice02(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่ตัวเลือกที่ 2
                                            </Form.Control.Feedback>

                                        </div>
                                    </div>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>ตัวเลือกที่ 3 :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่ตัวเลือกที่ 3"
                                                value={choice03}
                                                onChange={(e) => setChoice03(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่ตัวเลือกที่ 3
                                            </Form.Control.Feedback>

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