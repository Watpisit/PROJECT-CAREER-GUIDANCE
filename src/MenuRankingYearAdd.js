
import Header from './Header';
import Navbar from './Navbar';
import { Container, Row, Col,   Button, Alert, Form } from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import './MenuRanking.css'
import {  useNavigate } from 'react-router-dom';

export default function MenuRankingYearsAdd() {

    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();
    const isActive = 4;

    const [inputYears, setInputYears] = useState('');
    const [rankingAll, setRankingAll] = useState([]);
    const [years, setYears] = useState([]);
    const [showAlertCheckInput, setShowAlertCheckInput] = useState(false);




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
        setRankingAll(ranking.data);
        var yearsArr = [...new Set(ranking.data.map(item => item.years))]; //Set สร้างชุดข้อมูลที่ไม่ซ้ำกัน,...ใช้แปลง Setเป็นอเรย์
        setYears(yearsArr);
    }



    useEffect(() => {
        getRanking();
    }, []);


    const handleCancel = () => {
        navigate("/ranking", { replace: false });
    };


    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault(); //ป้องกันไม่ให้เกิดการเปลี่ยนหน้าจากการกด submit
        if (form.checkValidity() === false) {
            event.stopPropagation(); //ถ้ากรอกข้อมูลไม่ครบจะไม่ให้เกิดอีเว้นใดๆ
        } else {
            {
                let checkInputYears = false;
                years.map((data) => {
                    if (data === inputYears) {
                        checkInputYears = true;
                    }
                });

                if (checkInputYears) {
                    setShowAlertCheckInput(true);
                    <Alert>
                        มีการจัดอันดับอาชีพปีนี้แล้ว
                    </Alert>
                } else {
                    addrankingYear();
                }
            }
        }
        setValidated(true);
    }


    const addrankingYear = async () => {
        const requestData = {
            careerRankingID: rankingAll.length,
            rank: '',
            years: inputYears,
            career: '',
            percent:''
        };

        const response = await fetch(
            "http://localhost:8080/api/add_rankingyear",
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
            navigate("/ranking", { replace: false });
        }
    };



    return (
        <>
            <Header />

            <Container fluid >
                <Row className='row-content-ranking-true'>
                    <Navbar isActive={isActive} />

                    <Col sm={9} md={10} className='col-content-ranking' >
                        <div className='div-content-ranking'>

                            {showAlertCheckInput && (
                                <Alert variant="danger" onClose={() => setShowAlertCheckInput(false)} dismissible>
                                    มีการจัดอันดับอาชีพปีนี้แล้ว
                                </Alert>
                            )}
 
                            <div className='div-addranking'>
                                <img className='img-add'
                                    src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                    alt='add'
                                ></img>
                                <div className='text-ranking'>
                                    เพิ่มการจัดอันดับ 10 อาชีพที่ตลาดแรงงานต้องการ
                                </div>
                            </div>


                            <div className='div-form'>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>ปีการจัดอันดับ    :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่ปีการจัดอันดับ"
                                                value={inputYears}
                                                onChange={(e) => setInputYears(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่ปีการจัดอันดับ
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