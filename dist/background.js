chrome.runtime.onInstalled.addListener((()=>{chrome.contextMenus.create({id:"pennCourseSearch",title:"Penn Course Search",contexts:["selection"]})})),chrome.contextMenus.onClicked.addListener(((e,n)=>{if("pennCourseSearch"===e.menuItemId){const n=/[^\w\s]/g,t=e.selectionText.replace(n," ").trim().toLocaleUpperCase().split(/\s|&nbsp;/);3===t[1].length&&(t[1]+="0");const o={inputcourse:t[0]+"-"+t[1]};chrome.storage.local.set(o,(()=>{console.log("Input course saved")}))}}));