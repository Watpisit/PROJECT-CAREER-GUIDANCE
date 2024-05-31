import { Container, Button,  Image } from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import { Link,  useParams, } from 'react-router-dom';
import "./User.css";


import UserNavbar from "./UserNavbar"

export default function UserHistory() {

    var params = useParams();


    const [aptitudeAll, setAptitudeAll] = useState([]);
    const [historyAll, setHistoryAll] = useState([]);
    const [historyUser, setHistoryUser] = useState([]);
    const [maxScores, setMaxScores] = useState([]);
    const [aptitudeName, setAptitudeName] = useState([]);
    const [aptitudeID, setAptitudeID] = useState([]);
    const [aptitudeDetails, setAptitudeDetails] = useState([]);
   





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

    const getHistory = async () => {
        const response = await fetch(
            "http://localhost:8080/api/get_history",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                }
            }
        );
        const history = await response.json();
        setHistoryAll(history.data);
    }


    useEffect(() => {
        getHistory();
        getAptitude();
    }, []);

    useEffect(() => {
        console.log(params.userID);
        var maxScoreArr = [];
        var aptitudeNameArr = [];
        var aptitudeIDArr = [];
        var aptitudeDetailsArr = [];
    
        // ตรวจสอบว่า historyAll มีค่าและ aptitudeAll มีค่า
        if (historyAll.length > 0 && aptitudeAll.length > 0) {
            var historyUser1 = historyAll.filter(item => item.userID.toString() === params.userID.toString());
            setHistoryUser(historyUser1);
    
            for (let i = 0; i < historyUser1.length; i++) {
                let dataAptitudeScore = parseInt(historyUser1[i].dataAptitudeScore);
                let personAptitudeScore = parseInt(historyUser1[i].personAptitudeScore);
                let toolAptitudeScore = parseInt(historyUser1[i].toolAptitudeScore);
    
                if ((dataAptitudeScore > personAptitudeScore) && (dataAptitudeScore > toolAptitudeScore)) {
                    aptitudeIDArr.push(aptitudeAll[0].aptitudeID.toString());
                    aptitudeNameArr.push(aptitudeAll[0].aptitudeName.toString());
                    aptitudeDetailsArr.push(aptitudeAll[0].aptitudeDetails.toString());
                    maxScoreArr.push(dataAptitudeScore);
                } else if ((personAptitudeScore > dataAptitudeScore) && (personAptitudeScore > toolAptitudeScore)) {
                    aptitudeIDArr.push(aptitudeAll[1].aptitudeID.toString());
                    aptitudeNameArr.push(aptitudeAll[1].aptitudeName.toString());
                    aptitudeDetailsArr.push(aptitudeAll[1].aptitudeDetails.toString());
                    maxScoreArr.push(personAptitudeScore);
                } else if ((toolAptitudeScore > dataAptitudeScore) && (toolAptitudeScore > personAptitudeScore)) {
                    aptitudeIDArr.push(aptitudeAll[2].aptitudeID.toString());
                    aptitudeNameArr.push(aptitudeAll[2].aptitudeName.toString());
                    aptitudeDetailsArr.push(aptitudeAll[2].aptitudeDetails.toString());
                    maxScoreArr.push(toolAptitudeScore);
                }
            }
    
            // ตั้งค่าตัวแปรต่าง ๆ
            setAptitudeID(aptitudeIDArr);
            setAptitudeName(aptitudeNameArr);
            setAptitudeDetails(aptitudeDetailsArr);
            setMaxScores(maxScoreArr);
        }
    }, [historyAll, aptitudeAll, params.userID]);


   





    return (

        <>

            <UserNavbar userID={params.userID} />
            <Container className=' mb-5 ' style={{ marginLeft: '10px' }}>
                <div className='d-flex flex-row align-items-center '>
                    <Image src="https://cdn-icons-png.flaticon.com/128/2822/2822687.png" style={{ width: '20%', marginRight: '4%' }} rounded />
                    <h1 className='mb-2'>ประวัติการทำแบบประเมิน</h1>
                </div>
            </Container>

            <Container >
                {maxScores.length > 0 && (
                    historyUser.map((historyItem, index) => (
                        <div key={index} className="mb-5 ms-2 me-2 gray-box">
                            <p className='ps-3 pt-2 pe-3 '>ครั้งที่ : {index + 1}</p>
                            <p className='ps-3 pt-2 pe-3'>วันที่ : {historyItem.date}</p>
                            <p className='ps-3 pt-2 pe-3'>เวลา : {historyItem.time}</p>
                            <p className='ps-3 pt-2 pe-3'>คะแนนสูงสุด : {maxScores[index]}</p>
                            <p className='ps-3 pt-2 pe-3 ' >{aptitudeName[index]} </p>
                            <p className='ps-3 pe-3 text-indent' >{aptitudeDetails[index]}</p>
                            {/* <p className='ps-3 pt-2 pe-3' >อาชีพที่สอดคล้อง </p> */}
                            {/* <p className='ps-3 pt-2 text-indent' >อาชีพที่สอดคล้อง </p> */}
                            <Link to={{ pathname: `/user/historydetails/${historyItem.historyID}/${maxScores[index]}/${aptitudeID[index]}/${aptitudeName[index]}/${params.userID}` }} className='d-flex w-100 justify-content-end' >
                                <Button className='bg-success' >
                                    ดูผลลัพธ์
                                </Button>
                            </Link>
                        </div>

                    ))
                )}
            </Container>
            <br></br>




        </>
    )
}