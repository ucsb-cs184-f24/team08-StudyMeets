## Overview System Architecture ##
### Architecture Diagram ###
![image](https://github.com/user-attachments/assets/98057bd7-6aed-4a05-b62f-7eb73146710c)



- **Frontend**: React Native for the mobile app interface.

- **Backend**: Firebase services (Authentication, Firestore) for authentication, data storage, and real-time updates.

- **Expo**: Platform for running and testing the app on multiple devices.

### Explanation ###
- **Frontend**: Implements user interactions, including signing in, exploring groups, and managing study groups.

- **Backend**: Firebase Authentication verifies users through UCSB email domains. Firestore stores user data, group details, and participation records.

- **Real-Time Updates**: Firestore ensures dynamic updates for group lists and participant data.


## Team Decisions ##
### Summary ###
- **Technology Stack Selection:** React Native was chosen for cross-platform development due to its flexibility and performance. Firebase was selected for authentication and database services because of its real-time capabilities and seamless integration with React Native.

- **Feature Prioritization:** Decided to focus on core functionalities like group creation, exploration, and secure login before adding friend recommendations or college-specific events.

- **Verification Methods:** Chose email domain-based verification for simplicity, with plans to expand to LinkedIn and campus networks in later iterations.

### Details ###

**10 - 14**

Build the app skeleton, implement features like login, account creation, and user persistence, and set up Firebase for backend support. The team has finalized user stories, assigned tasks, and all issues are now in progress.


**10 - 21**

Address the Firebase configuration file roadblock and continue working on assigned issues. 

**10 - 23**

Resolve the Google OAuth issue and finalize the Firebase configuration file.

**10 - 25**

Continue to implement features like Google OAuth, group creation, and profile setup, and finalize navigation with tabs and screens. Several PRs have been submitted and approved.

**10 - 28**

Implement the Create Group feature, and research libraries and Firestore database integration. 

**10 - 30**

Focus on implementing features like the Create Group function, Google OAuth, profile page, and Firebase messaging for user notifications. The team is progressing well, resolving merge conflicts, and researching Firestore database integration.

**11 - 1**

Enhance the profile page by adding navigation and implementing the profile tab, while continuing to refine features like user group creation and deletion. Key progress includes implementing logout and password features, and connecting Firestore to user functionalities.

**11 - 8**

Continue developing the location selection feature using maps or device location, and implement the joining group feature with group display functionality. 

**11 - 13**

Complete HW4 and implement features such as retrieving more group information on click, a request join button, and selecting a study location from a map. The team is making progress on HW4 and related issues, with no significant roadblocks reported.

**11 - 15**

Implement sorting for groups, refine the UI, and begin writing tests, the design document, and the user manual. Progress is steady, with updated Kanban board tasks.

**11 - 18**

Implement recommended changes from the HW04 code review, enhance app navigation, update the profile page, and develop features such as search functionality and a dark theme.

**11 - 20**

Resolve merge conflicts, complete HW4, and set up testing despite challenges. Progress includes moving the profile tab, implementing a navigation framework for the settings tab, fixing login issues, and creating a manual and design.

**11 - 22**

Complete HW04, resolve conflicts during testing, and address the newly assigned issues. Progress includes creating tests for the profile and login pages, pushing PRs, and reviewing others, with no significant roadblocks except for some conflicts being addressed.

**12 - 2**

Optimize features like the Explore and Home pages, implement account deletion, improve the Friends tab, and explore adding a “when to meet” feature and tag updates using API classes. HW4 has been completed by all team members, with progress continuing on unit testing and PR approvals.

**12 - 4**

Finalize features such as meeting date/time setup, explore notifications, and fixing tags, as well as continuing with unit testing and updating the Explore page. Progress includes implementing account deletion and add friend components.

## User Experience (UX) Considerations ##
### High-Level Task/User Flow ###
![image](https://github.com/user-attachments/assets/2f0e91a2-6fcf-44f5-92ea-58c3da44cfb9)

#### Task: Joining a Study Group ####
- **Sign In:** User logs in or registers with a UCSB email address.

- **Explore Groups:** Browse or search for groups based on tags, topics, or location.

- **View Group Details:** Check group name, description, location, and participant limit.

- **Join Group:** Request to join; if accepted, group details are added to “My Study Groups.”

#### Task: Creating a Study Group ####

- **Navigate to “My Study Groups”:** Open the tab and tap “Create Group.”

- **Enter Details:** Fill in title, description, location, tags, and participant limit.

- **Submit:** Create the group and make it visible to others in the Explore tab.

### UI/UX Principles ###

- **Simplicity:** Ensure the interface is intuitive and easy to navigate.

- **Accessibility:** Support dynamic font sizes and proper color contrast.

- **Consistency:** Maintain a uniform design style across all screens using React Native Paper and Tamagui.


## Next Steps ##
### Features to Design ###
- Friend Recommendations: Propose a design for suggesting study partners based on shared interests and participation history.
- College-Specific Events: Create a dedicated section for events tied to UCSB activities or departments.
### Iterative Improvements ###
- Incorporate user feedback into UX designs.
- Optimize backend queries for better performance.



DESIGN doc Link:

https://docs.google.com/document/d/1Mjwg9ECoQ_ooC6w48MAPIrrww_IEhfjnvRYl_C1hu6Y/edit?usp=sharing
