import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios'
import { MiniSnippetItem } from './components/MiniSnippet'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  LabelList,
} from "recharts";

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

  // Format data for recharts
  const data = [
    { name: "Course Quality", value: courseResult.course_quality },
    { name: "Instructor Quality", value: courseResult.instructor_quality },
    { name: "Difficulty", value: courseResult.difficulty },
    { name: "Work Required", value: courseResult.work_required },
  ];

  // Color function for recharts
  const getColor = (index, value) => {
    if (index <= 1) {
      if (value <= 2.5) return "#d00000";
      if (value <= 3) return "#ffd60a";
      return "#a3b18a";
    }

    if (index >= 2) {
      if (value <= 2.5) return "#a3b18a";
      if (value <= 3) return "#ffd60a";
      return "#d00000";
    }
  };

  return (
    <div className="App">
      <h1>Penn Course Search</h1>
      <MiniSnippetItem text={courseResult.title} />
      <BarChart
        width={350}
        height={150}
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
      >
        <XAxis type="number" hide={true} />
        <YAxis
          dataKey="name"
          type="category"
          axisLine={false}
          tickLine={false}
        />
        <Bar
          dataKey="value"
          fill="#8884d8"
          barSize={20}
          radius={[10, 10, 10, 10]}
        >
          <LabelList
            dataKey="value"
            position="right"
            style={{ fill: "#000", fontSize: 14 }}
          />
          {data.map((entry, index) => (
            <Cell key={`${index}`} fill={getColor(index, entry.value)} />
          ))}
        </Bar>
      </BarChart>
      <MiniSnippetItem text={courseResult.description} />
      <MiniSnippetItem text={courseResult.prerequisites} />
      <MiniSnippetItem text={`Credits: ${courseResult.credits}`} />
      {courseResult.instructors.map((instructor, index) => (
        <MiniSnippetItem key={index} text={instructor} />
      ))}
    </div>
  );
}

export default App;