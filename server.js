const express = require("express"); //นำ express มาใช้งานผ่านตัวแปรชื่อ express
const app = express();
const port = 8080;

const { google } = require('googleapis');
const keys = require('./Keys.json');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));//ทำให้ express สามารถอ่านข้อมูลที่ผู้ใช้ป้อนผ่าน form ใน web ได้
app.use(bodyParser.json()); //ทำให้ express สามารถอ่านข้อมูลในรูปแบบ json ที่ได้รับจาก req ของ web

const cors = require('cors');
app.use(cors()); //สามารถรับ req จากโดเมนอื่นๆได้


var user;
var userID;
var lineID;
var username;
var password;
var fullname;
var image;
var roleID;
var aptitudeID;

app.get('/', (req, res) => {
  res.send("First Page Nodejs");
});

// กำหนดข้อมูลเข้าถึง
const { client_email, private_key } = keys;
const auth = new google.auth.JWT(client_email, null, private_key, ['https://www.googleapis.com/auth/spreadsheets']);
const sheets = google.sheets({ version: 'v4', auth });  // สร้าง Google Sheets client
// กำหนด ID ของ Google Sheet
const spreadsheetId = '1iOIWjOHoNhRAkWBfv4oSiEj8DgIHyzgsCoFqD53YDgQ';





// อ่านข้อมูลทั้งหมดใน Google Sheet    ตรวจสอบการล็อคอิน USERNAME PASSWORD
app.post('/api/login', async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  try {
    // สร้างคำขอสำหรับอ่านข้อมูล
    const sheetName = 'users';
    const request = {
      spreadsheetId,
      range: `${sheetName}!A1:ZZ`,
    };

    // ส่งคำขอเพื่ออ่านข้อมูลจาก Google Sheet
    const response = await sheets.spreadsheets.values.get(request);
    var rowsArr = response.data.values;
    if (rowsArr && rowsArr.length) {
      // console.log('ข้อมูลจาก Google Sheet:', rowsArr); 
      let statusLoop = 0; // 0 = วนลูปต่อไปไม่เจอข้อมูล, 1 = เจอข้อมูลแล้ว
      for (var i = 0; i < rowsArr.length; i++) {
        var usernameInSheet = rowsArr[i][2];
        var passwordInSheet = rowsArr[i][3];

        if ((username == usernameInSheet && password == passwordInSheet)) {
          const row = rowsArr[i];
          statusLoop = 1;
          try {
            user = row;
            userID = row[0];
            lineID = row[1];
            username = row[2];
            password = row[3];
            fullname = row[4];
            image = row[5];
            roleID = row[6];
            aptitudeID = row[7];
            res.json({  //  res.json จะส่งไปยัง react ได้ครั้งเดียวถ้าส่งหลายครั้งจะเออเร่อถ้าใช้ร่วมกับ for ต้องดูดีๆ
              result: true,
              data: rowsArr[i]
            });
          } catch (error) {
            console.error('เกิดข้อผิดพลาด:', error);
            console.trace();  //ข้อผิดพลาดที่อาจเกิดขึ้นระหว่างการส่ง JSON response จะใช้อันนี้
          }
        }
      }

      if (statusLoop == 0) {
        res.json({ result: false });
      }
    } else {
      console.log('ไม่พบข้อมูลใน Google Sheet');
      res.json({ result: false });
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอ่านข้อมูล:', error);
    res.json({ result: false });
  }
});




app.get('/api/get_user', async (req, res) => {
  const sheetName = 'users';
  const request = { spreadsheetId, range: `${sheetName}!A1:ZZ`, };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;  //ข้อมูลทั้งหมดในซีท

  for (var i = 0; i < rowsArr.length; i++) {
    var userIDInSheet = rowsArr[i][0];

    if (userID == userIDInSheet) {
      const userData = rowsArr[i];
      res.json({  //  res.json จะส่งไปยัง react ได้ครั้งเดียวถ้าส่งหลายครั้งจะเออเร่อถ้าใช้ร่วมกับ for ต้องดูดีๆ
        data: userData
      });
    }
  }
});


app.get('/api/get_NumberUsers', async (req, res) => {
  const sheetName = 'users';
  const request = { spreadsheetId, range: `${sheetName}!A1:ZZ`, };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;  //ข้อมูลทั้งหมดในซีท
  var numberUsers = 0;
  for (var i = 0; i < rowsArr.length; i++) {
    var roleID1 = rowsArr[i][6];
    if (roleID1 == "2") {
      numberUsers = numberUsers + 1
    }
  }
  res.json({  //  res.json จะส่งไปยัง react ได้ครั้งเดียวถ้าส่งหลายครั้งจะเออเร่อถ้าใช้ร่วมกับ for ต้องดูดีๆ
    data: numberUsers
  });
});


app.get('/api/get_NumberAssessment', async (req, res) => {
  const sheetName = 'assessment_history';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ`, };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;  //ข้อมูลทั้งหมดในซีท
  var numberAssessment = rowsArr.length;

  res.json({  //  res.json จะส่งไปยัง react ได้ครั้งเดียวถ้าส่งหลายครั้งจะเออเร่อถ้าใช้ร่วมกับ for ต้องดูดีๆ
    data: numberAssessment
  });
});


app.get('/api/get_userAll', async (req, res) => {
  const sheetName = 'users';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ`, };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;  //ข้อมูลทั้งหมดในซีท

  const objectData = rowsArr.map(item => {
    return {
      userID: item[0],
      lineID: item[1],
      username: item[2],
      password: item[3],
      fullname: item[4],
      image: item[5],
      roleID: item[6],
      aptitudeID: item[7]
    };
  });


  res.json({  //  res.json จะส่งไปยัง react ได้ครั้งเดียวถ้าส่งหลายครั้งจะเออเร่อถ้าใช้ร่วมกับ for ต้องดูดีๆ
    result: true,
    data: objectData
  });
});





