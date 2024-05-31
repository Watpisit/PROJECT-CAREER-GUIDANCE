import Header from './Header';
import Navbar from './Navbar';
import { Container, Row, Col,  Button,  Form } from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import './MenuCourse.css'
import './MenuCareer.css'
import './MenuAptitudeCareer.css'
import {  useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select'

export default function MenuAptitudeCareerAddEdit(props) {


    const isActive = 8;
    let params = useParams();
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const [aptituderadio, setAptitudeRadio] = useState(params.aptitudeID);
    const [careerAll, setCareerAll] = useState([]);
    const [aptitudeAll, setAptitudeAll] = useState([]);
    const [aptitudeCareerAll, setAptitudeCareerAll] = useState([]);


    const [aptitudeID, setAptitudeID] = useState('' + params.aptitudeID);
    const [paramsAptitudeCareerID, setParamsAptitudeCareerID] = useState('');
    const [selectedCareers, setSelectedCareers] = useState(params.careerID ? [{ value: params.careerID, label: params.careerName }] : []);
    const [careersOptions, setCareersOptions] = useState([]);



    useEffect(() => {
        setAptitudeID(""+params.aptitudeID)
        if (props.data === 'update') {
            getCareer();
            getAptitude();
            getAptitudeCareer();
            setParamsAptitudeCareerID(params.aptitude_careerID);
        } else if (props.data === 'add') {
            getCareer();
            getAptitude();
            getAptitudeCareer();
        }
    }, [params.aptitudeID,params.aptitude_careerID,props.data]);




    useEffect(() => {
        if (props.data === 'update' && careerAll.length > 0) {
            let careerOptions1 = careerAll.map(career => ({
                value: career.careerID,
                label: career.careerName,
            }));
            setCareersOptions(careerOptions1);


        } else if (props.data === 'add' && careerAll.length > 0) {
            let careerOptions1 = careerAll.map(career => ({
                value: career.careerID,
                label: career.careerName,
            }));

            setCareersOptions(careerOptions1);


        }

    }, [careerAll,props.data]);




    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault(); //ป้องกันไม่ให้เกิดการเปลี่ยนหน้าจากการกด submit

        if (form.checkValidity() === false) {
            event.stopPropagation(); //ถ้ากรอกข้อมูลไม่ครบจะไม่ให้เกิดอีเว้นใดๆ
        } else {
            if (props.data === "add") {
                addAptitudeCareer();
            } else if (props.data === "update") {
                await updateAptitudeCareer();
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
        const aptitude = await response.json();
        setAptitudeAll(aptitude.data);
    }

    const getAptitudeCareer = async () => {
        const response = await fetch(
            "http://localhost:8080/api/get_aptitude_career",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                }
            }
        );
        const result = await response.json();
        setAptitudeCareerAll(result.data);
    }



    const addAptitudeCareer = async () => {
        let maxID = 0;
        for (let i = 0; i < aptitudeCareerAll.length; i++) {  //ค้นหาไอดีสูงสุด
            let aptitudeCareerID1 = parseInt(aptitudeCareerAll[i].aptitude_careerID, 10); //เลขฐาน10
            if (aptitudeCareerID1 > maxID) {
                maxID = aptitudeCareerID1;
            }
        }

        //selectedCareers เก็บข้อมูลเป็นออบเจ็ค Ex.  [{label : "สัตวแพทย์", value : "1"},{label : "แพทย์", value : "2"}]
        //แปลงเอาแค่ไอดี
        const selectedCareersID = [];
        for (let i1 = 0; i1 < selectedCareers.length; i1++) {
            selectedCareersID.push(selectedCareers[i1].value)
        }


        const requestData = {
            aptitude_careerID: maxID + 1,
            aptitudeID: aptituderadio,
            careerID: selectedCareersID
        };


        const response = await fetch(
            "http://localhost:8080/api/add_aptitude_career",
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
            navigate("/match_aptitude_career", { replace: false });
        }
    };




    const updateAptitudeCareer = async () => {

        for (var i = 0; i < aptitudeCareerAll.length; i++) {
            if (aptitudeCareerAll[i].aptitude_careerID.toString() === params.aptitude_careerID.toString()) {
                const rowUpdateInt = parseInt(i) + 2
                // setRowUpdate(rowUpdateInt);

                const data = {
                    aptitude_careerID: paramsAptitudeCareerID,
                    aptitudeID: aptituderadio,
                    careerID: selectedCareers
                };


                try {
                    const response = await fetch(`http://localhost:8080/aptitude_career/update/${rowUpdateInt}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    });

                    const responseData = await response.json();
                    if (responseData.result === true) {
                        navigate("/match_aptitude_career", { replace: true });
                    }
                } catch (error) {
                    console.error(error);
                }


                break;
            }
        }


        // const data = {
        //     aptitude_careerID: paramsAptitudeCareerID,
        //     aptitudeID: aptituderadio,
        //     career: selectedCareers
        // };

        // console.log(data);



        // try {
        //     const response = await fetch(`http://localhost:8080/aptitude_career/update/${rowUpdate}`, {
        //         method: "PUT",
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify(data)
        //     });

        //     const responseData = await response.json();
        //     if (responseData.result === true) {
        //         navigate("/match_aptitude_career", { replace: true });
        //     }
        // } catch (error) {
        //     console.error(error);
        // }
    };





    const handleCancel = () => {
        navigate("/match_aptitude_career", { replace: false });
    };





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
                                        เพิ่มการจับคู่ความถนัดที่สอดคล้องกับอาชีพ
                                    </div>
                                </div>
                            ) : <div className='div-editassessment'>
                                <img className='img-edit'
                                    src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                    alt='edit'
                                ></img>
                                <div className='text-assessment'>
                                    เเก้ไขการจับคู่ความถนัดที่สอดคล้องกับอาชีพ
                                </div>

                            </div>}




                            {props.data === "add" && aptitudeAll.length > 0 && (
                                <div className='div-form-career-add' >
                                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                        <div className='d-flex ' >
                                            <div className='text-content'>ความถนัด : </div>
                                            <pre>  </pre>
                                            <div >
                                                {aptitudeAll.map((item, idx) => (
                                                    <div key={item.aptitudeID}>
                                                        <Form.Check
                                                            inline
                                                            label={item.aptitudeName}
                                                            name="aptitude"
                                                            type="radio"
                                                            id={item.aptitudeID}
                                                            defaultChecked={aptitudeID.toString() === item.aptitudeID.toString()}
                                                            onChange={() => setAptitudeRadio(item.aptitudeID)}
                                                            className='text-content'
                                                        />
                                                        <br />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <br></br>
                                        <div className='d-flex' >
                                            <div className='text-content' >อาชีพ</div>
                                            <pre className='text-content'>    : </pre>

                                            <div className='div-form-control'>
                                                <Select
                                                    isMulti
                                                    isSearchable
                                                    placeholder="ค้นหา"
                                                    noOptionsMessage={() => "ไม่มีอาชีพ"}
                                                    options={careersOptions}
                                                    value={selectedCareers}
                                                    onChange={(selectedCareers) => setSelectedCareers(selectedCareers)}  //เมื่อเพิ่มหรือลบอาชีพฟังชันก์ไม่มีชื่อนี้เรียกว่าแอโร่ฟังก์ชัน
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



                            {props.data === "update" && aptitudeID.length > 0 && (
                                <div className='div-form-career-add' >
                                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                        <div className='d-flex ' >
                                            <div className='text-content'>ความถนัด : </div>
                                            <pre>  </pre>
                                            <div >
                                                {aptitudeAll.map((item, idx) => (
                                                    <div key={item.aptitudeID}>
                                                        <Form.Check
                                                            inline
                                                            label={item.aptitudeName}
                                                            name="aptitude"
                                                            type="radio"
                                                            id={item.aptitudeID}
                                                            defaultChecked={params.aptitudeID.toString() === item.aptitudeID.toString()}
                                                            onChange={() => setAptitudeRadio(item.aptitudeID)}
                                                            className='text-content'
                                                        />
                                                        <br />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <br></br>
                                        <div className='d-flex' >
                                            <div className='text-content' >อาชีพ</div>
                                            <pre className='text-content'>    : </pre>

                                            <div className='div-form-control'>
                                                <Select
                                                    //isMulti
                                                    isSearchable
                                                    placeholder="ค้นหา"
                                                    noOptionsMessage={() => "ไม่มีอาชีพ"}
                                                    options={careersOptions}
                                                    value={selectedCareers}

                                                    onChange={(selectedCareers) => setSelectedCareers(selectedCareers)}  //เมื่อเพิ่มหรือลบอาชีพฟังชันก์ไม่มีชื่อนี้เรียกว่าแอโร่ฟังก์ชัน
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


