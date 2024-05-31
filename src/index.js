import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import{BrowserRouter,Routes,Route,} from "react-router-dom";
import Login from './Login';
import MenuHomePage from './MenuHomePage';
import RankingGraph from './RankingGraph';
import Profile from './Profile';
import EditProfile from './EditProfile';
import MenuAssessment from './MenuAssessment';
import MenuAptitude from './MenuAptitude';
import MenuRanking from './MenuRanking';
import MenuRankingDetails from './MenuRankingDetails';
import MenuRankingYearsAdd from './MenuRankingYearAdd';
import MenuRankingEdit from './MenuRankingEdit';
import MenuCourse from './MenuCourse';
import MenuCourseDetails from './MenuCourseDetails';
import MenuCourseAddEdit from './MenuCourseAddEdit';
import MenuFaculty from './MenuFaculty';
import MenuFacultyDetails from './MenuFacultyDetails';
import MenuFacultyAddEdit from './MenuFacultyAddEdit';
import MenuCareer from './MenuCareer';
import MenuCareerAddEdit from './MenuCareerAddEdit';
import MenuAptitudeCareer from './MenuAptitudeCareer';
import MenuAptitudeCareerAddEdit from './MenuAptitudeCareerAddEdit';
import MenuCareerCourse from './MenuCareerCourse';
import MenuCareerCourseAddEdit from './MenuCareerCourseAddEdit';
import MenuAssessmenAddEdit from './MenuAssessmentAddEdit';
import MenuAptitudeAddEdit from './MenuAptitudeAddEdit';
import UserAssessment from './UserAssesssment';
import SignUp from './SignUp';
import UserHistory from './UserHistory';
import UserHistoryDetails from './UserHistoryDetails';


// import Test from './Test'; 


ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/home" element={<MenuHomePage/>} />
      <Route path="/get_graphyears/:yearValue" element={<RankingGraph/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/edit_profile/:userID" element={<EditProfile/>} />
      <Route path="/assessment" element={<MenuAssessment/>} />
      <Route path="/assessment/add" element={<MenuAssessmenAddEdit data="add"/>} />
      <Route path="/assessment/update/:assessmentID" element={<MenuAssessmenAddEdit data="update"/>} />
      <Route path="/aptitude" element={<MenuAptitude/>} />
      <Route path="/aptitude/add" element={<MenuAptitudeAddEdit data="add"/>} />
      <Route path="/aptitude/update/:aptitudeID" element={<MenuAptitudeAddEdit data="update"/>} />
      <Route path="/ranking" element={<MenuRanking/>} />
      <Route path="/ranking/years/add" element={<MenuRankingYearsAdd/>} />
      <Route path="/rankingDetails/:years" element={<MenuRankingDetails/>} />
      <Route path="/ranking/update/:years/:careerRankingID" element={<MenuRankingEdit/>} />
      <Route path="/course" element={<MenuCourse/>} />
      <Route path="/CourseDetails/:facultyID" element={<MenuCourseDetails/>} />
      <Route path="/course/add/:facultyID" element={<MenuCourseAddEdit data="add"/>} />
      <Route path="/course/update/:courseID" element={<MenuCourseAddEdit  data="update"/>} />
      <Route path="/faculty" element={<MenuFaculty/>} />
      <Route path="/facultyDetails/:facultyID" element={<MenuFacultyDetails/>} />
      <Route path="/faculty/add" element={<MenuFacultyAddEdit data="add"/>} />
      <Route path="/faculty/update/:facultyID" element={<MenuFacultyAddEdit data="update"/>} />
      <Route path="/career" element={<MenuCareer/>} />
      <Route path="/career/add" element={<MenuCareerAddEdit data="add"/>} />
      <Route path="/career/update/:careerID" element={<MenuCareerAddEdit data="update"/>} />
      <Route path="/match_aptitude_career" element={<MenuAptitudeCareer/>} />
      <Route path="/match_aptitude_career/add" element={<MenuAptitudeCareerAddEdit  data="add"/>} />
      <Route path="/match_aptitude_career/:aptitude_careerID/:aptitudeID/:careerID/:careerName" element={<MenuAptitudeCareerAddEdit  data="update"/>} />
      <Route path="/match_career_course" element={<MenuCareerCourse/>} />
      <Route path="/match_career_course/add" element={<MenuCareerCourseAddEdit  data="add"/>} />
      <Route path="/match_career_course/:career_courseID/:careerID/:courseID/:courseName/:careerName" element={<MenuCareerCourseAddEdit  data="update"/>} />
      <Route path="/user/assessment/:userID" element={<UserAssessment/>} />
      <Route path="/user/history/:userID" element={<UserHistory/>} />
      <Route path="/user/historydetails/:historyID/:maxScore/:aptitudeID/:aptitudeName/:userID" element={<UserHistoryDetails/>} />

      {/* <Route path="/Test" element={<Test/>} /> */}

  
    </Routes>
  </BrowserRouter>,
 document.getElementById('root')
);


