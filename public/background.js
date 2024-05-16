chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id, allFrames: true},
    files: ["content.js"],
  }).then(injectionResults => {
    console.log("highlight done!");
  });
});

// cleans the highlighted text to retrieve the course_id, otherwise ignore the text
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  const safe = true;
  const selectedText = message.highlightedText;

  const regex = /[^\w\s]/g;
  const entireCodeRegex = /[a-zA-z]{2,4}([-\s]|(&nbsp;))[0-9]{3,4}/;

  const match = entireCodeRegex.exec(selectedText);
  let codeAndNumber; 
  // if a course was found, proceed to clean it
  if (match) {
    // On the first course match, replace all occurrences of any symbols with a space
    const noSymbolStringTrimmed = match[0].replace(regex, ' ').trim().toLocaleUpperCase();
    // splits by space and &nbsp; 
    codeAndNumber = noSymbolStringTrimmed.split(/\s|&nbsp;/); 
  } else { // no course was found in the entire highlightedText
    safe = false;
  }
    
  // Check if the number part has 3 digits, and if so, append a '0'
  if (codeAndNumber[1].length === 3) {
    codeAndNumber[1] += '0';
  } 
  
  const cleanedInputCourse = codeAndNumber[0] + '-' + codeAndNumber[1]; // Code-Number e.g CIS-1200

  const newinput = {
    inputcourse : cleanedInputCourse
  };

  if (safe) {
    chrome.storage.local.set(newinput, () => {
      console.log('Input course saved');
    });
  }
});