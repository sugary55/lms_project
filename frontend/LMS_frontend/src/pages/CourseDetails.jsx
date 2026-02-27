import React ,{useEffect,useState} from 'react';
import {useParams , useNavigate} from 'react-router-dom';
import axios from "axios";

const CourseDetails = ({user}) => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [course, setCourse]= useState(null);
  const [loading, setLoading]= useState(true);
  const [expandedSections, setExpandedSections]= useState({});
  const [isEnrolled,setIsEnrolled]=useState(false);
  const [checkingEnrollment,setCheckingEnrollment]=useState(true);

  useEffect(()=>{
    const fetchCourse = async()=>{
      try{
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/course/${id}`);
         
        const data = await response.json();
        setCourse(data);
      }catch(error){
        console.error('Error fetching course:',error);
      }finally{
        setLoading(false);
      }
    };
    fetchCourse();
  },[id]);

useEffect(()=>{
  const checkEnrollment = async()=>{
    if(!user || !course){setCheckingEnrollment(false); return;}
    try{
      // You'll need an API endpoint to check enrollment
        // For now, we'll use a simple approach - fetch user's enrolled courses
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/${user.id}/enrolled-courses`);

      if(response.data && Array.isArray(response.data)){
        const enrolledCoursesIds = response.data.map(c => c._id);
      setIsEnrolled(enrolledCoursesIds.includes(course._id));
      }
     
    }catch(error){
      console.error('Error checking enrollment ',error);
    }finally{
      setCheckingEnrollment(false);
    }
  };
  checkEnrollment();
},[user,course]);

  const toggleSection = (index)=>{
    setExpandedSections(prev=>({
      ...prev,
      [index]: !prev[index]
    }));
  };
  if(loading) return <div className="text-center mt-20">loading... </div>;
  if(!course)return <div className="text-center mt-20">course not found</div>;

  const handleEnroll = async()=>{
    if(!user){alert("please log in for enrollment");return;}  
    setLoading(true);
    try{
       await axios.post(`${import.meta.env.VITE_API_URL}/api/user/enroll`,
        {userId: user.id , courseId:course._id}
      );
      setIsEnrolled(true);
      alert(`enrolled successfully`);
    }catch(error){
      alert(error.response?.data?.message || "erollment failed");
    }finally{setLoading(false);}
  };

  return(
    <div className="max-w-4xl mx-auto px-6 py-12 text-left">
        <button onClick={()=>navigate('/')} className="flex items-center gap-2 text-blue-600 font-semibold mb-6 hover:text-blue-800 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        back
        </button>

       {/* Course Header */}
       <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
<span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {course.course_ID}
          </span>
          <span className="text-2xl font-bold text-blue-600">${course.price}</span>
        </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
           <p className="text-gray-600 text-lg">
          {course.description || "No description available."}
        </p>
       </div>


       {/* Enroll Button */}
       <div className="mb-12">
        {checkingEnrollment ?(
            <div className="text-gray-500 animate-pulse">Checking status...</div>
        ): isEnrolled ? (
          <div className="w-full md:w-auto bg-green-100 text-green-700 px-8 py-4 rounded-xl text-lg font-semibold text-center border-2 border-green-200">
                ✓ You're enrolled in this course
          </div>
        ):(
          <button onClick={handleEnroll}
           disabled={loading} 
           className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow-lg disabled:bg-gray-400">
            {loading ? "Processing..." : `Enroll Now - $${course.price}`}
          </button>
          
        )}</div>



       {/* Course Content */}
       <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>

          {course.sections?.map((section,idx)=>(
            <div key={idx} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                  {/* Section Header */}
                  <button
              onClick={() => toggleSection(idx)}
              className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition"
            >
              <span className="font-semibold text-gray-800">{section.title}</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${expandedSections[idx] ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/*lessons - fixed: now properly maps through lesson */}
            {expandedSections[idx] && (
              <div className="divide-y divide-gray-100">
                {section.lessons?.map((lesson,lessonIdx)=>(
                  <div  key={lessonIdx} className='p-4 flex items-center justify-between hover:bg-gray-50'>
                    <div className="flex items-center gap-3">
                      {lesson.isLocked ?(
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                       ):(
                         <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                       )}
                        <span className="text-gray-700">{lesson.lessonTitle}</span>
                    </div>
                    <span className="text-sm text-gray-500 capitalize">{lesson.contentType}
                    </span>
                  </div>
                ))}
                </div>
            )}  
              </div>
            ))}
            </div>
       </div>

  );
};


export default CourseDetails