import Header from './Header';
import Navbar from './Navbar';
import { Container, Row, Col,  Button,  Form } from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import './MenuRanking.css'
import {  useNavigate, useParams } from 'react-router-dom';

export default function MenuRankingEdit() {

    const isActive = 4;
    const navigate = useNavigate();
    var params = useParams();

    const [paramsYear, setParamsYear] = useState("");

    const [validated, setValidated] = useState(false);

    const [rankingAll, setRankingAll] = useState([]);
    const [rank, setRank] = useState("");
    const [careerName, setCareerName] = useState("");
    const [dataEditID, setDataEditID] = useState('');
    const [percent, setPercent] = useState("");

    useEffect(() => {
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
            setDataEditID(params.careerRankingID);
            setParamsYear(params.years);
        }

        getRanking(); 
    }, [params.careerRankingID, params.years]);

    useEffect(() => {
        if (rankingAll.length > 0 && dataEditID) {
            const rankingAll1 = rankingAll.find(item => item.careerRankingID === dataEditID.toString());
            setRank(rankingAll1.rank);
            setCareerName(rankingAll1.career);
            setPercent(rankingAll1.percent);
        }
    }, [dataEditID, rankingAll]);



    
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault(); //ป้องกันไม่ให้เกิดการเปลี่ยนหน้าจากการกด submit

        if (form.checkValidity() === false) {
            event.stopPropagation(); //ถ้ากรอกข้อมูลไม่ครบจะไม่ให้เกิดอีเว้นใดๆ
        } else {
            updateRanking();

        }
        setValidated(true);
    }



    const updateRanking = async () => {
        const data = {
            career: careerName,
            percent: percent
        };

        try {
            const response = await fetch(`http://localhost:8080/ranking/update/${dataEditID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            if (responseData.result === true) {
                navigate("/rankingDetails/"+paramsYear, { replace: true });
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleCancel = () => {
        navigate("/rankingDetails/" + paramsYear, { replace: true });
    };





    return (
        <>
            <Header />


            <Container fluid >
                <Row className='row-content-ranking-true'>
                    {/* edit class row col divranking */}
                    <Navbar isActive={isActive} />

                    <Col sm={9} md={10} className='col-content-ranking' >
                        <div className='div-content-ranking'>

                            <div className='header-ranking-edit'>
                                <img
                                    src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                    alt='edit'
                                    className='img-logoedit'
                                >
                                </img>
                                <div className='text-ranking'>แก้ไขการจัดอันดับ 10 อาชีพปี {paramsYear} </div>
                            </div>


                            <div className='div-form'>
                                <Form
                                noValidate validated={validated} onSubmit={handleSubmit}
                                >
                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>อันดับที่ {rank} อาชีพ :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่อาชีพ"
                                                value={careerName}
                                                onChange={(e) => setCareerName(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่อาชีพ
                                            </Form.Control.Feedback>
                                        </div>
                                    </div>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>เปอร์เซ็นต์       :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่เปอร์เซ็น"
                                                value={percent}
                                                onChange={(e) => setPercent(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่เปอร์เซ็น
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