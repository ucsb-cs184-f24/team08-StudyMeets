### Luis Miguel ###


### Garvin Young ###

- implemented navigation for Create Profile, all of Settings Tab, and all of People tab
- created Profile page that allows users to see other people's information
- implemented follow/unfollow functionality + displaying them on following/followers sub tabs
- implemented friend functionality + displaying them on friend subtab + accepting/denying friend request through notification message
- updated/moved MyProfile to People tab post CreateProfile adding more user information fields + allowed editting of those fields
- display all users in explore tab w/ search bar derived from explore search bar
- other minor improvements

### Tim Choi ###

- Set up firebase for the project
- Implemented logout functionality
- Implemented a Change Password feature that sent user an email with instructions on how to change the password securely.
- Implemented a Profile Picture feature that user could change and is connected to their Photo Library
- Implemented the "Joining Study Group" functionality and having the group show up on their MyGroups tab by moving the GroupCard into it's own component
- Designed the UI of certain components of the app such as the GroupCard that is displayed on the Explore page, the CreateGroupComponent, EditGroupComponent, Profile Tab, etc.
- Implemented Unit Testing for the GroupCard rendering and functionality
- Implemented a Setup Meeting Time to be displayed on the GroupCard and allow editting from the Edit button and Create button. If no meeting time is established, it defaults to TBD.

### Meron Tesfandrias ###
- Implemented Filter functionality to Explore page in the form of button next to search bar; by tags, subjects, or classes.
- Added UCSB API to take classes from GOLD
- Fixed issue with user ability to create empty groups
- Fixed issue with display differences between android and IOS on explore
- Created version of Sign Up page which was not used due to another PR after including it
- Implemented ability for user to join groups from explore page
- Implemented display of groups on MyGroups page which displayed own groups at top of list and joined under, this was replaced by another implementation in a PR that was created after
- Rehauled Tags, added new ones, removed unnecessary ones, and sorted & Updated group card to show subjects/classes
- Created demo video for app at first MVP

### Wesley Chiba ###
- Added support for picking user location with a basic UI component
- Added many UI enhancements throughout the app
- Helped resolve teammates' problems with Git and resolving merge conflicts
- Reviewed 20+ PRs and merged many changes into the main project
- Added dark theme support throughout the app
- Added detailed documentation in the README.md

### David Joyner ###
- Added Unit testing for settings.js, following.js, friends.js, profile.js, & login.js
- Implemented abilitiy to use tags
- added ability to hide password
- added ability to refresh on swipe

### Kai Han ###

- Established the initial project framework, including navigation between pages. Implemented a three-page structure: Explore, MyGroups, and Profile, serving as the foundation for the first version of the app.
- Designed the process for creating Study Meet sessions and integrated Firebase email verification, connected the app’s Study Meet data with Firestore for real-time updates and seamless synchronization.
- Enhanced the layout design of the Sign In and People pages, resolving issues such as blank pages failing to refresh and ensuring a smoother user experience.
- Set the function that when a user creates a Post, his friends will receive notifications, ensuring that users can get notifications when a friend creates a new Post.
- Create a People button on the Group Card to ensure that users can view the composition of the people participating in the current StudyMeet.
- Wrote the initial drafts of DESIGN and MANUAL documentation, including designing process flowcharts to outline the app’s functionalities and user workflows.

## Contribution Graph Analysis ##

We believe the contribution graph isn't the most accurate indicator of how much someone contributed to the project in terms of code. If we just look at the raw data there are a few outliers such as Luis's 22k lines of code commited or Garvin's and Tim's 7.5k and 7.8k lines of code deleted respectively. If you look further into the causes of those committs you can see Luis's is from creating the original project and Garvin and Tim's are from changing imports/libraries used which changed packagelock which is notoriously long hence the inflated lines of code commited/deleted. As for number of committs, they also don't reflect contributions well since trivial committs/edits to md files such as readme and daily scrums (while still important) shouldn't be equated to a single committ that contributes greatly to the project which makes up a non negligible amount of the committs for most members.

Additionally there are also other forms of contribution such as being an active reviewer, being the project direction leader, or creating new issue to progress the project that aren't reflected by how many lines of code or committs someone has done.

Ultimately the contribution graphs aren't a good indicator for the quantity and quality of contributions for the aforementioned reasons. A better, but more tedious method of analyzing someone's contribution would be to look at all the prs they made and how they play into the overal functionality and quality of the app.
