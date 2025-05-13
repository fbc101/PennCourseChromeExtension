// cleans the highlighted text to retrieve the course_id, otherwise ignore the text
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const selectedText = message.highlightedText;

  const regex = /[^\w\s]/g;
  const entireCodeRegex = /[a-zA-z]{2,4}([-\s]|(&nbsp;))[0-9]{3,4}/;

  const match = entireCodeRegex.exec(selectedText);

  // if a course was found, proceed to clean it
  if (match) {
    try {
      // On the first course match, replace all occurrences of any symbols with a space
      const noSymbolStringTrimmed = match[0].replace(regex, ' ').trim().toLocaleUpperCase();
      // splits by space and &nbsp; 
      const codeAndNumber = noSymbolStringTrimmed.split(/\s|&nbsp;/);
  
      // Check if the number part has 3 digits, and if so, append a '0'
      if (codeAndNumber[1].length === 3) {
        codeAndNumber[1] += '0';
      }
  
      const cleanedInputCourse = codeAndNumber[0] + '-' + codeAndNumber[1]; // Code-Number e.g CIS-1200
  
      const newinput = {
        inputcourse: cleanedInputCourse
      };
  
      chrome.storage.local.set(newinput, () => {
        console.log('Input course saved');
      });
    } catch (error) {
      console.log(error);
    }
  }
});


// LLM API call (for course recommendation)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("🔔 background.onMessage got:", message);
  
  // Original recommendation feature - which course to take
  if (message.action === 'getAiSelection') {
    // fetch the API key
    chrome.storage.local.get(['openaiKey'], async ({ openaiKey }) => {
      if (!openaiKey) {
        sendResponse({ error: 'No OpenAI key saved' });
        return;
      }

      // build prompt from the courses objects
      const courseList = message.courses
        .map(c => {
          const d = c.courseData;
          return [
            `• ${c.id}: ${c.title}`,
            `    Course Quality: ${d.course_quality}`,
            `    Instructor Quality: ${d.instructor_quality}`,
            `    Difficulty: ${d.difficulty}`,
            `    Work Required: ${d.work_required}`
          ].join('\n');
        })
        .join('\n\n');

      const system = {
        role: 'system',
        content: 'You are a helpful academic advisor for Penn undergrads.'
      };
      const user = {
        role: 'user',
        content: `Here are the courses I'm interested in: ${courseList} 
        Based on their stats like workload, difficulty, and quality averages, which one would you recommend I take this coming semester? 
        You have to pick one course and one course only. Assume I am equally interested in all of them. I need to know which is best.
        Explain briefly but limit your answer to 2-3 sentences and be consice and quantitative.`
      };

      // Call OpenAI
      try {
        const answer = await callOpenAI(openaiKey, system.content, user.content);
        sendResponse({ answer });
      } catch (err) {
        console.error(err);
        sendResponse({ answer: 'Error calling OpenAI.' });
      }
    });

    // return true to indicate we'll call sendResponse asynchronously
    return true;
  }
  
  // New feature 1: Get a detailed summary of a single course
  if (message.action === 'getCourseSummary') {
    // fetch the API key
    chrome.storage.local.get(['openaiKey'], async ({ openaiKey }) => {
      if (!openaiKey) {
        sendResponse({ error: 'No OpenAI key saved' });
        return;
      }

      try {
        const course = message.course;
        const d = course.courseData;
        
        // Format the course data
        const courseInfo = [
          `${course.id}: ${course.title}`,
          `Course Quality: ${d.course_quality}`,
          `Instructor Quality: ${d.instructor_quality}`,
          `Difficulty: ${d.difficulty}`,
          `Work Required: ${d.work_required}`,
          `Description: ${d.description || 'No description available'}`
        ].join('\n');

        const system = {
          role: 'system',
          content: 'You are a helpful academic advisor for Penn undergrads, known for giving concise but insightful course summaries.'
        };
        
        const user = {
          role: 'user',
          content: `I'm considering taking this course:\n${courseInfo}\n\nPlease provide a short summary with these points:\n\n- **Course Content**: What I'll learn in 1-2 sentences\n- **Teaching Style**: What teaching approach is used based on ratings\n- **Ideal For**: What type of student would benefit most\n- **Challenge Level**: Assessment of difficulty vs workload balance\n\nKeep your full response under 6 sentences total and use the bullet format with bold headers exactly as shown.`
        };

        const answer = await callOpenAI(openaiKey, system.content, user.content);
        sendResponse({ answer });
      } catch (err) {
        console.error(err);
        sendResponse({ answer: 'Error calling OpenAI.' });
      }
    });

    // return true to indicate we'll call sendResponse asynchronously
    return true;
  }
  
  // New feature 2: Compare multiple courses and get a recommendation
  if (message.action === 'getCourseRecommendation') {
    // fetch the API key
    chrome.storage.local.get(['openaiKey'], async ({ openaiKey }) => {
      if (!openaiKey) {
        sendResponse({ error: 'No OpenAI key saved' });
        return;
      }

      try {
        // Format the courses data
        const courseList = message.courses
          .map(c => {
            const d = c.courseData;
            return [
              `• ${c.id}: ${c.title}`,
              `    Course Quality: ${d.course_quality}`,
              `    Instructor Quality: ${d.instructor_quality}`,
              `    Difficulty: ${d.difficulty}`,
              `    Work Required: ${d.work_required}`,
              `    Description: ${d.description || 'No description available'}`
            ].join('\n');
          })
          .join('\n\n');

        const system = {
          role: 'system',
          content: 'You are a helpful academic advisor for Penn undergrads who specializes in comparing courses and providing structured analysis.'
        };
        
        const user = {
          role: 'user',
          content: `I'm trying to decide between these courses:\n\n${courseList}\n\nPlease compare these courses and help me decide which one to take. Use this EXACT format in your response:\n\n### 1. Overall Course Quality\n- **COURSE-ID**: Analysis of quality rating...\n- **COURSE-ID**: Analysis of quality rating...\n\n### 2. Teaching Style and Instructor Quality\n- **COURSE-ID**: Analysis of instructor quality...\n- **COURSE-ID**: Analysis of instructor quality...\n\n### 3. Workload vs. Difficulty Balance\n- **COURSE-ID**: Analysis of workload/difficulty...\n- **COURSE-ID**: Analysis of workload/difficulty...\n\n### 4. Content Relevance and Value\n- **COURSE-ID**: Analysis of content...\n- **COURSE-ID**: Analysis of content...\n\n### Recommendation\nFinal recommendation with justification.\n\nReplace COURSE-ID with actual course IDs. Follow this format precisely, keeping each section brief and focused. Keep your response under 250 words.`
        };

        const answer = await callOpenAI(openaiKey, system.content, user.content);
        sendResponse({ answer });
      } catch (err) {
        console.error(err);
        sendResponse({ answer: 'Error calling OpenAI.' });
      }
    });

    // return true to indicate we'll call sendResponse asynchronously
    return true;
  }
});

