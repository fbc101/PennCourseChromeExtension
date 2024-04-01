# Chrome Extension Idea: PennCourse Extension

## Authors

Eshaan Chichula, Franci Branda-Chen, Jake Garrison Murphy, Matt fu

## Problem Statement

Our Chrome Extension simplifies the course selection process for Penn students by addressing a specific pain point: the need to switch back and forth between Path@Penn and Penn Course Review to assess course difficulty and instructor quality. By integrating this critical information directly into the Path@Penn interface, our tool minimizes the friction involved in course research, allowing students to make informed decisions with ease.

## Target Audience

This extension is tailored for Penn College students who are navigating the course selection process. 

## Description

Aiming to refine the course selection at Penn, our Chrome Extension introduces a user-friendly popup that condenses information from Penn Course Review, such as course difficulty levels and instructor ratings, and integrates it directly onto the Path@Penn page. This enhancement allows students to effortlessly compare and consider courses within a single browser window.

## Selling Points

1. Integrated Review Popup: Presents a succinct summary of course and instructor evaluations from Penn Course Review in a convenient popup on Path@Penn, streamlining research.
2. Efficiency in Course Planning: Dramatically decreases the time and effort needed to review and compare course options by centralizing information.
3. Intuitive User Experience: Offers a straightforward and easy-to-navigate interface that simplifies the decision-making process.
4. Enhanced Decision Making: Provides immediate access to critical course information, enabling students to make informed choices without delay.
5. Potential for Broad Application: Potential to bring in other review/descriptive sources for course/instructor information. The design principles can be adapted to simplify other review-based decision-making tasks as well.

## User Stories

_[List user stories that describe the main features of your Chrome Extension. Use the following template: "As a [user role], I want to [goal] so that [benefit]." Fill in the brackets with the appropriate information. Provide 15 user stories or more.]_

## Notes

_[Add any additional notes or considerations for your Chrome Extension idea. This could include potential challenges, alternative approaches, or specific features you want to highlight.]_

## References & Inspiration

_[Include any references or sources that inspired your Chrome Extension idea. This could be articles, existing products, or other resources that informed your concept. Just paste any links you found during research.]_

## Technical Details

### User Interface

Our current user interface model can be found in: https://www.figma.com/file/5i9DfeGxYjpjwNT6k86YJf/PennCourseChromeExtension?type=design&node-id=0%3A1&mode=design&t=CNqnicbHRixWtpEs-1.

### Chrome UI/UX elements:

- pop-up: Users can directly search for a course/professor in the search tab within the popup window.
- context menus: After highlighting a course or professor's name, the user can use the extension in the context menu to search directly without having to type.

### API, Libraries, and Frameworks

#### API:

- https://penncoursereview.com/api/documentation/. We will use the two api's (Retrieve Course, Course Search) in this doc to search a Penn course or professor.

#### Libraries:

- Axios: to make the query with the api url.  

#### Framework:

- Express.js: to set up the routes for the queries.

### Data Storage

We are not storing any course or professor data since we are simply fetching it from the penncoursereview api. If we decide to implement a favorite course/professor cart, then in that case we could simply store the names.

## Project Management

### Collaboration and Task Allocation

_[Select a Leader, who will make final decisions on the vision of the project; and a Manager, who will oversee the project management and ensure all team members have everything they need to contribute effectively. List the remaining team members and their roles.]_

- **Leader:** [Name]
- **Manager:** [Name]
- **Remaining Team Members:** [Name 1, Name 2, [Name 3]]

_[Provide a brief overview of what each team member will work on. How will you collaborate on this project? What tools or platforms will you use to communicate and share code?]_

### Risks and Mitigation

_[Identify potential risks that could affect the development of your Chrome Extension. How will you mitigate these risks? What is your contingency plan if things don't go as expected?]_

### Milestones and Timeline

_[You have about four weeks to work on this project. During the project management, you will use an Agile methodology to manage your tasks. For now, provide your best estimate of the work done each week, from Week 1 to Week 4.]_

_[- Week 1: Task 1, Task 2, Task 3
- Week 2: Task 4, Task 5, Task 6
- Week 3: Task 7, Task 8, Task 9
- Week 4: Task 10, Task 11, Task 12]_