app.get('/api/get_Ranking', async (req, res) => {
  const sheetName = 'careerRanking';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ`, };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;  //ข้อมูลทั้งหมดในซีท
  const objectData = rowsArr.map(item => {
    return {
      careerRankingID: item[0],
      rank: item[1],
      years: item[2],
      career: item[3],
      percent: item[4],
    };
  });

  // console.log();

  res.json({  //  res.json จะส่งไปยัง react ได้ครั้งเดียวถ้าส่งหลายครั้งจะเออเร่อถ้าใช้ร่วมกับ for ต้องดูดีๆ
    data: objectData
  });

});



app.put('/edit_profile/:userID', async (req, res) => {
  try {
    const userID = req.params.userID;
    const { fullname, username, password } = req.body;

    const updateData = [
      [username, password, fullname] // ตัวอย่าง: ข้อมูลในแต่ละคอลัมน์ของซีท
    ];

    // ข้อมูลที่จะอัปเดตอยู่ในแถวที่เป็น userID
    const rowIndex = Number(userID) + 1;

    // ทำการอัปเดตข้อมูลในซีท
    const request = {
      spreadsheetId,
      range: `users!C${rowIndex}:E${rowIndex}`, // ตัวอย่าง: อัปเดตคอลัมน์ A, B, C ในแถวที่ระบุ
      valueInputOption: 'RAW',
      resource: { values: updateData }
    };

    const response = await sheets.spreadsheets.values.update(request);
    res.json({ result: true, message: 'Data updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update data' });
  }
});

app.get('/api/get_Assessment', async (req, res) => {
  const sheetName = 'assessment_form';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ`, };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;  //ข้อมูลทั้งหมดในซีท
  const objectData = rowsArr.map(item => {
    return {
      assessmentID: item[0],
      assessmentName: item[1],
      choice01: item[2],
      choice02: item[3],
      choice03: item[4],
    };
  });

  res.json({  //  res.json จะส่งไปยัง react ได้ครั้งเดียวถ้าส่งหลายครั้งจะเออเร่อถ้าใช้ร่วมกับ for ต้องดูดีๆ
    data: objectData
  });
});


app.put('/api/delete_Assessment', async (req, res) => {

  let assessmentID = req.body.assessmentID;
  const sheetName = 'assessment_form';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ` };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;

  // ล้างข้อมูลในเรนจ์ที่ต้องการลบ
  const clearRequest = {
    spreadsheetId,
    range: `${sheetName}!A2:ZZ`,
  };
  await sheets.spreadsheets.values.clear(clearRequest);

  // สร้างอาร์เรย์ใหม่โดยกรองข้อมูลที่ assessmentID ไม่เท่ากับไอดีที่ส่งมา
  const updatedRowsArr = rowsArr.filter(item => item[0] !== assessmentID);
  const updatedRowsArr1 = updatedRowsArr.map((row, index) => {
    return [String(index + 1), ...row.slice(1)]; //เรียง iD 1 3 4 ->1 2 3
  });

  // อัปเดตข้อมูลในซีท
  const updateRequest = {
    spreadsheetId,
    range: `${sheetName}!A2:ZZ`,
    valueInputOption: 'RAW',
    resource: { values: updatedRowsArr1 },
  };
  await sheets.spreadsheets.values.update(updateRequest);

  const objectData = updatedRowsArr.map(item => {
    return {
      assessmentID: item[0],
      assessmentName: item[1],
      choice01: item[2],
      choice02: item[3],
      choice03: item[4],
    };
  });

  res.json({
    message: 'Successfully deleted assessment',
    data: objectData
  });
});


app.post("/api/add_Assessment", async (req, res) => {
  const data = req.body.requestData;
  let assessmentID = req.body.assessmentID;
  let assessmentName = req.body.assessmentName;
  let choice01 = req.body.choice01;
  let choice02 = req.body.choice02;
  let choice03 = req.body.choice03;

  // ข้อมูลที่จะเพิ่ม
  const range = 'assessment_form!A:E'; //ช่วงข้อมูลที่จะเพิ่ม
  const values = [
    [assessmentID, assessmentName, choice01, choice02, choice03]
  ];

  // สร้างคำขอสำหรับการเพิ่มข้อมูล
  const request = {
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    resource: {
      values
    },
  };

  // ส่งคำขอเพื่อเพิ่มข้อมูลลงใน Google Sheet
  sheets.spreadsheets.values.append(request, (err, response) => {
    if (err) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูล:', err);
      return;
    }
    // console.log('เพิ่มข้อมูลลงใน Google Sheet สำเร็จ');
    res.json({ success: true, message: "Data added successfully" });
  });
});


app.get('/api/get_Assessment/:assessmentID', async (req, res) => {
  const sheetName = 'assessment_form';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ`, };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;  //ข้อมูลทั้งหมดในซีท
  const objectData = rowsArr.map(item => {
    return {
      assessmentID: item[0],
      assessmentName: item[1],
      choice01: item[2],
      choice02: item[3],
      choice03: item[4],
    };
  });
  const filteredData = objectData.filter(item => item.assessmentID === req.params.assessmentID);

  res.json({
    data: filteredData
  });
});



