var ss = SpreadsheetApp.openById("1iOIWjOHoNhRAkWBfv4oSiEj8DgIHyzgsCoFqD53YDgQ");
var sheet = ss.getSheetByName("intent");

function doPost(e) {

    var data = JSON.parse(e.postData.contents)
    var userMsg = data.originalDetectIntentRequest.payload.data.message.text;
    var values = sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
    //[{ความถนัดด้านข้อมูล (Data) หรือ D,aptitude}, {ความถนัดด้านบุคคล (Person) หรือ P,aptitude}]
    var result; //ค้นหาข้อมูลซีทเจอจะเก็บไว้ในตัวแปรนี้
    var statusMsg = 0; // 0 = ค้นหาข้อมูลในซีทไม่เจอ ถ้าเจอข้อมูลจะกำหนดให้เป็น 1

    for (var i = 0; i < values.length; i++) {
        if (values[i][0] == userMsg) {
            statusMsg = 1; //ค้นหาข้อมูลในซีทเจอจะกำหนดให้เป็น 1
            i = i + 2;
            var sheetname = sheet.getRange(i, 2).getValue(); //ดึงข้อมูล
            var response = sheet.getRange(i, 3).getValue();
            var sheet1 = ss.getSheetByName(sheetname);
            var values1 = sheet1.getRange(2, 1, sheet1.getLastRow(), sheet1.getLastColumn()).getValues(); //ข้อมูลซีทที่ต้องการ


            if (sheetname == "faculty") {
                if (response == "ชื่อคณะ") {
                    var allFaculties;
                    var idx = 1;
                    var facultyName;
                    var length = values1.length - 1; //ใส่ -1 เพราะถ้าไม่ใส่มันจะวนลูปเกินมา 1 ครั้ง หาสาเหตุไม่เจอ

                    for (i = 0; i < length; i++) {
                        facultyName = sheet1.getRange(i + 2, 2).getValue();
                        if (idx == 1) {
                            allFaculties = "โปรดใส่ Keyword คณะที่คุณต้องการทราบรายละเอียดค่ะ\n" + "F" + idx + ". " + facultyName
                        } else {
                            allFaculties = allFaculties + "\n" + "F" + idx + ". " + facultyName
                        }
                        idx = idx + 1;
                    }

                    result = {
                        "fulfillmentMessages": [
                            {
                                "platform": "line",
                                "type": 4,
                                "payload": {
                                    "line": {
                                        "type": "text",
                                        "text": allFaculties
                                    }

                                }
                            }
                        ]
                    }

                } else if (response == "การ์ดคณะ") {

                    for (i = 0; i < values1.length; i++) {
                        var facultyID = sheet1.getRange(i + 2, 1).getValue();
                        var userMsgArr = userMsg.slice(1);
                        if (facultyID == userMsgArr) {
                            var facultyName = sheet1.getRange(i + 2, 2).getValue();
                            var facultyImage = sheet1.getRange(i + 2, 6).getValue();
                            var facultyWebsite = sheet1.getRange(i + 2, 7).getValue();

                            result = {
                                "fulfillmentMessages": [
                                    {
                                        "platform": "line",
                                        "type": 4,
                                        "payload": {
                                            "line": {
                                                "type": "template",
                                                "altText": facultyName,
                                                "template": {
                                                    "type": "buttons",
                                                    "thumbnailImageUrl": facultyImage,
                                                    "title": facultyName,
                                                    "text": "มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตหาดใหญ่",
                                                    "actions": [
                                                        {
                                                            "type": "message",
                                                            "label": "รายละเอียดคณะ",
                                                            "text": "รายละเอียด" + facultyName
                                                        },
                                                        {
                                                            "type": "message",
                                                            "label": "หลักสูตร",
                                                            "text": "หลักสูตร" + facultyName
                                                        },
                                                        {
                                                            "type": "message",
                                                            "label": "แผนที่คณะ",
                                                            "text": "แผนที่" + facultyName
                                                        },
                                                        {
                                                            "type": "uri",
                                                            "label": "เว็บไซต์คณะ",
                                                            "uri": facultyWebsite
                                                        }
                                                    ]
                                                }
                                            }

                                        }
                                    }
                                ]
                            }
                            break;
                        }
                    }

                } else if (response == "รายละเอียดคณะ") { 
                    facultySheetIntent = userMsg.slice(10);

                    for (i = 0; i < values1.length; i++) {
                        var facultyName = sheet1.getRange(i + 2, 2).getValue();
                        if (facultySheetIntent == facultyName) {
                            var facultyDetails = sheet1.getRange(i + 2, 3).getValue()
                            result = {
                                "fulfillmentMessages": [
                                    {
                                        "platform": "line",
                                        "type": 4,
                                        "payload": {
                                            "line": {
                                                "type": "text",
                                                "text": "รายละเอียด" + facultyName + "\n" + facultyDetails
                                            }

                                        }
                                    }
                                ]
                            }

                            break;
                        }
                    }

                } else if (response == "แผนที่คณะ"){
                    var userMsg1 = userMsg.slice(6);

                    for (i = 0; i < values1.length; i++) {
                        var facultyName = sheet1.getRange(i + 2, 2).getValue(); //userMsg คือ ข้อความที่ผู้ใช้ส่งเข้ามาทางไลน์ Exแผนที่คณะวิทยาศาสตร์
                    if (userMsg1 == facultyName) { //userMsg1 คณะวิทยาศาสตร์ = facultyName คือ คณะนั้นๆ
                        var longitude = sheet1.getRange(i + 2, 5).getValue();
                        var latitude = sheet1.getRange(i + 2, 4).getValue();
                        result = {
                            "fulfillmentMessages": [
                                {
                                    "platform": "line",
                                    "type": 4,
                                    "payload": {
                                        "line": {
                                            "title": "ที่ตั้ง" + facultyName,
                                            "type": "location",
                                            "longitude": longitude,
                                            "address": "มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตหาดใหญ่",
                                            "latitude": latitude
                                          }

                                    }
                                }
                            ]
                        }
                        break;
                    }
                    }
                } else if (response == "ติดต่อคณะ") {
                    var allFaculties;
                    var idx = 1;
                    var facultyName;
                    var length = values1.length - 1; //ใส่ -1 เพราะถ้าไม่ใส่มันจะวนลูปเกินมา 1 ครั้ง หาสาเหตุไม่เจอ

                    for (i = 0; i < length; i++) {
                        facultyName = sheet1.getRange(i + 2, 2).getValue();
                        if (idx == 1) {
                            allFaculties = "โปรดใส่ Keyword คณะที่คุณต้องการทราบรายละเอียดค่ะ\n" + "T" + idx + ". " + facultyName
                        } else {
                            allFaculties = allFaculties + "\n" + "T" + idx + ". " + facultyName
                        }
                        idx = idx + 1;
                    }

                    result = {
                        "fulfillmentMessages": [
                            {
                                "platform": "line",
                                "type": 4,
                                "payload": {
                                    "line": {
                                        "type": "text",
                                        "text": allFaculties
                                    }

                                }
                            }
                        ]
                    }

                } else if (response == "รายละเอียดการติดต่อคณะ") { 
            
                    var facultyIDSheetIntent = userMsg.slice(1);

                    for (i = 0; i < values1.length; i++) {
                        var facultyID = sheet1.getRange(i + 2, 1).getValue();
                        if (facultyIDSheetIntent == facultyID) {
                            var phoneNumber = sheet1.getRange(i + 2, 8).getValue()
                            var email = sheet1.getRange(i + 2, 9).getValue()
                            var facultyWebsite = sheet1.getRange(i + 2, 7).getValue()
                            var facultyName = sheet1.getRange(i + 2, 2).getValue();
                            result = {
                                "fulfillmentMessages": [
                                    {
                                        "platform": "line",
                                        "type": 4,
                                        "payload": {
                                            "line": {
                                                "type": "text",
                                                "text": "สามารถติดต่อ" + facultyName + "ได้ที่ \n"  + "เบอร์โทร : " + phoneNumber + "\n" + "Email : " + email +"\n" + "Website : " + facultyWebsite
                                            }

                                        }
                                    }
                                ]
                            }

                            break;
                        }
                    }

                }



            } else if (sheetname == "course") {
                var sheetFaculty = ss.getSheetByName("faculty");
                var valuesFaculty = sheetFaculty.getRange(2, 1, sheetFaculty.getLastRow(), sheetFaculty.getLastColumn()).getValues(); //ข้อมูลซีทที่ต้องการ


                if (response == "ชื่อหลักสูตร") {
                    var userMsg1 = userMsg.slice(8);
                    var iFaculty=0;
                    var sheetFacultyFacultyID;
                    var courseAllName;
                    var statusCourseAllName=0;

                    for (iFaculty = 0; iFaculty < valuesFaculty.length; iFaculty++) {
                        var sheetFacultyFacultyName = sheetFaculty.getRange(iFaculty + 2, 2).getValue();
                        if (userMsg1 == sheetFacultyFacultyName) {
                            sheetFacultyFacultyID = sheetFaculty.getRange(iFaculty + 2, 1).getValue(); //จะได้ iD คณะในซีทคณะมาแล้ว
                            break;
                        }
                    }

                    var idx=0;
                    for(i=0; i<values1.length; i++){
                        var sheetCourseFacultyID = sheet1.getRange(i + 2, 5).getValue();
                        if(sheetFacultyFacultyID==sheetCourseFacultyID){ //ถ้าไอดีคณะในซีทคณะตรงกับไอดีคณะในซีทหลักสูตรจะเข้าเงื่อนไขนี้
                            var courseName = sheet1.getRange(i + 2, 2).getValue();
                            if(statusCourseAllName==0){
                                courseAllName = "โปรดใส่ Keyword หลักสูตรที่คุณต้องการทราบรายละเอียด\n"+"S"+(idx+1)+". "+courseName+"\n" 
                                statusCourseAllName=1;
                            } else
                            {
                                courseAllName = courseAllName+"S"+(idx+1)+". "+courseName+"\n" 
                            }
                            idx = idx+1
                        }

                    }

                    result = {
                        "fulfillmentMessages": [
                            {
                                "platform": "line",
                                "type": 4,
                                "payload": {
                                    "line": {
                                        "type": "text",
                                        "text": courseAllName
                                    }

                                }
                            }
                        ]
                    }

                }else if(response=="รายละเอียดหลักสูตร"){
                  

                }




            } else if (sheetname == "career") {
                 if (response == "อาชีพทั้งหมด") {
                    var allcareer;
                    var idx = 1;
                    var careerName;

                    for (i = 0; i < values1.length-1; i++) {
                      //values1.length 0-30
                        careerName = sheet1.getRange(i + 2, 2).getValue();
                        if (idx == 1) {
                            allcareer = "โปรดใส่ Keyword อาชีพที่คุณต้องการทราบรายละเอียดค่ะ\n" + "C" + idx + ". " + careerName
                            idx = idx + 1;
                        } else {
                            allcareer = allcareer + "\n" + "C" + idx + ". " + careerName
                            idx = idx + 1;
                        }                
                        
                    }

                    result = {
                        "fulfillmentMessages": [
                            {
                                "platform": "line",
                                "type": 4,
                                "payload": {
                                    "line": {
                                        "type": "text",
                                        "text": allcareer
                                    }

                                }
                            }
                        ]
                    }

                }
                 else if (response == "การ์ดอาชีพ") {

                    for (i = 0; i < values1.length; i++) {
                        var careerID = sheet1.getRange(i + 2, 1).getValue();
                        var userMsgArr = userMsg.slice(1);
                        if (careerID == userMsgArr) {
                            var careerName = sheet1.getRange(i + 2, 2).getValue();
                            var careerImage = sheet1.getRange(i + 2, 4).getValue();

                            result = {
                                "fulfillmentMessages": [
                                    {
                                        "platform": "line",
                                        "type": 4,
                                        "payload": {
                                            "line": {
                                                "type": "template",
                                                "altText": careerName,
                                                "template": {
                                                    "type": "buttons",
                                                    "thumbnailImageUrl": careerImage,
                                                    "title": careerName,
                                                    "text": "รายละเอียด",
                                                    "actions": [
                                                        {
                                                            "type": "message",
                                                            "label": "รายละเอียด",
                                                            "text": "รายละเอียดอาชีพ" + careerName
                                                        },
                                                        {
                                                            "type": "message",
                                                            "label": "หลักสูตร",
                                                            "text": "หลักสูตรที่เปิดสอนอาชีพ" + careerName
                                                        },
                                                        
                                                    ]
                                                }
                                            }

                                        }
                                    }
                                ]
                            }
                            break;
                        }
                    }

                } else if (response == "รายละเอียดอาชีพ") { 
                    careerSheetIntent = userMsg.slice(15);

                    for (i = 0; i < values1.length; i++) {
                        var careerName = sheet1.getRange(i + 2, 2).getValue();
                        if (careerSheetIntent == careerName) {
                            var careerDetails = sheet1.getRange(i + 2, 3).getValue()
                            result = {
                                "fulfillmentMessages": [
                                    {
                                        "platform": "line",
                                        "type": 4,
                                        "payload": {
                                            "line": {
                                                "type": "text",
                                                "text": "รายละเอียด" + careerName + "\n" + careerDetails
                                            }

                                        }
                                    }
                                ]
                            }

                            break;
                        }
                    }

                }
            }else if(sheetname == "careerRanking"){
             
               result = { 
                                "fulfillmentMessages": [
                                    {
                                        "platform": "line",
                                        "type": 4,
                                        "payload": {
                                            "line": {
                                                "type": "text",
                                                "text": ""
                                            }

                                        }
                                    }
                                ]
                            }



            }


            break;

        }


    }


    if (statusMsg == 0) { //ค้นหาข้อมูลในซีทไม่เจอ statusMsg=0 จะเข้าเงื่อนไขนี้
        result = {
            "fulfillmentMessages": [
                {
                    "platform": "line",
                    "type": 4,
                    "payload": {
                        "line": {
                            "type": "text",
                            "text": "ขอโทษค่ะ พูดอีกครั้งได้ไหมคะ"
                        }

                    }
                }
            ]
        }


    }

    var replyJSON = ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    return replyJSON;


}












