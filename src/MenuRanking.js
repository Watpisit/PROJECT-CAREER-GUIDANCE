import Header from './Header';
import Navbar from './Navbar';
import { Container, Row, Col, Table, Spinner, Button, Alert } from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import './MenuRanking.css'
import { Link} from 'react-router-dom';

export default function MenuRanking() {

    const isActive = 4;
    const [years, setYears] = useState([]);

    const [loading, setLoading] = useState(true);
    const [grayBackground, setGrayBackground] = useState(false);
    const [show, setShow] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [dataDeleteYears, setDataDeleteYears] = useState("");
    // const [row, setRow] = useState(false);

    const getRanking = async () => {
        const response = await fetch(
            "http://localhost:8080/api/get_Ranking",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                }
            }
        );
        const ranking = await response.json();
        var yearsArr = [...new Set(ranking.data.map(item => item.years))]; //Set สร้างชุดข้อมูลที่ไม่ซ้ำกัน,...ใช้แปลง Setเป็นอเรย์
        setYears(yearsArr);
    }

    useEffect(() => {
        getRanking();
        setLoading(false);
    }, []);


    const deleteRanking = async () => {
        setGrayBackground(false);
        setLoading(true);
        const response = await fetch(
            "http://localhost:8080/api/delete_ranking_years",
            {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    years: dataDeleteYears
                })
            }
        );
        const result = await response.json();
        console.log(result.message);
        setLoading(false);
        // setRow(false);
        setGrayBackground(true);
        setConfirmDelete(true);
    }

    const onDelete = (deleteyears) => {
        setShow(true);
        setGrayBackground(true);
        setDataDeleteYears(deleteyears);
    }

    const handleCancel = () => {
        setShow(false);
        setGrayBackground(false);
    };


    const handleConfirmDelete = async () => {
        setShow(false);
        await deleteRanking();
        await getRanking();
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
                <Row className='row-content-ranking-true'>
                    <Navbar isActive={isActive} />

                    <Col sm={9} md={10} className='col-content-ranking' >
                        <div className='div-content-ranking'>

                            <div className={grayBackground ? 'gray-background-ranking' : ''}>
                                <div className='header'>
                                    <div>เพิ่ม ลบ แก้ไขการจัดอันดับ 10 อาชีพที่ตลาดแรงงานต้องการ</div>
                                    <Link to={`/ranking/years/add`}>
                                        <img
                                            src='https://cdn-icons-png.flaticon.com/128/1090/1090923.png'
                                            alt='add'
                                        >
                                        </img>
                                    </Link>
                                </div>


                                {loading ? (
                                    <div className='div-button-loading-ranking'>
                                        <Button variant="primary" disabled style={{ opacity: '1' }}>
                                            <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                                            Loading...
                                        </Button>
                                    </div>
                                ) : (
                                    <div className='div-table'>
                                        <Table striped bordered hover className='table'>
                                            <thead>
                                                <tr>
                                                    <th className='text-center'>
                                                        No.
                                                    </th >
                                                    <th className='text-center'>
                                                        ปี
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
                                                {years.map((item, idx) => (

                                                    <tr key={idx}>
                                                        <td className='text-center'>
                                                            <div className='d-flex align-items-center justify-content-center '>
                                                                {idx + 1}
                                                            </div>
                                                        </td>
                                                        <td className='text-center'>
                                                            <div className='d-flex align-items-center justify-content-center' >
                                                                {item}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <Link to={`/rankingDetails/${item}`} className="d-flex justify-content-center">
                                                                <img
                                                                    src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                                                    alt='edit'
                                                                />
                                                            </Link>
                                                        </td>
                                                        <td className="d-flex justify-content-center">
                                                            <img
                                                                src='https://cdn-icons-png.flaticon.com/128/6861/6861362.png'
                                                                alt='delete'
                                                                onClick={() => onDelete(item)}
                                                                style={{cursor:'pointer'}}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))
                                                }


                                            </tbody>
                                        </Table>
                                    </div>
                                )}

                            </div>





                            {show ? (
                                <div className='div-alert-delete-ranking' >
                                    <Alert className='alert-delete-ranking' onClose={() => { setShow(false); setGrayBackground(false); }} dismissible
                                    >
                                        <section>
                                            <img src='https://icons.veryicon.com/png/o/miscellaneous/8atour/be-careful-6.png' alt='be careful' />

                                            <Alert.Heading>คุณต้องการลบการจัดอันดับอาชีพปีนี้หรือไม่?</Alert.Heading>
                                            <p>การจัดอันดับอาชีพปี {dataDeleteYears}</p>
                                        </section>

                                        <div className='alert-button-ranking'>
                                            <Button variant='secondary' onClick={handleCancel}>
                                                ยกเลิก
                                            </Button>
                                            <Button variant='danger' onClick={handleConfirmDelete}>ตกลง</Button>
                                        </div>
                                    </Alert>
                                </div>
                            ) : null}


                            {confirmDelete ? (
                                <div className='div-alert-delete-ranking'>
                                    <Alert className='alert-delete-ranking-success' onClose={() => setShow(false)}>
                                        <section>
                                            <img src='https://cdn-icons-png.flaticon.com/128/4436/4436481.png' alt='correct' />
                                            <Alert.Heading>ลบข้อมูลสำเร็จ</Alert.Heading>
                                            <p>กรุณากด เสร็จสิ้น เพื่อดำเนินการต่อ</p>
                                        </section>

                                        <div className='alert-button-ranking'>
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