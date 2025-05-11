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
// This is the function that will be called when the user clicks the extension icon
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("🔔 background.onMessage got:", message);
  if (message.action !== 'run_llm') return;
  if (message.action === 'getAiSelection') {
    // 1) fetch the API key
    chrome.storage.local.get(['openaiKey'], async ({ openaiKey }) => {
      if (!openaiKey) {
        sendResponse({ error: 'No OpenAI key saved' });
        return;
      }

      // 2) build your prompt from the courses array
      const courseList = message.courses
        .map(c => `• ${c.id}: ${c.title}`)
        .join('\n');
      const system = {
        role: 'system',
        content: 'You are a helpful academic advisor for Penn undergrads.'
      };
      const user = {
        role: 'user',
        content: `Here are the courses I’m interested in: ${courseList} 
        Based on workload, difficulty, and quality averages, which one would you recommend I take this coming semester? Explain briefly.`.trim()
      };

      // 3) call OpenAI
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4',       // or whichever model you want
            messages: [system, user],
            max_tokens: 200
          })
        });
        const data = await res.json();
        const answer = data.choices?.[0]?.message?.content || 'No response';
        sendResponse({ answer });
      } catch (err) {
        console.error(err);
        sendResponse({ answer: 'Error calling OpenAI.' });
      }
    });

    // return true to indicate we’ll call sendResponse asynchronously
    return true;
  }
});
