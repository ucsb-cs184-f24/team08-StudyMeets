# StudyMeets DESIGN #
## Overview System Architecture ##
### Architecture Diagram ###
![image](https://github.com/user-attachments/assets/60817874-bef2-4b06-ad57-e293cb1e7ee9)


- **Frontend**: React Native for the mobile app interface.

- **Backend**: Firebase services (Authentication, Firestore) for authentication, data storage, and real-time updates.

- **Expo**: Platform for running and testing the app on multiple devices.

- **User Roles**: Integration of different user roles (Group Creators and Group Joiners).

### Explanation ###
- **Frontend**: Implements user interactions, including signing in, exploring groups, and managing study groups.

- **Backend**: Firebase Authentication verifies users through UCSB email domains. Firestore stores user data, group details, and participation records.

- **Real-Time Updates**: Firestore ensures dynamic updates for group lists and participant data.


## Team Decisions ##
- **Technology Stack Selection:** React Native was chosen for cross-platform development due to its flexibility and performance. Firebase was selected for authentication and database services because of its real-time capabilities and seamless integration with React Native.

- **Feature Prioritization:** Decided to focus on core functionalities like group creation, exploration, and secure login before adding friend recommendations or college-specific events.

- **Verification Methods:** Chose email domain-based verification for simplicity, with plans to expand to LinkedIn and campus networks in later iterations.

- **Participant Limits:** Introduced group participant limits and distance-based restrictions for localizing events.

## User Experience (UX) Considerations ##
### High-Level Task/User Flow ###
![image](https://github.com/user-attachments/assets/b3c06c84-8077-4914-8eb1-f5132d1332a2)

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
