// This function is called when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  // Create a context menu item
  // See: https://developer.chrome.com/docs/extensions/reference/api/contextMenus#method-create
  chrome.contextMenus.create({
    id: 'pennCourseSearch', // Unique identifier for the context menu item
    title: 'Penn Course Search', // Text to be displayed in the context menu
    contexts: ['selection'], // Show the context menu item only when text is selected
  });
});

// This function is called when a context menu item is clicked
// See: https://developer.chrome.com/docs/extensions/reference/api/contextMenus#event-onClicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // Check if the clicked menu item is 'captureSnippet'
  if (info.menuItemId === 'pennCourseSearch') {
    let selectedText = info.selectionText;

    // Gotta clean the input here
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

    const newinput = {
      inputcourse : cleanedInputCourse
    };

    // Retrieve the existing snippets from chrome.storage.local
    chrome.storage.local.set(newinput, () => {
      console.log('Input course saved');
    });
  }
});