app.put('/assessment/update/:assessmentID', async (req, res) => {
  try {
    let assessmentID1 = req.params.assessmentID;
    let assessmentName = req.body.assessmentName;
    let choice01 = req.body.choice01;
    let choice02 = req.body.choice02;
    let choice03 = req.body.choice03;

    const updateData = [
      [assessmentID1, assessmentName, choice01, choice02, choice03]
    ];
    let numberID = parseInt(assessmentID1);
    let rowIndex = numberID + 1;  //สมมติ assessmentID 21 จะอยู่แถวที่ 22 เพราะเเถวเเรกเป็นชื่อคอลัมน์
    // ทำการอัปเดตข้อมูลในซีท
    const request = {
      spreadsheetId,
      range: `assessment_form!A${rowIndex}:E${rowIndex}`, // ตัวอย่าง: อัปเดตคอลัมน์ A, B, C ในแถวที่ระบุ
      valueInputOption: 'RAW',
      resource: { values: updateData }
    };

    const response = await sheets.spreadsheets.values.update(request);
    res.json({ result: true, message: 'Data updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, message: 'Failed to update data' });
  }
});


app.get('/api/get_aptitude', async (req, res) => {
  const sheetName = 'aptitude';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ`, };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;  //ข้อมูลทั้งหมดในซีท
  const objectData = rowsArr.map(data => {
    return {
      aptitudeID: data[0],
      aptitudeName: data[1],
      aptitudeDetails: data[2]
    };
  });

  res.json({  //  res.json จะส่งไปยัง react ได้ครั้งเดียวถ้าส่งหลายครั้งจะเออเร่อถ้าใช้ร่วมกับ for ต้องดูดีๆ
    data: objectData,
    result: true
  });
});


app.put('/api/delete_Aptitude', async (req, res) => {
  let aptitudeID = req.body.aptitudeID;
  const sheetName = 'aptitude';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ` };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;

  // ล้างข้อมูลในเรนจ์ที่ต้องการลบ
  const clearRequest = {
    spreadsheetId,
    range: `${sheetName}!A2:ZZ`,
  };
  await sheets.spreadsheets.values.clear(clearRequest);

  // สร้างอาร์เรย์ใหม่โดยกรองข้อมูลที่ assessmentID ไม่เท่ากับไอดีที่ส่งมา
  const updatedRowsArr = rowsArr.filter(item => item[0] !== aptitudeID);
  const updatedRowsArr1 = updatedRowsArr.map((row, index) => {
    return [String(index + 1), ...row.slice(1)]; //เรียง iD 1 3 4 ->1 2 3
  });

  // อัปเดตข้อมูลในซีท
  const updateRequest = {
    spreadsheetId,
    range: `${sheetName}!A2:ZZ`,
    valueInputOption: 'RAW',
    resource: { values: updatedRowsArr1 },
  };
  await sheets.spreadsheets.values.update(updateRequest);

  const objectData = updatedRowsArr.map(item => {
    return {
      aptitudeID: item[0],
      aptitudeName: item[1],
      aptitudeDetails: item[2]
    };
  });

  res.json({
    message: 'Successfully deleted assessment',
    data: objectData
  });
});


app.post("/api/add_aptitude", async (req, res) => {
  let aptitudeID = req.body.aptitudeID;
  let aptitudeName = req.body.aptitudeName;
  let aptitudeDetails = req.body.aptitudeDetails;
  // ข้อมูลที่จะเพิ่ม
  const range = 'aptitude!A:E'; //ช่วงข้อมูลที่จะเพิ่มจะเพิ่มต่อจากแถวสุดท้าย
  const values = [
    [aptitudeID, aptitudeName, aptitudeDetails]
  ];
  // สร้างคำขอสำหรับการเพิ่มข้อมูล
  const request = {
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    resource: {
      values
    },
  };
  // ส่งคำขอเพื่อเพิ่มข้อมูลลงใน Google Sheet
  sheets.spreadsheets.values.append(request, (err, response) => {
    if (err) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูล:', err);
      return;
    }
    // console.log('เพิ่มข้อมูลลงใน Google Sheet สำเร็จ');
    res.json({ success: true, message: "Data added successfully" });
  });
});


app.get('/api/get_aptitude/:aptitudeID', async (req, res) => {
  const sheetName = 'aptitude';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ`, };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;  //ข้อมูลทั้งหมดในซีท
  const objectData = rowsArr.map(item => {
    return {
      aptitudeID: item[0],
      aptitudeName: item[1],
      aptitudeDetails: item[2],
    };
  });
  const filteredData = objectData.filter(item => item.aptitudeID === req.params.aptitudeID);

  res.json({
    data: filteredData
  });
});



app.put('/aptitude/update/:aptitudeID', async (req, res) => {  /*ทำส่วนนี้ */
  try {
    let aptitudeID = req.body.aptitudeID;
    let aptitudeName = req.body.aptitudeName;
    let aptitudeDetails = req.body.aptitudeDetails;

    const updateData = [
      [aptitudeID, aptitudeName, aptitudeDetails]
    ];
    // console.log(updateData)
    let numberID = parseInt(aptitudeID);
    let rowIndex = numberID + 1;  //สมมติ aptitudeID 21 จะอยู่แถวที่ 22 เพราะเเถวเเรกเป็นชื่อคอลัมน์
    // ทำการอัปเดตข้อมูลในซีท
    const request = {
      spreadsheetId,
      range: `aptitude!A${rowIndex}:E${rowIndex}`, // ตัวอย่าง: อัปเดตคอลัมน์ A, B, C ในแถวที่ระบุ
      valueInputOption: 'RAW',
      resource: { values: updateData }
    };

    const response = await sheets.spreadsheets.values.update(request);
    res.json({ result: true, message: 'Data updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, message: 'Failed to update data' });
  }
});



app.put('/api/delete_ranking_years', async (req, res) => {
  let years = req.body.years;
  const sheetName = 'careerRanking';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ` };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;

  // ล้างข้อมูลในเรนจ์ที่ต้องการลบ
  const clearRequest = {
    spreadsheetId,
    range: `${sheetName}!A2:ZZ`,
  };
  await sheets.spreadsheets.values.clear(clearRequest);

  //เปลี่ยนค่าแรกของแถวให้เป็น String ของ index + 1 
  //เพื่อทำการเรียงลำดับแถวด้วยเลขลำดับ และใช้ row.slice(1) เพื่อกําหนดค่าให้กับส่วนที่เหลือของแถวโดยไม่รวมค่าแรก
  const updatedRowsArr = rowsArr.filter(item => item[2] !== years);
  const updatedRowsArr1 = updatedRowsArr.map((row, index) => {
    return [String(index + 1), ...row.slice(1)]; //เรียง iD 1 3 4 ->1 2 3
  });

  // อัปเดตข้อมูลในซีท
  const updateRequest = {
    spreadsheetId,
    range: `${sheetName}!A2:ZZ`,
    valueInputOption: 'RAW',
    resource: { values: updatedRowsArr1 },
  };
  await sheets.spreadsheets.values.update(updateRequest);

  //แปลงอเรย์เป็นออบเจ็ค
  const objectData = updatedRowsArr1.map(item => {
    return {
      careerRankingID: item[0],
      rank: item[1],
      years: item[2],
      career: item[3],
      percent: item[4]
    };
  });

  res.json({
    message: 'Successfully deleted ranking',
    data: objectData
  });
});





