import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Header from './Header';
import Navbar from './Navbar';
import './MenuCourse.css'
import './MenuAssessment.css'
import './MenuFaculty'
export default function MenuCareerAddEdit(props) {

    let params = useParams();
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const isActive = 7;

    const [careerAll, setCareerAll] = useState([]);
    const [careerID, setCareerID] = useState('');
    const [careerName, setCareerName] = useState('');
    const [careerDetails, setCareerDetails] = useState('');
    const [image, setImage] = useState('');
    const [paramsCareerID, setParamsCareerID] = useState('');
    const [rowUpdate , setRowUpdate] = useState(0);


    useEffect(() => {
        if (props.data === 'update') {
            getCareer();
            setParamsCareerID(params.careerID);
        } else if (props.data === 'add') {
           getCareer();
        }
    }, [props.data ,params.careerID]);

    useEffect(() => {
        if (props.data === 'update' && careerAll.length > 0 ) {
            const careerAll1 = careerAll.find(item => item.careerID === paramsCareerID.toString());
            setCareerID(careerAll1.careerID);
            setCareerName(careerAll1.careerName);
            setCareerDetails(careerAll1.careerDetails);
            setImage(careerAll1.image);

            var rowID = 0;   //หาตน.แถวที่ต้องการอัพเดท
            for(let i=0 ; i<careerAll.length; i++){
                if(params.careerID.toString() === careerAll[i].careerID.toString()){
                    rowID = i+2   //index+1 , ชื่อคอลัมน์ซีท+1
                    setRowUpdate(rowID);
                    break;
                }
            }
        }

    }, [careerAll,params.careerID ,props.data,paramsCareerID]);



    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault(); //ป้องกันไม่ให้เกิดการเปลี่ยนหน้าจากการกด submit

        if (form.checkValidity() === false) {
            event.stopPropagation(); //ถ้ากรอกข้อมูลไม่ครบจะไม่ให้เกิดอีเว้นใดๆ
        } else {
            if (props.data === "add") {
                addCareer();
            } else if (props.data === "update") {
              updateCareer();
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



    const addCareer = async () => {
        let maxID = 0;
        for(let i =0 ; i<careerAll.length ; i++ ){  //ค้นหาไอดีสูงสุด
            let careerID1 = parseInt(careerAll[i].careerID, 10); //เลขฐาน10
            if(careerID1 > maxID){
                maxID = careerID1;
            }
        }
    
        const requestData = {
            careerID: maxID+1,
            careerName:careerName,
            careerDetails: careerDetails,
            image: image
        };

        const response = await fetch(
            "http://localhost:8080/api/add_career",
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
            navigate("/career", { replace: false });
        }
    };


    const updateCareer = async () => {
        const data = {
            careerID: careerID,
            careerName:careerName,
            careerDetails: careerDetails,
            image: image
        };

    
        try {
            const response = await fetch(`http://localhost:8080/career/update/${rowUpdate}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            if (responseData.result === true) {
                navigate("/career", { replace: true });
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleCancel = () => {
        navigate("/career", { replace: false });
    };



    return (
        <>
            <Header />


            <Container fluid >
                <Row className='row-content-course-heightlock'>
                    <Navbar isActive={isActive} />

                    <Col sm={9} md={10} className='col-content-course' >
                        <div className='div-content-course-false'>


                            {props.data === 'add' ? (
                                <div className='div-editassessment'>
                                    <img className='img-edit'
                                        src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                        alt='add'
                                    ></img>
                                    <div className='text-assessment'>
                                        เพิ่มอาชีพ
                                    </div>
                                </div>
                            ) : <div className='div-editassessment'>
                                <img className='img-edit'
                                    src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                    alt='edit'
                                ></img>
                                <div className='text-assessment'>
                                    เเก้ไขอาชีพ
                                </div>

                            </div>}

                            <div className='div-form-career-add'>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>ชื่ออาชีพ       :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่ชื่ออาชีพ"
                                                value={careerName}
                                                onChange={(e) => setCareerName(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่ชื่ออาชีพ
                                            </Form.Control.Feedback>
                                        </div>
                                    </div>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>รายละเอียดอาชีพ :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="ใส่รายละเอียดอาชีพ"
                                                value={careerDetails}
                                                onChange={(e) => setCareerDetails(e.target.value)}
                                            // maxLength={2} // กำหนดความยาวสูงสุดให้เป็น 2 ตัวอักษร
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่รายละเอียดอาชีพ
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
                                                placeholder="ใส่ลิงก์รูปภาพ (https)"
                                                as="textarea" rows={9}
                                                value={image}
                                                onChange={(e) => setImage(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่ลิงก์รูปภาพ
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