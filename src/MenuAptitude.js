import Header from './Header';
import Navbar from './Navbar';
import { Container, Row, Col, Spinner, Button, Alert } from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import './MenuAptitude.css'
import { Link } from 'react-router-dom';

export default function MenuAptitude() {

    const isActive = 3;
    
    const [loading, setLoading] = useState(true);
    const [grayBackground, setGrayBackground] = useState(false);
    const [aptitudeAll, setAptitudeAll] = useState([]);
    const [show, setShow] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [dataDeleteID, setDataDeleteID] = useState("");
    const [dataDeleteName, setDataDeleteName] = useState("");
    const [row, setRow] = useState(false);

    const getAptitude = async () => {
        setRow(true);
        setLoading(true);
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
        setLoading(false);
        setAptitudeAll(aptitude.data);
        setRow(false);
    }


    const deleteAptitude = async () => {
        setGrayBackground(false);
        setLoading(true);
        const response = await fetch(
            "http://localhost:8080/api/delete_Aptitude",
            {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    aptitudeID: dataDeleteID
                })
            }
        );
        const result = await response.json();
        console.log(result.message);
        setAptitudeAll(result.data);
        setLoading(false);
        setRow(false);
        setGrayBackground(true);
        setConfirmDelete(true);
    }

    useEffect(() => {
        setLoading(true);
        getAptitude();
        setLoading(false);
    }, []);


    const onDelete = (assessmentID, name) => {
        setShow(true);
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
        await deleteAptitude();
        await getAptitude();
    };

    const handleSuccess = () => {
        setConfirmDelete(false);
        setGrayBackground(false);
    };

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




    return (
        <>
            <Header />


            <Container fluid >
                <Row className={row ? 'row-content-aptitude-true' : 'row-content-aptitude'}>
                    <Navbar isActive={isActive} />

                    <Col sm={9} md={10} className='col-content-aptitude' >
                        <div className='div-content-aptitude'>

                            <div className={grayBackground ? 'gray-background' : ''} >
                                <div className='header'>
                                    ความถนัด
                                    <Link to={`/aptitude/add`}>
                                        <img
                                            src='https://cdn-icons-png.flaticon.com/128/1090/1090923.png'
                                            alt='add'
                                        >
                                        </img>
                                    </Link>
                                </div>
 

                                {aptitudeAll.length > 0 ? (
                                    aptitudeAll.map(item => (
                                        <section key={item.aptitudeID}>
                                            <div className='div-aptitude' aptitudeID={item.aptitudeID}>
                                                <div className='content-background-center'>
                                                    <p>{item.aptitudeID}. {item.aptitudeName}</p>
                                                    <p className="indent"> {item.aptitudeDetails}</p>
                                                    <div className='icon'>
                                                        <Link to={`/aptitude/update/${item.aptitudeID}`}>
                                                            <img src='https://cdn-icons-png.flaticon.com/128/10629/10629723.png' alt='edit' />
                                                        </Link>
                                                        <img src='https://cdn-icons-png.flaticon.com/128/6861/6861362.png' alt='delete' onClick={() => onDelete(item.aptitudeID, item.aptitudeName)} />
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    ))
                                ) : loading ? (
                                    <div className='div-button-loading-aptitude'>
                                        <Button variant="primary" disabled style={{ opacity: '1' }}>
                                            <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                                            Loading...
                                        </Button>
                                    </div>
                                ) : <div className='div-button-loading-aptitude'>
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
                                            <Alert.Heading>คุณต้องการลบความถนัดนี้หรือไม่?</Alert.Heading>
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