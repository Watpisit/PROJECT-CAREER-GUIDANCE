import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner, Button, Form } from 'react-bootstrap';
import Header from './Header';
import Navbar from './Navbar';
import './MenuAptitude.css'


export default function MenuAptitudeAddEdit(props) {

    let params = useParams();
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [aptitudeAll, setAptitudeAll] = useState([]);
    const [aptitudeID, setAptitudeID] = useState("");
    const [aptitudeName, setAptitudeName] = useState("");
    const [aptitudeDetails, setAptitudeDetails] = useState("");
    const isActive = 3;

    useEffect(() => {
        const getAptitude = async () => {
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
            const result = await response.json();
            setAptitudeAll(result.data);
        }
        getAptitude();

        if (props.data === 'update') { /*วันนี้เริ่มทำตรงนี้สร้างในserver */
            const getAptitudeUpdate = async () => {

                const response = await fetch(
                    `http://localhost:8080/api/get_aptitude/${params.aptitudeID}`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            'Content-Type': "application/json"
                        }
                    }
                );
                const aptitudeUpdate = await response.json();
                setAptitudeID(aptitudeUpdate.data[0].aptitudeID);
                setAptitudeName(aptitudeUpdate.data[0].aptitudeName);
                setAptitudeDetails(aptitudeUpdate.data[0].aptitudeDetails);
            }
            getAptitudeUpdate();
        }


    }, [params.aptitudeID, props.data]);



    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault(); //ป้องกันไม่ให้เกิดการเปลี่ยนหน้าจากการกด submit

        if (form.checkValidity() === false) {
            event.stopPropagation(); //ถ้ากรอกข้อมูลไม่ครบจะไม่ให้เกิดอีเว้นใดๆ
        } else {
            if (props.data === "add") {
                addAptitude();
            } else if (props.data === "update") {
                //พน.ทำถ้าผู้ใช้กดปุ่มจะทำฟังก์ชันอัพเดทและ ใช้ condition rendering แสดงส่วนหัวเป็นแก้ไข
                updateAptitude();
            }
        }
        setValidated(true);
    }

    const addAptitude = async () => {
        setLoading(true);
        const requestData = {
            aptitudeID: aptitudeAll.length + 1,
            aptitudeName: aptitudeName,
            aptitudeDetails: aptitudeDetails
        };

        const response = await fetch(
            "http://localhost:8080/api/add_aptitude",
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
            navigate("/aptitude", { replace: false });
        }
    };


    const updateAptitude = async () => {
        setLoading(true);
        const data = {
            aptitudeID: aptitudeID,
            aptitudeName: aptitudeName,
            aptitudeDetails: aptitudeDetails
        };

        try {
            const response = await fetch(`http://localhost:8080/aptitude/update/${aptitudeID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            setLoading(false);
            if (responseData.result === true) {
                navigate("/aptitude", { replace: false });
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleCancel = () => {
        navigate("/aptitude", { replace: false });
    };





    return (
        <>

            <Header />



            <Container fluid >
                <Row className='row-content-aptitude-add'>
                    <Navbar isActive={isActive} />

                    <Col sm={9} md={10} className='col-content-aptitude-add' >
                        <div className='div-content-aptitude-add'>


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
                                <div className='div-editaptitude'>
                                    <img className='img-edit'
                                        src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                        alt='edit'
                                    ></img>
                                    <div className='text-aptitude'>
                                        เพิ่มความถนัด
                                    </div>
                                </div>
                            ) : <div className='div-editaptitude'>
                                <img className='img-edit'
                                    src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                    alt='edit'
                                ></img>
                                <div className='text-aptitude'>
                                    เเก้ไขความถนัด
                                </div>

                            </div>}

                            <div className='div-form'>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>


                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>ความถนัด         :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่ความถนัด"
                                                value={aptitudeName}
                                                onChange={(e) => setAptitudeName(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่ความถนัด
                                            </Form.Control.Feedback>
                                        </div>
                                    </div>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>รายละเอียดความถนัด :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่รายละเอียดความถนัด"
                                                as="textarea" rows={9}
                                                value={aptitudeDetails}
                                                onChange={(e) => setAptitudeDetails(e.target.value)}
                                                style={{ maxHeight: '350px'}}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่รายละเอียดความถนัด
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