import React, { useState, useEffect } from 'react';
import './App.css';
import { Snippet, SnippetList } from './components/SnippetList';
import axios from 'axios'
import { SnippetItem } from './components/SnippetItem';
import { MiniSnippetItem } from './components/MiniSnippet'

interface Instructor {
  name: string;
}

interface Section {
  instructors: Instructor[];
}

function App() {
  const [courseInput, setCourseInput] = useState('');
  const [courseResult, setCourseResult] = useState({
    title: '',
    description: 'No Course Selected',
    prerequisites: '',
    course_quality: 0,
    instructor_quality: 0,
    difficulty: 0,
    work_required: 0,
    credits: 0,
    instructors: [] as string[]
  });

  const rootURL = 'https://penncoursereview.com/api/base/current/courses';

  // asynchronously calls the penn course review API with the input course
  const fetchCourse = async () => {
    try {
      const response = await axios.get(`${rootURL}/${courseInput}`);
      const data = response.data;

      // Parse instructor names from sections
      const instructors = data.sections.flatMap((section: Section) => 
        section.instructors.map((instructor: Instructor) => instructor.name)
      );

      // Check if description contains "<b>" or "<p>" and remove that and all text after it
      let description = data.description;
      if (description.includes('<b>')) {
        description = description.split('<b>')[0];
      }
      if (description.includes('<p>')) {
        description = description.split('<p>')[0];
      }

      setCourseResult({
        title: data.title,
        description: description,
        prerequisites: data.prerequisites,
        course_quality: data.course_quality,
        instructor_quality: data.instructor_quality,
        difficulty: data.difficulty,
        work_required: data.work_required,
        credits: data.credits,
        instructors: instructors // Set the parsed instructor names
      });
      console.log(response);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };

  // whenever the inputcourse changes, it calls fetchCourse 
  useEffect(() => {
    chrome.storage.local.get('inputcourse', (result) => {
      if (result === undefined) {
        setCourseResult({
          title: '',
          description: 'No Course Selected',
          prerequisites: '',
          course_quality: 0,
          instructor_quality: 0,
          difficulty: 0,
          work_required: 0,
          credits: 0,
          instructors: [] as string[]
        });
      } else {
        setCourseInput(result.inputcourse);
      }
    });
    fetchCourse();
  }, [courseInput]);

  return (
    <div className="App">
      <h1>Penn Course Review Extension</h1>
      <MiniSnippetItem text={courseResult.title} />
      <MiniSnippetItem text={courseResult.description} />
      <MiniSnippetItem text={courseResult.prerequisites} />
      <MiniSnippetItem text={`Course Quality: ${courseResult.course_quality}`} />
      <MiniSnippetItem text={`Instructor Quality: ${courseResult.instructor_quality}`} />
      <MiniSnippetItem text={`Difficulty: ${courseResult.difficulty}`} />
      <MiniSnippetItem text={`Work Required: ${courseResult.work_required}`} />
      <MiniSnippetItem text={`Credits: ${courseResult.credits}`} />
      {courseResult.instructors.map((instructor, index) => (
        <MiniSnippetItem key={index} text={instructor} />
      ))}
    </div>
  );
}

export default App;