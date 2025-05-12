// contentScript.ts - For detecting course selections on Path@Penn

// Listen for text selection events
document.addEventListener('mouseup', function() {
    const selectedText = window.getSelection()?.toString().trim();
    
    if (!selectedText || selectedText.length < 4) return; // Ignore very short selections
    
    // Check if the selection looks like a course code
    const courseCodeRegex = /[a-zA-Z]{2,4}[\s-][0-9]{3,4}/;
    if (courseCodeRegex.test(selectedText)) {
      // Send the selected text to our extension
      chrome.runtime.sendMessage({
        action: 'courseSelected',
        selectedText: selectedText
      });
    }
  });
  
  // Create a floating notification element
  function createSelectionNotification(courseId) {
    // Remove any existing notifications
    const existingNotification = document.getElementById('penn-course-selection-notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'penn-course-selection-notification';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#3875f6';
    notification.style.color = 'white';
    notification.style.padding = '10px 15px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
    notification.style.zIndex = '10000';
    notification.style.transition = 'opacity 0.3s';
    notification.style.cursor = 'pointer';
    notification.innerText = `Course "${courseId}" detected! Click to open Penn Course Search`;
    
    // Add click handler to open extension
    notification.addEventListener('click', function() {
      chrome.runtime.sendMessage({
        action: 'openExtension',
        courseId: courseId
      });
      notification.remove();
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
    
    document.body.appendChild(notification);
  }
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'courseProcessed') {
      createSelectionNotification(message.courseId);
    }
  });