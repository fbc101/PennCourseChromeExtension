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


// LLM API call
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("🔔 background.onMessage got:", message);
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
        content: `Here are the courses I’m interested in: ${courseList} 
        Based on their stats like workload, difficulty, and quality averages, which one would you recommend I take this coming semester? 
        You have to pick one course and one course only. Assume I am equally interested in all of them. I need to know which is best.
        Explain briefly but limit your answer to 2-3 sentences and be consice and quantitative.`
      };

      // 3) call OpenAI
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          credentials: 'omit',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o',   
            messages: [
              {role: "system", content: system.content},
              {role: "user", content: user.content}
            ],
            max_tokens: 200
          })
        });

        // Log the whole API response to troubleshoot the format
        console.log('API Response: ', res);


        const data = await res.json();
        console.log("🗂 full OpenAI JSON", data);

        const answer = data.choices[0]?.message?.content || 'No response';
        sendResponse({ answer });

      }
        catch (err) {
        console.error(err);
        sendResponse({ answer: 'Error calling OpenAI.' });
      }
      

    });

    // return true to indicate we’ll call sendResponse asynchronously
    return true;
  }
});