app.post("/api/add_rankingyear", async (req, res) => {

  const requests = [];

  for (let i = 1; i <= 10; i++) {
    const careerRankingID = req.body.careerRankingID + i;
    const rank = req.body.rank;
    const years = req.body.years;
    const career = req.body.career;
    const percent = req.body.percent;

    const range = `careerRanking!A:E`;
    const values = [[careerRankingID, i, years, career, percent]];

    const request = {
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: {
        values
      },
    };

    requests.push(request);
  }


  for (let i = 0; i < requests.length; i++) {
    try {
      await sheets.spreadsheets.values.append(requests[i]);
    } catch (err) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูล:', err);
      res.status(500).json({ success: false, message: "Failed to add data" });
      return;
    }
  }

  res.json({ success: true, message: "Data added successfully" });
});



app.put('/ranking/update/:careerRankingID', async (req, res) => {
  try {
    let careerRankingID = req.params.careerRankingID;
    let career = req.body.career;
    let percent = req.body.percent;

    const updateData = [
      [career, percent]
    ];
    // console.log(updateData)
    let numberID = parseInt(careerRankingID);
    let rowIndex = numberID + 1;  //สมมติ ranking 21 จะอยู่แถวที่ 22 เพราะเเถวเเรกเป็นชื่อคอลัมน์
    // ทำการอัปเดตข้อมูลในซีท
    const request = {
      spreadsheetId,
      range: `careerRanking!D${rowIndex}:E${rowIndex}`, // ตัวอย่าง: อัปเดตคอลัมน์ A, B, C ในแถวที่ระบุ
      valueInputOption: 'RAW',
      resource: { values: updateData }
    };

    const response = await sheets.spreadsheets.values.update(request);
    res.json({ result: true, message: 'Data updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, message: 'Failed to update data' });
  }
});



app.get('/api/get_faculty', async (req, res) => {
  const sheetName = 'faculty';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ`, };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;  //ข้อมูลทั้งหมดในซีท
  const objectData = rowsArr.map(item => {
    return {
      facultyID: item[0],
      facultyName: item[1],
      facultyDetails: item[2],
      latitude: item[3],
      longitude: item[4],
      image: item[5],
      facultyWebsite: item[6],
      phoneNumber: item[7],
      email: item[8],
      facultyStatusID: item[9],
      keyword: item[10]
    };
  });

  res.json({  //  res.json จะส่งไปยัง react ได้ครั้งเดียวถ้าส่งหลายครั้งจะเออเร่อถ้าใช้ร่วมกับ for ต้องดูดีๆ
    data: objectData
  });

});

app.get('/api/get_course', async (req, res) => {
  const sheetName = 'course';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ`, };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;  //ข้อมูลทั้งหมดในซีท
  const objectData = rowsArr.map(item => {
    return {
      courseID: item[0],
      courseName: item[1],
      courseDetails: item[2],
      courseStatusID: item[3],
      facultyID: item[4]
    };
  });

  res.json({  //  res.json จะส่งไปยัง react ได้ครั้งเดียวถ้าส่งหลายครั้งจะเออเร่อถ้าใช้ร่วมกับ for ต้องดูดีๆ
    data: objectData
  });

});


app.put('/api/delete_course', async (req, res) => {
  let courseID = req.body.courseID;
  const sheetName = 'course';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ` };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;

  // ล้างข้อมูลในเรนจ์ที่ต้องการลบ
  const clearRequest = {
    spreadsheetId,
    range: `${sheetName}!A2:ZZ`,
  };
  await sheets.spreadsheets.values.clear(clearRequest);

  //เปลี่ยนค่าแรกของแถวให้เป็น String ของ index + 1 
  //เพื่อทำการเรียงลำดับแถวด้วยเลขลำดับ และใช้ row.slice(1) เพื่อกําหนดค่าให้กับส่วนที่เหลือของแถวโดยไม่รวมค่าแรก
  const updatedRowsArr = rowsArr.filter(item => item[0] !== courseID);
  const updatedRowsArr1 = updatedRowsArr.map((row, index) => {
    return [String(index + 1), ...row.slice(1)]; //เรียง iD 1 3 4 ->1 2 3
  });

  // อัปเดตข้อมูลในซีท
  const updateRequest = {
    spreadsheetId,
    range: `${sheetName}!A2:ZZ`,
    valueInputOption: 'RAW',
    resource: { values: updatedRowsArr1 },
  };
  await sheets.spreadsheets.values.update(updateRequest);

  //แปลงอเรย์เป็นออบเจ็ค
  const objectData = updatedRowsArr1.map(item => {
    return {
      courseID: item[0],
      courseName: item[1],
      courseDetails: item[2],
      courseStatusID: item[3],
      facultyID: item[4]
    };
  });

  res.json({
    message: 'Successfully deleted ranking',
    data: objectData
  });
});


app.get('/api/get_courseStatus', async (req, res) => {
  const sheetName = 'courseStatus';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ`, };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;  //ข้อมูลทั้งหมดในซีท
  const objectData = rowsArr.map(item => {
    return {
      courseStatusID: item[0],
      status: item[1]
    };
  });

  res.json({  //  res.json จะส่งไปยัง react ได้ครั้งเดียวถ้าส่งหลายครั้งจะเออเร่อถ้าใช้ร่วมกับ for ต้องดูดีๆ
    data: objectData
  });

});



