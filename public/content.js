// Listen for mouseup event
document.addEventListener('mouseup', function(event) {
  // Get the selected text
  var selectedText = window.getSelection().toString().trim();
  
  // Check if text is selected
  if (selectedText !== '') {
      // Send message to background script
      chrome.runtime.sendMessage({highlightedText: selectedText});
  }
});