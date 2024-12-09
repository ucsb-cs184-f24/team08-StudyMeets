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

### Meeting Details ###

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

### RETRO Details ###

**RETRO_1_Plan:**
- A goal: Communicate more, helping each other with the project/HW and letting everyone know where you are. Also sharing useful resources with the group.
- A change: We plan to utilize slack more and the messaging group chat, updating each other on our progress/issues and sending resources or tips to help others.
- A measurement: We can check if our experiment worked if there have been more messages in the group chat and slack by our next retro.
- Result: There have been more messages in both the group chat and slack including: asking for help, sending resources, updating group on progress, and asking for peer reviews on code.

**RETRO_1_Outcome:**
- Result: There have been more messages in both the group chat and slack including: asking for help, sending resources, updating group on progress, and asking for peer reviews on code
- We used a group discussion similar to the daily standups where everyone had a chance to speak. Once everyone had spoken I asked if there was anything else anyone wanted to add, when everyone was done with their thoughts we moved on.
- The retro went well, since we are at the beginning of the project it felt like there wasn't much we wanted to change.
- For the next retrospective I would recommend giving people more time to think before jumping into discussion, I was speaking first a lot and maybe not giving everyone enough time to formulate their thoughts.

**RETRO_2_Plan:**
- A goal: communicate more especially when people's work are dependent on others'
- A change: be more active approving pull requests, properly making pull requests and using the kanban board
- A measurement: see how long each pull request stays up (timestamps)
- Discussion was productive and made sure everyone was on board with the same things
- Make sure everyone can speak openly and hear all ideas from all team members

**RETRO_2_Outcome:**
- Result: Getting pull requests accepted is still somewhat slow, usually requires someone to ask in person during a class or discussion for a pr to get approved. Weren't too many new prs made out of class so it's hard to see how long those will last given it's a new sprint.
- We used a group discussion similar to the daily standups where everyone had a chance to speak. Once everyone had spoken I asked if there was anything else anyone wanted to add, when everyone was done with their thoughts we moved on.
- Not much talking during the retro, but we all seemed to be on the smae page
- For the next retrospective I would recommend not giving too open ended of questions since that doesn't necessarily encourage someone to speak. Possibly make more directed questions while be conscious to maintain neutrality and not trying to steer the conversation

## User Experience (UX) Considerations ##
### High-Level Task/User Flow ###
![image](https://github.com/user-attachments/assets/2f0e91a2-6fcf-44f5-92ea-58c3da44cfb9)


### Task: Join a Study Meet ###

**1. Sign In**

- If User has account, log in with their email address.
- If no account, tap “Create Account” to register.
- Email verification is required before completing registration.
- Profile setup includes entering a name, profile picture (optional), and basic information.

**2. Explore Groups**

- Users can search for groups using tags, topics, or location.
- View trending or recommended groups based on user interests.

**3. View Group Details**

- Tap on a group to view detailed information.
- Group Name, Description, Tags, etc will display on the group card.

**4. Join Group**

- Tap “Join Group” on the group details page.
- User Successfully Join a Group

### Task: Create a Study Meet ###

**1. Sign In**

- If User has account, log in with their email address.
- If no account, tap “Create Account” to register.
- Email verification is required before completing registration.
- Profile setup includes entering a name, profile picture (optional), and basic information.

**2. Navigate to the Explore Page and Click add icon**

- A window will pop up for the user to enter information about StudyMeet.
- This includes Title, Location, Description, etc.
- After entering, click Create to complete the creation.

**3. View On Study Groups**

- The newly created StudyMeet will be displayed on the Study Groups Tab in the Explore Page.

### Task: Managing Groups in “My Groups” ###

**1. View Joined Groups**
- Display a list of groups the user has joined or created.
- Include options to view group details, leave a group, or manage created groups.

**2. Manage Created Groups**
- Edit Group Information: Update the title, description, location, tags, etc.
- Delete Group: Permanently remove the group from the system.


### Task: Interacting with People ###

**1. Check Friends, Followers, and Following**

- View a list of friends and manage connections.
- Follow other group members or add them as your friends.

**2. Change Profile Information**

- Edit user profile details such as name, picture, and Interests.

### Task: System Settings ###

**1. Notifications**

Check all notifications of new friends request, User can click Accept or Reject to reply this request.
Before Accept or Reject, User can view new friend profile

**2. Dark Mode**
- Toggle dark mode for the app interface.

**3. Account Management**

- Change password or logout securely.

### UI/UX Principles ###

- **Simplicity:** Ensure the interface is intuitive and easy to navigate.

- **Accessibility:** Support dynamic font sizes and proper color contrast.

- **Consistency:** Maintain a uniform design style across all screens using React Native Paper and Tamagui.

## External Resources ##

https://reactnative.dev/docs/style

https://www.youtube.com/watch?v=8ejuHsaXiwU

https://blog.logrocket.com/react-native-styling-tutorial-examples/

https://www.youtube.com/playlist?list=PLC3y8-rFHvwhiQJD1di4eRVN30WWCXkg1

https://www.youtube.com/watch?v=HY3O_wrvDsI

In addition to these links, we also use external tools such as StackOverflow to help us write code more smoothly.
## Difficulties ##

## Evaluation/ Testing ##