app.put('/course/update/:courseID', async (req, res) => {
  try {
    let courseID = req.body.courseID;
    let courseName = req.body.courseName;
    let courseDetails = req.body.courseDetails;
    let courseStatusID = req.body.courseStatusID + 1; //+1 เพราะค่าที่ส่งมาคืออเรย์ที่เริ่มจาก 0 แต่ id ในซีทเริ่มจาก 1
    let facultyID = req.body.facultyID + 1;

    const updateData = [
      [courseID, courseName, courseDetails, courseStatusID, facultyID]
    ];
    // console.log(updateData)
    let numberID = parseInt(courseID);
    let rowIndex = numberID + 1;  //สมมติ courseID 21 จะอยู่แถวที่ 22 เพราะเเถวเเรกเป็นชื่อคอลัมน์
    // ทำการอัปเดตข้อมูลในซีท
    const request = {
      spreadsheetId,
      range: `course!A${rowIndex}:E${rowIndex}`, // ตัวอย่าง: อัปเดตคอลัมน์ A, B, C ในแถวที่ระบุ
      valueInputOption: 'RAW',
      resource: { values: updateData }
    };

    const response = await sheets.spreadsheets.values.update(request);
    res.json({ result: true, message: 'Data updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, message: 'Failed to update data' });
  }
});


app.post("/api/add_course", async (req, res) => {
  let courseID = req.body.courseID;
  let courseName = req.body.courseName;
  let courseDetails = req.body.courseDetails;
  let courseStatusID = req.body.courseStatusID + 1; //+1 เพราะค่าที่ส่งมาคืออเรย์ที่เริ่มจาก 0 แต่ id ในซีทเริ่มจาก 1
  let facultyID = req.body.facultyID + 1;

  // ข้อมูลที่จะเพิ่ม
  const range = 'course!A:E'; //ช่วงข้อมูลที่จะเพิ่มจะเพิ่มต่อจากแถวสุดท้าย
  const values = [
    [courseID, courseName, courseDetails, courseStatusID, facultyID]
  ];
  // สร้างคำขอสำหรับการเพิ่มข้อมูล
  const request = {
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    resource: {
      values
    },
  };
  // ส่งคำขอเพื่อเพิ่มข้อมูลลงใน Google Sheet
  sheets.spreadsheets.values.append(request, (err, response) => {
    if (err) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูล:', err);
      return;
    }
    // console.log('เพิ่มข้อมูลลงใน Google Sheet สำเร็จ');
    res.json({ success: true, message: "Data added successfully" });
  });
});

app.get('/api/get_facultyStatus', async (req, res) => {
  const sheetName = 'statusFaculty';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ`, };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;  //ข้อมูลทั้งหมดในซีท
  const objectData = rowsArr.map(item => {
    return {
      facultyStatusID: item[0],
      status: item[1]
    };
  });

  res.json({
    data: objectData
  });

});

app.post("/api/add_faculty", async (req, res) => {
  let facultyID = req.body.facultyID;
  let facultyName = req.body.facultyName;
  let facultyDetails = req.body.facultyDetails;
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;
  let image = req.body.image;
  let facultyWebsite = req.body.facultyWebsite;
  let phoneNumber = req.body.phoneNumber;
  let email = req.body.email;
  let facultyStatusID = req.body.facultyStatusID + 1;
  let keyword = req.body.keyword;


  // ข้อมูลที่จะเพิ่ม
  const range = 'faculty!A:E'; //ช่วงข้อมูลที่จะเพิ่มจะเพิ่มต่อจากแถวสุดท้าย
  const values = [
    [facultyID, facultyName, facultyDetails, latitude, longitude, image, facultyWebsite, phoneNumber, email, facultyStatusID, keyword]
  ];
  // สร้างคำขอสำหรับการเพิ่มข้อมูล
  const request = {
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    resource: {
      values
    },
  };
  // ส่งคำขอเพื่อเพิ่มข้อมูลลงใน Google Sheet
  sheets.spreadsheets.values.append(request, (err, response) => {
    if (err) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูล:', err);
      return;
    }
    // console.log('เพิ่มข้อมูลลงใน Google Sheet สำเร็จ');
    res.json({ success: true, message: "Data added successfully" });
  });

});



app.put('/api/delete_faculty', async (req, res) => {
  let facultyID = req.body.facultyID;
  const sheetName = 'faculty';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ` };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;
  const objectData1 = rowsArr.map(item => {
    return {
      facultyID: item[0],
      facultyName: item[1],
      facultyDetails: item[2],
      latitude: item[3],
      longitude: item[4],
      image: item[5],
      facultyWebsite: item[6],
      phoneNumber: item[7],
      email: item[8],
      facultyStatusID: item[9],
      keyword: item[10]
    };
  });

  // ล้างข้อมูลในเรนจ์ที่ต้องการลบ
  const clearRequest = {
    spreadsheetId,
    range: `${sheetName}!A2:ZZ`,
  };
  await sheets.spreadsheets.values.clear(clearRequest);


  const updatedRowsArr = objectData1.map(item => {
    if (item.facultyID == facultyID) {
      return null; //1. คืนค่า null ไปใน updatedRowsArr
    }
    return item; // คืนค่า item ไปยัง updatedRowsArr ถ้าไม่ต้องการลบ
  }).filter(item => item != null); //2. กรองข้อมูล null ออก

  const updatedRowsArr1 = updatedRowsArr.map(item => [
    item.facultyID,
    item.facultyName,
    item.facultyDetails,
    item.latitude,
    item.longitude,
    item.image,
    item.facultyWebsite,
    item.phoneNumber,
    item.email,
    item.facultyStatusID,
    item.keyword
  ]);



  // อัปเดตข้อมูลในซีท
  const updateRequest = {
    spreadsheetId,
    range: `${sheetName}!A2:ZZ`,
    valueInputOption: 'RAW',
    resource: { values: updatedRowsArr1 },
  };
  await sheets.spreadsheets.values.update(updateRequest);

  //แปลงอเรย์เป็นออบเจ็ค
  const objectData = updatedRowsArr.map(item => {
    return {
      facultyID: item[0],
      facultyName: item[1],
      facultyDetails: item[2],
      latitude: item[3],
      longitude: item[4],
      image: item[5],
      facultyWebsite: item[6],
      phoneNumber: item[7],
      email: item[8],
      facultyStatusID: item[9],
      keyword: item[10]
    };
  });

  res.json({
    message: 'Successfully deleted faculty',
    data: objectData
  });
});



