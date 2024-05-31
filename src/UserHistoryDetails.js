import { Container } from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import "./User.css";
import UserNavbar from "./UserNavbar"

export default function UserHistoryDetails() {
   
    var params = useParams();

    const [aptitudeAll, setAptitudeAll] = useState([]);
    const [historyAll, setHistoryAll] = useState([]);
    const [historyUser, setHistoryUser] = useState([]);
    const [aptitudeCareerAll, setAptitudeCareerAll] = useState([]);
    const [aptitudeDetails, setAptitudeDetails] = useState([]);
    const [careerAll, setCareerAll] = useState([]);
    const [careerNameAll, setCareerNameAll] = useState("")
    const maxScore = params.maxScore;
    const aptitudeID = params.aptitudeID;
    const aptitudeName = params.aptitudeName;

    const fetchData = async () => {
        const responseAptitude = await fetch(
            "http://localhost:8080/api/get_aptitude",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                }
            }
        );
        const aptitudeData = await responseAptitude.json();
        setAptitudeAll(aptitudeData.data);

        const responseHistory = await fetch(
            "http://localhost:8080/api/get_history",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                }
            }
        );
        const historyData = await responseHistory.json();
        setHistoryAll(historyData.data);

        const responseAptitudeCareer = await fetch(
            "http://localhost:8080/api/get_aptitude_career",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                }
            }
        );
        const aptitudeCareerData = await responseAptitudeCareer.json();
        setAptitudeCareerAll(aptitudeCareerData.data);

        const responseCareer = await fetch(
            "http://localhost:8080/api/get_career",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                }
            }
        );
        const careerData = await responseCareer.json();
        setCareerAll(careerData.data);
    }



    useEffect(() => {
        fetchData();
    }, [aptitudeID, careerAll, params.historyID]);



    useEffect(() => {
        const historyUser1 = historyAll.filter(item => item.historyID.toString() === params.historyID.toString());
        setHistoryUser(historyUser1);

        const aptitude1 = aptitudeAll.find(item => item.aptitudeID.toString() === aptitudeID.toString());
        if (aptitude1) {
            setAptitudeDetails(aptitude1.aptitudeDetails);
        }

        var idx = 1;
        if (Array.isArray(aptitudeCareerAll)) {
            var careerID1 = aptitudeCareerAll
                .filter(item => item.aptitudeID.toString() === aptitudeID.toString())
                .map(item => item.careerID);

            if (Array.isArray(careerID1)) { //เช็คว่าเป็นอเรย์มั้ย
                var matchingCareers = "";
                for (var i = 0; i < careerID1.length; i++) {
                    for (var j = 0; j < careerAll.length; j++) {
                        if (careerID1[i] === careerAll[j].careerID) {
                            matchingCareers += idx + ". " + careerAll[j].careerName + " \n";
                            idx += 1
                            break;
                        }
                    }
                }
                setCareerNameAll(matchingCareers);
            }
        }
    }, [historyAll, aptitudeAll, aptitudeCareerAll, careerNameAll, params.historyID, aptitudeID, careerAll]);




    return (
        <>
            <UserNavbar userID={params.userID} />
            <Container className='mb-5' style={{ marginLeft: '10px', height: '100%' }}>
                <h1 className='mb-2 text-center'>ประวัติการทำแบบประเมิน</h1>
                <h1 className='mb-2 text-center'>ผลลัพธ์การทำแบบประเมิน</h1>
                {historyUser.length > 0 && careerNameAll ? (
                    <>
                        <h4 className='mb-2 mt-5 text-start  me-2'>วันที่ : {historyUser[0].date} เวลา : {historyUser[0].time}</h4>
                        <h4 className='mb-2 text-start mt-3 me-2'>คะแนนสูงสุด {maxScore}</h4>
                        <h4 className='mb-2 text-start me-2'> {aptitudeName} </h4>
                        <h4 className='mb-2 text-start me-2' style={{ textIndent: "20px" }}> {aptitudeDetails} </h4>
                        <h4 className='mb-2 text-start mt-3 me-2'> อาชีพที่สอดคล้อง </h4>
                        <h4 className='mb-2 text-start me-2 d-flex flex-column'>
                            {careerNameAll.split('\n').map((name, idx) => ( //แยกส่วนที่มี /n เป็นอเรย์
                                <p key={idx}>{name}</p>
                            ))}
                        </h4>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </Container>
        </>
    )
}