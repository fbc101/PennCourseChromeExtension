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

1. As a student planning my courseload, I want to be able to quickly see a course's difficulty in the Path@Penn browser.
2. As a student who likes to use office hours, I want to be able to easily see the TA rating of a course while choosing classes.
3. As a senior, I want to be able to see what courses fulfill my requirements that require the least work.
4. As a transfer student, I want to quickly familiarise myself with different professors for core classes.
5. As a student, I want to be able to select courses as quickly as possible with as much information as available.

## Notes

- A potential challenge will be to deploy the extension for anyone to download. No one in the team has this experience, thus it will take some time to deploy. We will need the TA's assistance for this.
- Another challenge is to create the UI for the extension. We need to know how to extract different Chrome elements from the browser, which will take some time to learn.
- If time permits, an additional feature can be a 'shopping cart' where users can save a list of courses/professors.

## References & Inspiration

- https://path.at.upenn.edu/ : This is where most of the users will use the extension. It is not necessary to open new tabs to search a class/professor.

- https://github.com/CIS-3500/ideation/blob/main/round3/kaddae89.md : This team presented the idea to the class. The project has the potential to be useful to many students.

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

- **Leader:** Franci Branda-Chen. Makes the last decision about a feature or conflict.
- **Manager:** Eshaan Chichula. Oversees and keeps track that the other teammates are not blocked in something.
- **Remaining Team Members:** Jake G. M., Matt Fu. Everyone will work on the UI/Backend.

### Risks and Mitigation

1. 
- **Risk:** Some team members may neglect to complete their assigned work, which may lead to the group as a whole to fall behind and resentment between team members to grow.
- **Mitigation:** Each member, which especial emphasis placed on the manager, should hold his teammates accountable for the work they have been assigned.

2. 
- **Risk:** Imbalances in work assignments or areas of knowledge may lead to certain members feeling as though they are taking a larger share of the work than others.
- **Mitigation:** The leader and manager should ensure that every member is doing a roughly equal amount of work which plays to his respective strengths.

3.
- **Risk:** Our UI may be, as compared to that employed by PennCourseReview, difficult to use or navigate.
- **Mitigation:** We should test the UI of our final product with real users to ensure that it is as intuitive as possible.

### Milestones and Timeline

Week 1: TASK 1: Find APIs, Task 2: Design UI on Figma
Week 2: Develop the UI
Week 3: Integrate the backend to the UI
Week 4: Finishing the last details about features