app.put('/faculty/update/:facultyID', async (req, res) => {
  try {
    let facultyID = req.body.facultyID;
    let facultyName = req.body.facultyName;
    let facultyDetails = req.body.facultyDetails;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let image = req.body.image;
    let facultyWebsite = req.body.facultyWebsite;
    let phoneNumber = req.body.phoneNumber;
    let email = req.body.email;
    let facultyStatusID = req.body.facultyStatusID;
    let keyword = req.body.keyword;

    const updateData = [
      [facultyID, facultyName, facultyDetails, latitude, longitude, image, facultyWebsite, phoneNumber, email, facultyStatusID, keyword]
    ];

    //ดึงข้อมูล
    const getRequest = { spreadsheetId, range: `faculty!A2:ZZ` };
    const response1 = await sheets.spreadsheets.values.get(getRequest);
    var rowsArr = response1.data.values;
    const objectData1 = rowsArr.map(item => {
      return {
        facultyID: item[0],
        facultyName: item[1],
        facultyDetails: item[2],
        latitude: item[3],
        longitude: item[4],
        image: item[5],
        facultyWebsite: item[6],
        phoneNumber: item[7],
        email: item[8],
        facultyStatusID: item[9],
        keyword: item[10]
      };
    });

    let count = 0; // ใช้เก็บจำนวนครั้งที่พบ facultyID เท่ากับ 2
    for (let i = 0; i < objectData1.length; i++) {
      if (objectData1[i].facultyID === facultyID) {
        count = i + 1;
        break;
      }
    }
    let rowIndex = count + 1;  //สมมติ facultyID 21 จะอยู่แถวที่ 22 เพราะเเถวเเรกเป็นชื่อคอลัมน์

    //ทำการอัปเดตข้อมูลในซีท
    const request = {
      spreadsheetId,
      range: `faculty!A${rowIndex}:K${rowIndex}`, // ตัวอย่าง: อัปเดตคอลัมน์ A-E ในแถวที่ระบุ
      valueInputOption: 'RAW',
      resource: { values: updateData }
    };

    const response = await sheets.spreadsheets.values.update(request);
    res.json({ result: true, message: 'Data updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, message: 'Failed to update data' });
  }

});

app.get('/api/get_career', async (req, res) => {
  const sheetName = 'career';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ`, };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;  //ข้อมูลทั้งหมดในซีท

  const objectData = [];
  for (let i = 0; i < rowsArr.length; i++) {
    const item = rowsArr[i];
    const obj = {
      careerID: item[0],
      careerName: item[1],
      careerDetails: item[2],
      image: item[3]
    };
    objectData.push(obj);
  }

  res.json({  //  res.json จะส่งไปยัง react ได้ครั้งเดียวถ้าส่งหลายครั้งจะเออเร่อถ้าใช้ร่วมกับ for ต้องดูดีๆ
    data: objectData
  });

});




app.put('/api/delete_career', async (req, res) => {
  let careerID = req.body.careerID;
  const sheetName = 'career';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ` };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;
  const objectData1 = rowsArr.map(item => {
    return {
      careerID: item[0],
      careerName: item[1],
      careerDetails: item[2],
      image: item[3]
    };
  });

  // ล้างข้อมูลในเรนจ์ที่ต้องการลบ
  const clearRequest = {
    spreadsheetId,
    range: `${sheetName}!A2:ZZ`,
  };
  await sheets.spreadsheets.values.clear(clearRequest);


  const updatedRowsArr = objectData1.map(item => {
    if (item.careerID == careerID) {
      return null; //1. คืนค่า null ไปใน updatedRowsArr
    }
    return item; // คืนค่า item ไปยัง updatedRowsArr ถ้าไม่ต้องการลบ
  }).filter(item => item != null); //2. กรองข้อมูล null ออก

  const updatedRowsArr1 = updatedRowsArr.map(item => [ //แปลงออบเจคเป็นอเรย์
    item.careerID,
    item.careerName,
    item.careerDetails,
    item.image
  ]);

  // อัปเดตข้อมูลในซีท
  const updateRequest = {
    spreadsheetId,
    range: `${sheetName}!A2:ZZ`,
    valueInputOption: 'RAW',
    resource: { values: updatedRowsArr1 },
  };
  await sheets.spreadsheets.values.update(updateRequest);

  //แปลงอเรย์เป็นออบเจ็ค
  const objectData = updatedRowsArr.map(item => {
    return {
      careerID: item[0],
      careerName: item[1],
      careerDetails: item[2],
      image: item[3]
    };
  });

  res.json({
    message: 'Successfully deleted career',
    data: objectData
  });
});


app.post("/api/add_career", async (req, res) => {
  let careerID = req.body.careerID;
  let careerName = req.body.careerName;
  let careerDetails = req.body.careerDetails;
  let image = req.body.image;



  // ข้อมูลที่จะเพิ่ม
  const range = 'career!A:D'; //ช่วงข้อมูลที่จะเพิ่มจะเพิ่มต่อจากแถวสุดท้าย
  const values = [
    [careerID, careerName, careerDetails, image]
  ];
  // สร้างคำขอสำหรับการเพิ่มข้อมูล
  const request = {
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    resource: {
      values
    },
  };
  // ส่งคำขอเพื่อเพิ่มข้อมูลลงใน Google Sheet
  sheets.spreadsheets.values.append(request, (err, response) => {
    if (err) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูล:', err);
      return;
    }
    // console.log('เพิ่มข้อมูลลงใน Google Sheet สำเร็จ');
    res.json({ success: true, message: "Data added successfully" });
  });

});



