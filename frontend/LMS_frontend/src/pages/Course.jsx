import React,{useEffect,useState} from "react";
import CourseCard from "../components/CourseCard";

const Courses = () =>{
  const [courses,setCourses]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const fetchCourses = async ()=>{
      try{
        const response = await fetch("http://localhost:8000/api/course");
        const data = await response.json();
        setCourses(data);
        setLoading(false);
      }catch(error){
        console.error("Error fetching courses",error);
        setLoading(false);
      }
    };
    fetchCourses();
  },[]);
  if(loading)return <div className="text-center mt-20 font-medium">loading courses...</div>;
  return(
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Available Courses</h1>
      {courses.length === 0?(
        <div className="bg-blue-50 p-10 rounded-2xl text-center">
          <p className="text-blue-600 font-medium">No courses found. Time to add some in Postman!</p>
        </div>
      ):(
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(courses || []).map((Course => (
            <CourseCard key={Course._id} course={Course} />
      )))}
    </div>
  )}
  </div>
  );
};


export default Courses;