
import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { Course } from '../types';

const CourseCard: React.FC<{ course: Course, onSelectCourse: (id: number) => void }> = ({ course, onSelectCourse }) => {
  const { t } = useLocalization();
  return (
    <div 
      onClick={() => onSelectCourse(course.id)}
      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col justify-between cursor-pointer"
    >
      <div>
        <div className="flex items-center space-x-4 mb-4">
            <div className="bg-emerald-100 text-emerald-600 rounded-xl p-4">
                <i className={`${course.icon} fa-2x`}></i>
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-500">{course.instructor}</p>
            </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">{t('course_duration')}: <span className="font-semibold">{course.duration}</span></p>
      </div>
      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{t('course_progress')}</span>
          <span>{course.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

interface CoursesProps {
  onSelectCourse: (id: number) => void;
  courses: Course[];
}

const Courses: React.FC<CoursesProps> = ({ courses, onSelectCourse }) => {
  const { t } = useLocalization();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">{t('courses')}</h1>
      <p className="mt-1 text-gray-600">{t('view_all_courses')}</p>

      {courses.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} onSelectCourse={onSelectCourse} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white mt-8 rounded-lg shadow-md">
            <i className="fas fa-book-reader fa-4x text-gray-400"></i>
            <h3 className="mt-6 text-xl font-semibold text-gray-800">{t('no_courses_found')}</h3>
            <p className="mt-2 text-gray-500">{t('no_courses_found')}</p>
        </div>
      )}
    </div>
  );
};

export default Courses;
