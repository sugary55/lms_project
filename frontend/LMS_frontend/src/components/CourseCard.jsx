import React from 'react';
import {Link} from 'react-router-dom';

const CourseCard = ({course}) =>{
  return(
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="h-48 bg-blue-50 flex items-center justify-center">
        {/*placeholder for course image*/}
        <span className="text-blue-300 font-bold text-4xl group-hover:scale-110 transition-transform">
          {course.course_ID}
        </span>
      </div>
      <div className='p-5'>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
          <div className="flex justify-between items-center mt-4">
            <span className="text-2xl font-black text-blue-600">${course.price}</span>
            <Link to={`/course/${course.course_ID}`}>
            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
            View Details
          </button>
          </Link>
          </div>
      </div>
    </div>
  )
};

export default CourseCard;