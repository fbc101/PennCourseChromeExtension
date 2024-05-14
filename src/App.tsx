import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios'
import { MiniSnippetItem } from './components/MiniSnippet'
import { MiniSnippetTitle1 } from './components/MiniSnippet'
import { MiniSnippetTitle2 } from './components/MiniSnippet'
import { MiniSnippetText } from './components/MiniSnippet'
import { AutoComplete, Input, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { SearchProps } from 'antd/es/input/Search';
import pennCourseSearchImage from '/public/images/pennCourseSearch.png';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  LabelList,
} from "recharts";
import { render } from 'react-dom';

interface Instructor {
  name: string;
}

interface Section {
  instructors: Instructor[];
}

function App() {
  const [courseInput, setCourseInput] = useState('');
  const [courseResult, setCourseResult] = useState({
    id: '',
    title: '',
    description: 'No Course Found',
    prerequisites: '',
    course_quality: 0,
    instructor_quality: 0,
    difficulty: 0,
    work_required: 0,
    credits: 0,
    instructors: [] as string[]
  });

  // Get the initial search history from storage
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  useEffect(() => {
    chrome.storage.local.get(['searchHistory'], (result) => {
      if (result.searchHistory) {
        setSearchHistory(result.searchHistory);
      }
    });
  }, []);

  const clearSearchHistory = () => {
    chrome.storage.local.remove('searchHistory', () => {
      console.log('Search history cleared');
    });
    setSearchHistory([]);
  };

  const { Search } = Input;
  
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 300; // desired maximum length

  const rootURL = 'https://penncoursereview.com/api/base/current/courses';
  const altURL =  'https://penncoursereview.com/api/base/2024A/courses';

  const getData = async (url: string, course: string) => {
    const response = await axios.get(`${url}/${course}`);
    return response.data;
  }

  const parseData = async (data, changed: boolean) => {
    // Parse instructor names from sections
      let instructors = data.sections.flatMap((section: Section) => 
        section.instructors.map((instructor: Instructor) => instructor.name)
      );
      instructors = instructors.filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index);

      // Check if description contains "<b>" or "<p>" and remove that and all text after it
      let description = data.description;
      if (description.includes('<b>')) {
        description = description.split('<b>')[0];
      }
      if (description.includes('<p>')) {
        description = description.split('<p>')[0];
      }

      // If course was fetched from previous semester prepend warning to description
      if (changed) {
        description = ' This course is not available in the current semester. ' + description;
      }

      setCourseResult({
        id: data.id,
        title: data.title,
        description: description,
        prerequisites: data.prerequisites,
        course_quality: data.course_quality !== null ? data.course_quality : 0,
        instructor_quality: data.instructor_quality !== null ? data.instructor_quality : 0,
        difficulty: data.difficulty !== null ? data.difficulty : 0,
        work_required: data.work_required !== null ? data.work_required : 0,
        credits: data.credits,
        instructors: instructors // Set the parsed instructor names
      });
      console.log(Response);
  }

  // asynchronously calls the penn course review API with the input course
  const fetchCourse = async () => {
    try {
      let data = await getData(rootURL, courseInput);
      parseData(data, false);

      // Update the search history
      // const newSearchHistory = [courseInput, ...searchHistory];
      const newSearchHistory = [courseInput, ...searchHistory.filter(item => item !== courseInput)];
      setSearchHistory(newSearchHistory);
      chrome.storage.local.set({ searchHistory: newSearchHistory });
    } catch (error) {
      try {
        let data = await getData(altURL, courseInput);
        parseData(data, true);

      // Update the search history
      // const newSearchHistory = [courseInput, ...searchHistory];
      const newSearchHistory = [courseInput, ...searchHistory.filter(item => item !== courseInput)];
      setSearchHistory(newSearchHistory);
      chrome.storage.local.set({ searchHistory: newSearchHistory });
      } catch (error) {
        setCourseResult({
          id: courseInput,
          title: '',
          description: 'No Course Found',
          prerequisites: '',
          course_quality: 0,
          instructor_quality: 0,
          difficulty: 0,
          work_required: 0,
          credits: 0,
          instructors: [] as string[]
        });
        console.error('Error fetching data, course was not found in previous semester:', error);
      }
    }
  };

  // whenever the inputcourse changes, it calls fetchCourse 
  useEffect(() => {
    chrome.storage.local.get('inputcourse', (result) => {
      if (result === undefined) {
        setCourseResult({
          id: courseInput,
          title: '',
          description: 'No Course Found',
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
    { name: "Course Quality", value: parseFloat(courseResult.course_quality.toFixed(1)) },
    { name: "Instructor Quality", value: parseFloat(courseResult.instructor_quality.toFixed(1)) },
    { name: "Difficulty", value: parseFloat(courseResult.difficulty.toFixed(1)) },
    { name: "Work Required", value: parseFloat(courseResult.work_required.toFixed(1)) },
  ];

  // Color function for recharts
  const getColor = (index: number, value: number) => {
    let red, green;
    const maxColorValue = 240; // Lower this value to make the colors darker

    if (index <= 1) {
      if (value <= 2) {
        red = maxColorValue;
        green = Math.round(maxColorValue * value / 2);
      } else {
        red = Math.round(maxColorValue * (4 - value) / 2);
        green = maxColorValue;
      }
    } else {
      if (value <= 2) {
        green = maxColorValue;
        red = Math.round(maxColorValue * value / 2);
      } else {
        green = Math.round(maxColorValue * (4 - value) / 2);
        red = maxColorValue;
      }
    }
    return `rgb(${red}, ${green}, 0)`;
  }

const findCourse = async (input: string) => {
    let selectedText = input;

    // Define a regular expression to match any non-word characters (symbols)
    const regex = /[^\w\s]/g;
  
    // Replace all occurrences of symbols with a space
    const noSymbolStringTrimmed = selectedText.replace(regex, ' ').trim().toLocaleUpperCase();
    const codeAndNumber = noSymbolStringTrimmed.split(/ /); // splits by space
    // Check if the number part has 3 digits, and if so, append a '0'
    if (codeAndNumber[1].length === 3) {
      codeAndNumber[1] += '0';
    } 
    
    const cleanedInputCourse = codeAndNumber[0] + '-' + codeAndNumber[1]; // Code-Number e.g CIS-1200
    setCourseInput(cleanedInputCourse);
    const newinput = {
      inputcourse : cleanedInputCourse
    };
  chrome.storage.local.set(newinput, () => {
    console.log('Input course saved');
  });
}

  const renderItem = (number: string, name: string) => ({
    value: number,
    label: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {number}
        <span>
          {/* <UserOutlined /> {name} */}
        </span>
      </div>
    ),
  });

  const history = () => {
    const classes = [];
    for (let i = 0; i < searchHistory.length; i++) {
      classes[i] = renderItem(searchHistory[i], '');
    }
    return classes;
  };

  return (
    <div className="App">
      <img src={pennCourseSearchImage} style={{ width: '287px', height: '50px', marginBottom: '15px' }} />
      <AutoComplete 
        popupClassName="certain-category-search-dropdown"
        popupMatchSelectWidth={400}
        style={{ width: 400 }}
        options={history()}
        size="large"
        onSelect={(input) => {findCourse(input)}}> 
        <Input.Search size="large" 
          placeholder="Find Course..." 
          onSearch = {(input) => {findCourse(input)}
      }></Input.Search>
      </AutoComplete>
      <div style={{ height: '15px' }} /> 
      <div style={{ marginBottom: '10px' }}>
        <span className='title-one'> {courseResult.id}: </span>
        <span className='title-two' > {courseResult.title} </span>
      </div>
        {/* <div>
        <h2>Search History:</h2>
        <ul>
          {searchHistory.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div> */}
      <span style={{color: 'grey'}}>
        {courseResult.prerequisites}
        <span style={{ fontWeight: 'bold' }}> {`  Credits:  `} </span>
        {courseResult.credits}
        &nbsp;&nbsp;&nbsp;
        <span style={{ fontWeight: 'bold' }}> {`  Instructors: `} </span>
        {courseResult.instructors.map((instructor, index) => (
          <span key={index}> {instructor}{index !== courseResult.instructors.length - 1 ? ',' : ''} </span> 
        ))}
      </span>
      <BarChart
        width={350}
        height={150}
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
      >
        <XAxis type="number" hide={true} domain={[0, 4]}/>
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
          background={{ fill: '#eee', radius: 10 }}
        >
          <LabelList
            dataKey="value"
            position="right"
            style={{ fill: "#000", fontSize: 14, fontWeight: "bold"}}
          />
          {data.map((entry, index) => (
            <Cell key={`${index}`} fill={getColor(index, entry.value)} />
          ))}
        </Bar>
      </BarChart>
      <MiniSnippetText
        text={
          isExpanded || courseResult.description.length <= maxLength
            ? courseResult.description
            : courseResult.description.slice(0, maxLength) + '...'
        }
      />
      {courseResult.description.length > maxLength && (
        <button onClick={() => setIsExpanded(!isExpanded)} 
        style={{ 
          marginBottom: '10px',
          marginTop: '10px',
          padding: '8px 16px', 
          backgroundColor: '#3875f6', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer', 
          fontSize: '14px' }}>
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
      <button onClick={clearSearchHistory} 
        style={{ 
          marginBottom: '10px',
          marginTop: '10px',
          marginLeft: '10px',
          padding: '8px 16px', 
          backgroundColor: '#3875f6', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer', 
          fontSize: '14px' 
        }}>
        Clear Search History
      </button>
    </div>
  );
}

export default App;