app.put('/career/update/:careerID', async (req, res) => {
  try {
    let careerID = req.body.careerID;
    let careerName = req.body.careerName;
    let careerDetails = req.body.careerDetails;
    let image = req.body.image;
    let rowIndex = req.params.careerID;

    const updateData = [
      [careerID, careerName, careerDetails, image]
    ];

    //ทำการอัปเดตข้อมูลในซีท
    const request = {
      spreadsheetId,
      range: `career!A${rowIndex}:D${rowIndex}`, // ตัวอย่าง อัปเดตคอลัมน์ A-E ในแถวที่ระบุ
      valueInputOption: 'RAW',
      resource: { values: updateData }
    };

    const response = await sheets.spreadsheets.values.update(request);
    res.json({ result: true, message: 'Data updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, message: 'Failed to update data' });
  }

});




app.get('/api/get_aptitude_career', async (req, res) => {
  const sheetName = 'aptitude_career';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ`, };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;  //ข้อมูลทั้งหมดในซีท

  const objectData = [];
  for (let i = 0; i < rowsArr.length; i++) {
    const item = rowsArr[i];
    const obj = {
      aptitude_careerID: item[0],
      aptitudeID: item[1],
      careerID: item[2]
    };
    objectData.push(obj);
  }

  res.json({  //  res.json จะส่งไปยัง react ได้ครั้งเดียวถ้าส่งหลายครั้งจะเออเร่อถ้าใช้ร่วมกับ for ต้องดูดีๆ
    data: objectData
  });

});



app.put('/api/delete_aptitude_career', async (req, res) => {
  let aptitude_careerID = req.body.aptitude_careerID;
  const sheetName = 'aptitude_career';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ` };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;
  const objectData1 = rowsArr.map(item => {
    return {
      aptitude_careerID: item[0],
      aptitudeID: item[1],
      careerID: item[2]
    };
  });

  // ล้างข้อมูลในเรนจ์ที่ต้องการลบ
  const clearRequest = {
    spreadsheetId,
    range: `${sheetName}!A2:ZZ`,
  };
  await sheets.spreadsheets.values.clear(clearRequest);


  const updatedRowsArr = objectData1.map(item => {
    if (item.aptitude_careerID == aptitude_careerID) {
      return null; //1. คืนค่า null ไปใน updatedRowsArr
    }
    return item; // คืนค่า item ไปยัง updatedRowsArr ถ้าไม่ต้องการลบ
  }).filter(item => item != null); //2. กรองข้อมูล null ออก

  const updatedRowsArr1 = updatedRowsArr.map(item => [ //แปลงออบเจคเป็นอเรย์
    item.aptitude_careerID,
    item.aptitudeID,
    item.careerID
  ]);

  // อัปเดตข้อมูลในซีท
  const updateRequest = {
    spreadsheetId,
    range: `${sheetName}!A2:ZZ`,
    valueInputOption: 'RAW',
    resource: { values: updatedRowsArr1 },
  };
  await sheets.spreadsheets.values.update(updateRequest);

  //แปลงอเรย์เป็นออบเจ็ค
  const objectData = updatedRowsArr.map(item => {
    return {
      aptitude_careerID: item[0],
      aptitudeID: item[1],
      careerID: item[2]
    };
  });

  res.json({
    message: 'Successfully deleted career',
    data: objectData
  });
});




app.post("/api/add_aptitude_career", async (req, res) => {
  let aptitude_careerID = req.body.aptitude_careerID;
  let aptitudeID = req.body.aptitudeID;
  let careerID = req.body.careerID;   //[1,2,3,4,...]
  const requests = [];


  var count = req.body.careerID;   //[1,2,3,4,...]

  for (let i = 0; i < count.length; i++) {
    let aptitude_careerID = req.body.aptitude_careerID + i;
    let aptitudeID = req.body.aptitudeID;
    let careerID = req.body.careerID[i];   //[1,2,3,4,...]

    const range = `aptitude_career!A:C`;
    const values = [[aptitude_careerID, aptitudeID, careerID]];

    const request = {
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: {
        values
      },
    };

    requests.push(request);
  }


  for (let i = 0; i < requests.length; i++) {
    try {
      await sheets.spreadsheets.values.append(requests[i]);
    } catch (err) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูล:', err);
      res.status(500).json({ success: false, message: "Failed to add data" });
      return;
    }
  }

  res.json({ success: true, message: "Data added successfully" });
});



app.put('/aptitude_career/update/:rowUpdate', async (req, res) => {
  try {
    let rowUpdate = req.params.rowUpdate;
    let aptitude_careerID = req.body.aptitude_careerID;
    let aptitudeID = req.body.aptitudeID;
    let careerID = req.body.careerID.value;


    const updateData = [
      [aptitude_careerID, aptitudeID, careerID]
    ];

    //ทำการอัปเดตข้อมูลในซีท
    const request = {
      spreadsheetId,
      range: `aptitude_career!A${rowUpdate}:C${rowUpdate}`, // ตัวอย่าง อัปเดตคอลัมน์ A-C ในแถวที่ระบุ
      valueInputOption: 'RAW',
      resource: { values: updateData }
    };

    const response = await sheets.spreadsheets.values.update(request);
    res.json({ result: true, message: 'Data updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, message: 'Failed to update data' });
  }

});





app.get('/api/get_career_course', async (req, res) => {
  const sheetName = 'career_course';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ`, };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;  //ข้อมูลทั้งหมดในซีท

  const objectData = [];
  for (let i = 0; i < rowsArr.length; i++) {
    const item = rowsArr[i];
    const obj = {
      career_courseID: item[0],
      careerID: item[1],
      courseID: item[2]
    };
    objectData.push(obj);
  }

  res.json({  //  res.json จะส่งไปยัง react ได้ครั้งเดียวถ้าส่งหลายครั้งจะเออเร่อถ้าใช้ร่วมกับ for ต้องดูดีๆ
    data: objectData
  });

});



app.put('/api/delete_career_course', async (req, res) => {
  let career_courseID = req.body.career_courseID;
  const sheetName = 'career_course';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ` };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;

  const objectData1 = rowsArr.map(item => {
    return {
      career_courseID: item[0],
      careerID: item[1],
      courseID: item[2]
    };
  });

  // ล้างข้อมูลในเรนจ์ที่ต้องการลบ
  const clearRequest = {
    spreadsheetId,
    range: `${sheetName}!A2:ZZ`,
  };
  await sheets.spreadsheets.values.clear(clearRequest);


  const updatedRowsArr = objectData1.map(item => {
    if (item.career_courseID == career_courseID) {
      return null; //1. คืนค่า null ไปใน updatedRowsArr
    }
    return item; // คืนค่า item ไปยัง updatedRowsArr ถ้าไม่ต้องการลบ
  }).filter(item => item != null); //2. กรองข้อมูล null ออก

  const updatedRowsArr1 = updatedRowsArr.map(item => [ //แปลงออบเจคเป็นอเรย์
    item.career_courseID,
    item.careerID,
    item.courseID
  ]);

  // อัปเดตข้อมูลในซีท
  const updateRequest = {
    spreadsheetId,
    range: `${sheetName}!A2:ZZ`,
    valueInputOption: 'RAW',
    resource: { values: updatedRowsArr1 },
  };
  await sheets.spreadsheets.values.update(updateRequest);

  //แปลงอเรย์เป็นออบเจ็ค
  const objectData = updatedRowsArr.map(item => {
    return {
      career_courseID: item[0],
      careerID: item[1],
      courseID: item[2]
    };
  });

  res.json({
    message: 'Successfully deleted career',
    data: objectData
  });
});







app.post("/api/add_career_course", async (req, res) => {
  let courseID = req.body.courseID;   //[1,2,3,4,...]
  const requests = [];


  for (let i = 0; i < courseID.length; i++) {
    let career_courseID = req.body.career_courseID + i;
    let careerID = req.body.careerID;
    let courseID = req.body.courseID[i];   //[1,2,3,4,...]


    const range = `career_course!A:C`;
    const values = [[career_courseID, careerID, courseID]];


    const request = {
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: {
        values
      },
    };

    requests.push(request);
  }




  for (let i = 0; i < requests.length; i++) {
    try {
      await sheets.spreadsheets.values.append(requests[i]);
    } catch (err) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูล:', err);
      res.status(500).json({ success: false, message: "Failed to add data" });
      return;
    }
  }

  res.json({ success: true, message: "Data added successfully" });
});



