import './MenuHomePage.css'
import Header from './Header';
import Navbar from './Navbar';
import { Nav, Container, Row, Col } from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { Link } from "react-router-dom";
import { Chart as ChartJS } from "chart.js/auto";


export default function MenuHomePage() {

    const [userAll, setUserAll] = useState([]);
    const [numberUsers, setNumberUsers] = useState(0);
    const [numberAssessment, setNumberAssessment] = useState(0);
    const [numberAptitudeData, setNumberAptitudeData] = useState(0);
    const [numberAptitudePerson, setNumberAptitudePerson] = useState(0);
    const [numberAptitudeTool, setNumberAptitudeTool] = useState(0);
    // const [dataRanking, setdataRanking] = useState([]); เก็บข้อมูลซีทการจัดอันดับทั้งหมด
    const [yearsAll, setYearsAll] = useState([]);  //ปีทั้งหมด
    const [yearsArr, setYearsArr] = useState([]);  //ปีที่ไม่ซ้ำกัน
    const [career, setCareer] = useState([]);
    const [percent, setPercent] = useState([]);
    const isActive = 1 //เข้าสู่หน้าแรกจะส่ง 1 ไปยังคอมโพแนน SideB เพื่อให้เมนูหน้าแรกเป็นสีฟ้า
    var maxYear = Math.max(...yearsArr);  //หาข้อมูลปีล่าสุดในอเรย์ ['2560','2566'] จะเก็บปี 2566 ไว้
    
    console.log(maxYear)
    console.log(yearsArr)


    useEffect(() => {    //พน.ทำ api เรียกข้อมูลผู้ใช้เอาข้อมูลไป set ไว้ใน useState แล้วไปใส่ตัวแปรใน title ชื่อมุมขวาเว็บ
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
            // setdataRanking(ranking.data);
            var yearsNew1 = [...new Set(ranking.data.map(item => item.years))]; //Set สร้างชุดข้อมูลที่ไม่ซ้ำกัน,...ใช้แปลง Setเป็นอเรย์
            var yearsNew2 = (ranking.data.map(item => item.years));
            var careerServer = (ranking.data.map(item => item.career)); //วนลูปคีย์ออบเจ็ค career ทั้งหมด
            var percentServer = (ranking.data.map(item => item.percent));
            setYearsArr(yearsNew1);
            setYearsAll(yearsNew2);
            setCareer(careerServer);
            setPercent(percentServer);
            console.log(yearsNew1)
        };

        const getUserAll = async () => {
            const response = await fetch(
                "http://localhost:8080/api/get_userAll",
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        'Content-Type': "application/json"
                    }
                }
            );
            const usersAll = await response.json();
            setUserAll(usersAll.data);

        };

        getRanking();
        getUserAll();
    }, []);

    
  useEffect(() => {  
            // ใช้ filter ในการกรองข้อมูลคนที่มี aptitudeID 1 2 3
            const AptitudeID1 = userAll.filter(user => user.aptitudeID === '1');
            const countAptitudeID1 = AptitudeID1.length;
            const AptitudeID2 = userAll.filter(user => user.aptitudeID === '2');
            const countAptitudeID2 = AptitudeID2.length;
            const AptitudeID3 = userAll.filter(user => user.aptitudeID === '3');
            const countAptitudeID3 = AptitudeID3.length;
            setNumberAptitudeData(countAptitudeID1);
            setNumberAptitudePerson(countAptitudeID2);
            setNumberAptitudeTool(countAptitudeID3);
 }, [userAll]);
  




    const getNumberUsers = async () => {
        const response = await fetch(
            "http://localhost:8080/api/get_NumberUsers",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                }
            }
        );
        const data = await response.json();
        setNumberUsers(data.data);
    }
    getNumberUsers(); //เรียกใช้ฟังก์ชัน
    // setInterval(getNumberUsers, 1 * 60 * 1000); //เรียกฟังก์ชันทุก 1 นาที (1 * 60 * 1000 มิลลิวินาที) 


    const getNumberAssessment = async () => {
        const response = await fetch(
            "http://localhost:8080/api/get_NumberAssessment",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                }
            }
        );
        const data = await response.json();
        setNumberAssessment(data.data);
    }
    getNumberAssessment(); //เรียกใช้ฟังก์ชัน
    // setInterval(getNumberAssessment, 1 * 60 * 1000); //เรียกฟังก์ชันทุก 1 นาที (1 * 60 * 1000 มิลลิวินาที) 


    // สร้างTab Nav.Link จากข้อมูลใน year
    const navLinks = yearsArr.map((yearValue, index) => (
        <Nav.Item key={index}>
            <Nav.Link
                as={Link} to={`/get_graphyears/${yearValue}`}
                className={yearValue === maxYear.toString() ? 'text-color-custom' : 'text-color'}
            >{yearValue}</Nav.Link>
        </Nav.Item>
    ));


    //สร้างกราฟจัดอันดับปีล่าสุด
    var data = career.map((career1, index) => [percent[index], career1, yearsAll[index]]);  // [30, 'งานขายและการตลาด','2565'], [20, 'งานบัญชีและการเงิน','2564'],
    var filteredData = data.filter(item => item[2] === maxYear.toString());  //ถ้า idx == maxYear จะเก็บข้อมูลตัวนั้นไว้
    var sortedData = filteredData.sort((a, b) => b[0] - a[0]);  //sort() เพื่อเรียงลำดับข้อมูลในอาร์เรย์ data มากไปน้อยโดยใช้ค่าตัวเลขในตำแหน่งแรกของข้อมูล (index 0)
    const chartData = {
        labels: sortedData.map(item => `${item[1]}`),// ระบุรายชื่ออาชีพที่ต้องการแสดงในกราฟ
        datasets: [
            {
                label: 'เปอร์เซ็นต์', // ตั้งชื่อรายการข้อมูล
                data: sortedData.map(item => item[0]), // ระบุข้อมูลการจัดอันดับสำหรับแต่ละอาชีพ
                backgroundColor: 'rgba(46,112,138)', // ตั้งค่าสีพื้นหลังแท่ง
            },
        ],
    };
    const chartOptions = {
        indexAxis: 'y', // กำหนดแกนเป็นแนวตั้ง
        responsive: true,
        scales: {
            x: {
                beginAtZero: true, // ให้แกน X เริ่มต้นที่ค่า 0

            },
        },
    };
    // console.log("---------------------------------")
    // console.log("career"+career)
    // console.log("data"+data)
    // console.log("filterdata"+filteredData)
    // console.log("sotf"+sortedData)





    return (
        <>

            <Header />
            {/* เรียกใช้คอนโพแนน Header *****กรณีทีชื่อหายบ่อยต้องส่งไอดีผู้ใช้ไปยังคอมโพแนนนี้เเล้วยิงรีเควสอีกครั้ง(ยังไม่แน่ใจคอถามจารย์) */}

            <Container fluid>
                <Row className='row-content-home'>
                    <Navbar isActive={isActive} />
                    {/* เรียกใช้คอนโพแนน Navbar ส่งค่าเลข 1 ไปเพื่อทำให้เข้าเงื่อนไข css เรียกใช้คลาสที่กำหนดไว้*/}

                    <Col sm={9} md={10} className='col-content-home' >
                        <div className='div-content-home' >

                            <div className='div-count'>
                                <div class="blue-box">
                                    จำนวนผู้ใช้
                                    <br></br>
                                    <div className='div-box-text'>{numberUsers}</div>
                                </div>
                                <div class="green-box">
                                    จำนวนครั้งที่ทำแบบประเมิน
                                    <br></br>
                                    <div className='div-box-text'>{numberAssessment}</div>
                                </div>

                                <div class="box-colums">
                                    <div class="aptitude-box">
                                        จำนวนผู้ใช้ที่มีความถนัดด้านข้อมูล
                                        <br></br>
                                        <div className='div-box-text'>{numberAptitudeData}</div>
                                    </div>
                                    <div class="aptitude-box">
                                        จำนวนผู้ใช้ที่มีความถนัดด้านบุลคล
                                        <br></br>
                                        <div className='div-box-text'>{numberAptitudePerson}</div>
                                    </div>
                                    <div class="aptitude-box">
                                        จำนวนผู้ใช้ที่มีความถนัดด้านเครื่องมือ
                                        <br></br>
                                        <div className='div-box-text'>{numberAptitudeTool}</div>
                                    </div>
                                </div>


                            </div>

                            <div className='div-graph'>
                                <div style={{ marginLeft: '3%' }}><h3><b>10 อันดับอาชีพที่ตลาดแรงงานมีความต้องการในปี {maxYear}</b></h3></div>
                                <div className='div-bar'>
                                    <Nav variant="tabs" >
                                        {navLinks}
                                    </Nav>

                                    <Bar data={chartData} options={chartOptions} />

                                </div>


                            </div>


                        </div>

                    </Col>


                </Row>
            </Container>


        </>
    )
}