// Utility function to call the OpenAI API
async function callOpenAI(apiKey, systemContent, userContent) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',   
      messages: [
        {role: "system", content: systemContent},
        {role: "user", content: userContent}
      ],
      max_tokens: 400
    })
  });

  // Log the whole API response to troubleshoot the format
  console.log('API Response: ', res);

  const data = await res.json();
  console.log("🗂 full OpenAI JSON", data);

  return data.choices[0]?.message?.content || 'No response';
}

// Commented out for potential future use - Course Learning Outcomes feature
/*
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action !== 'getCourseOutcomes') return;
  chrome.storage.local.get(['openaiKey'], async ({ openaiKey }) => {
    if (!openaiKey) {
      sendResponse({ outcomes: 'No API key.' });
      return;
    }

    // build the bullet‑list of courses + desc
    const courseList = message.courses
      .map(c => `• ${c.id} – ${c.title}\n  ${c.description}`)
      .join('\n\n');

    const system = {
      role: 'system',
      content: 'You are an academic advisor.  For each course, produce 1 to 2 bullet points only describing what students (in second POV "you) will learn and skills gained. Focus on how the courses uniquely differ.'
    };
    const user = {
      role: 'user',
      content: `Here are the selected courses:\n\n${courseList}`
    };

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [system, user],
          max_tokens: 300
        })
      });
      const data = await res.json();
      const out = data.choices?.[0]?.message?.content?.trim() 
        || 'No summary returned.';
      sendResponse({ outcomes: out });
    } catch (e) {
      console.error(e);
      sendResponse({ outcomes: 'Error during OpenAI call.' });
    }
  });
  return true; // keep sendResponse alive
});
*/