app.put('/career_course/update/:rowUpdate', async (req, res) => {
  try {
    let rowUpdate = req.params.rowUpdate;
    let career_courseID = req.body.career_courseID;
    let careerID = req.body.careerID.value;
    let courseID = req.body.courseID.value;


    const updateData = [
      [career_courseID, careerID, courseID]
    ];

    //ทำการอัปเดตข้อมูลในซีท
    const request = {
      spreadsheetId,
      range: `career_course!A${rowUpdate}:C${rowUpdate}`, // ตัวอย่าง อัปเดตคอลัมน์ A-C ในแถวที่ระบุ
      valueInputOption: 'RAW',
      resource: { values: updateData }
    };

    const response = await sheets.spreadsheets.values.update(request);
    res.json({ result: true, message: 'Data updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, message: 'Failed to update data' });
  }

});


app.put('/register', async (req, res) => {
  let roleID = "2"
  try {
    const { userID, fullname, username, password } = req.body;

    const data = [
      [userID, '', username, password, fullname, '', roleID]
    ];
    console.log(data)

    // ทำการเพิ่ม
    const request = {
      spreadsheetId,
      range: `users!A:G`, // ตัวอย่าง: อัปเดตคอลัมน์ A, B, C ในแถวที่ระบุ
      valueInputOption: 'RAW',
      resource: { values: data }
    };

    const response = await sheets.spreadsheets.values.append(request);
    res.json({ result: true, message: 'Data add successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to add data' });
  }

});






app.get('/api/get_history', async (req, res) => {
  const sheetName = 'assessment_history';
  const request = { spreadsheetId, range: `${sheetName}!A2:ZZ`, };
  const response = await sheets.spreadsheets.values.get(request);
  var rowsArr = response.data.values;  //ข้อมูลทั้งหมดในซีท

  const objectData = rowsArr.map(item => {
    return {
      historyID: item[0],
      date: item[1],
      time: item[2],
      dataAptitudeScore: item[3],
      toolAptitudeScore: item[4],
      personAptitudeScore: item[5],
      userID: item[6],
      aptitudeID: item[7]
    };
  });


  res.json({  //  res.json จะส่งไปยัง react ได้ครั้งเดียวถ้าส่งหลายครั้งจะเออเร่อถ้าใช้ร่วมกับ for ต้องดูดีๆ
    result: true,
    data: objectData
  });
});



app.put('/add/history', async (req, res) => {

  try {
    const { historyID, date, time, dataAptitudeScore, toolAptitudeScore, personAptitudeScore, userID, aptitudeID } = req.body.data;

    const data = [
      [historyID, date, time, dataAptitudeScore, toolAptitudeScore, personAptitudeScore, userID, aptitudeID]
    ];


 
    // ทำการเพิ่ม
    const request = {
      spreadsheetId,
      range: `assessment_history!A:H`, // ตัวอย่าง: อัปเดตคอลัมน์ A, B, C ในแถวที่ระบุ
      valueInputOption: 'RAW',
      resource: { values: data }
    };

    const response = await sheets.spreadsheets.values.append(request);
    res.json({ result: true, message: 'Data add successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to add data' });
  }

});



app.put('/update_aptitude_user', async (req, res) => {
  try {
    let rowUpdate = req.body.data.userID;
    let userID = req.body.data.userID;
    let aptitudeID = req.body.data.aptitudeID;

    let rowUpdate1 = parseInt(rowUpdate, 10); // แปลงเป็นตัวเลขโดยระบุฐาน 10
    rowUpdate1 += 1; // เพิ่มค่าขึ้น 1
    const updateData = [
      [rowUpdate1, userID, aptitudeID]
    ];


   
    // //ทำการอัปเดตข้อมูลในซีท
    const request = {
      spreadsheetId,
      range: `users!H${rowUpdate1}`, // อัปเดตคอลัมน์ H ในแถวที่ระบุ
      valueInputOption: 'RAW',
      resource: { values: [[aptitudeID]] } // newValue คือค่าใหม่ที่คุณต้องการใส่ในคอลัมน์ H
    };

    //ทำการอัปเดตข้อมูลในซีท
    const response = await sheets.spreadsheets.values.update(request);
    res.json({ result: true, message: 'Data updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, message: 'Failed to update data' });
  }

});




































app.listen(port, () => {
  console.log(`Server runing on port ${port}`);  // `` = alt+6+9 กดพร้อมกัน

});







