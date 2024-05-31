import Header from './Header';
import Navbar from './Navbar';
import { Container, Row, Col, Spinner, Button, Alert } from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import './MenuAssessment.css'
import { Link } from 'react-router-dom';

export default function MenuAssessment() {
    const [assessmentAll, setAssessmentAll] = useState([]);;
    const [loading, setLoading] = useState(false);
    const isActive = 2;

    const [dataDeleteID, setDataDeleteID] = useState("");
    const [dataDeleteName, setDataDeleteName] = useState("");
    const [show, setShow] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    var alertTrue = true;

    const [grayBackground, setGrayBackground] = useState(false);
    const [row, setRow] = useState(false);

    const getAssessment = async () => {
        setRow(true);
        setLoading(true);
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
        setRow(false);
        setLoading(false);
    }

    useEffect(() => {
        getAssessment();
        setLoading(true);
    }, []);




    const deleteAssessment = async () => {
        setGrayBackground(false);
        setLoading(true);
        const response = await fetch(
            "http://localhost:8080/api/delete_Assessment",
            {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    assessmentID: dataDeleteID
                })
            }
        );

        const result = await response.json();
        console.log(result.message);
        setAssessmentAll(result.data);
        setLoading(false);
        setRow(false);
        setGrayBackground(true);
        setConfirmDelete(true);
    }

    


    useEffect(() => {
        if (show) {
            document.body.style.overflowY = 'hidden';
        } else if (confirmDelete) {
            document.body.style.overflowY = 'hidden';
        }
        else {
            document.body.style.overflowY = 'auto';
        }

        return () => {
            document.body.style.overflowY = 'auto';
        };
    }, [show, confirmDelete]);

    const onDelete = (assessmentID, name, alertTrue) => {
        setShow(alertTrue);
        setGrayBackground(true);
        setDataDeleteID(assessmentID);
        setDataDeleteName(name);
    }


    const handleCancel = () => {
        setShow(false);
        setGrayBackground(false);
    };

    const handleConfirmDelete = async () => {
        setShow(false);
        await deleteAssessment();
        await getAssessment();
    };

    const handleSuccess = () => {
        setConfirmDelete(false);
        setGrayBackground(false);
    };







    return (

        <>
            <Header />


            <Container fluid >
                <Row className={row ? 'row-content-assessment-true': 'row-content-assessment' }>
                    <Navbar isActive={isActive} />

                    <Col sm={9} md={10} className='col-content-assessment' >
                        <div className='div-content-assessment'>
                            <div className={grayBackground ? 'gray-background' : ''} >
                                <div className='header'> 
                                    แบบประเมิน
                                    <Link to={`/assessment/add`}>
                                        <img
                                            src='https://cdn-icons-png.flaticon.com/128/1090/1090923.png'
                                            alt='add'
                                        >
                                        </img>
                                    </Link>
                                </div>


                                {assessmentAll.length > 0 ? (
                                        assessmentAll.map((item) => (
                                            <div className='div-assessment' key={item.assessmentID}>
                                                <div className='div-center'>
                                                    <p >{item.assessmentID}. {item.assessmentName}</p>
                                                    <p className='text-indent-addmin'>{item.assessmentID}.1 {item.choice01}</p>
                                                    <p className='text-indent-addmin'>{item.assessmentID}.2 {item.choice02}</p>
                                                    <p className='text-indent-addmin'>{item.assessmentID}.3 {item.choice03}</p>
                                                    <div className='icon'>
                                                        <Link to={`/assessment/update/${item.assessmentID}`}>
                                                            <img src='https://cdn-icons-png.flaticon.com/128/10629/10629723.png' alt='edit'></img>
                                                        </Link>
                                                        <img src='https://cdn-icons-png.flaticon.com/128/6861/6861362.png' alt='delete'
                                                            onClick={() => onDelete(item.assessmentID, item.assessmentName, alertTrue)}></img>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                              
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

                            {show ? (
                                <div className='div-alert-delete' >
                                    <Alert className='alert-delete' onClose={() => { setShow(false); setGrayBackground(false); }} dismissible
                                    >
                                        <section>
                                            <img src='https://icons.veryicon.com/png/o/miscellaneous/8atour/be-careful-6.png' alt='be careful' />
                                            <Alert.Heading>คุณต้องการลบแบบประเมินข้อนี้หรือไม่?</Alert.Heading>
                                            <p>{dataDeleteID}. {dataDeleteName}</p>
                                        </section>

                                        <div className='alert-button'>
                                            <Button variant='secondary' onClick={handleCancel}>
                                                ยกเลิก
                                            </Button>
                                            <Button variant='danger' onClick={handleConfirmDelete}>ตกลง</Button>
                                        </div>
                                    </Alert>
                                </div>
                            ) : null}


                            {confirmDelete ? (
                                <div className='div-alert-delete'>
                                    <Alert className='alert-delete-success' onClose={() => setShow(false)}>
                                        <section>
                                            <img src='https://cdn-icons-png.flaticon.com/128/4436/4436481.png' alt='correct' />
                                            <Alert.Heading>ลบข้อมูลสำเร็จ</Alert.Heading>
                                            <p>กรุณากด เสร็จสิ้น เพื่อดำเนินการต่อ</p>
                                        </section>

                                        <div className='alert-button'>
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