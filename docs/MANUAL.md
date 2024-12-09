# StudyMeets User Manual #

## Purpose of the Product ##
The purpose of StudyMeets is to create a dedicated platform for UCSB students to communicate through study groups, promoting academic collaboration and social interaction within a safe campus community. The application allows users to discover and join study groups and activities based on interests and academic goals, solving the problem of finding like-minded classmates. By verifying student identity, StudyMeets ensures a safe and localized environment for users. It also provides moderators with tools to create and manage groups, set various tags and topics, while participants can search for groups by tag or topic. By combining academic and social opportunities, StudyMeets aims to strengthen the sense of belonging and collaboration among UCSB students and create a vibrant and supportive campus experience.

## Intended User Audience ##
### Group Creators: ###
UCSB students looking to create local study or social groups. These users are verified through email and can create new group, add group tags, add friends.
### Group Joiners: ###
UCSB students interested in joining study groups that match their location and interests. These users can search for groups and join them after reviewing details such as tags.

## Introduction  ##
StudyMeets, an innovative app designed specifically for UCSB students to promote collaborative learning and social interaction. Designed with an easy-to-use interface and advanced features, StudyMeets helps students find, create, and join study sessions and events based on location and shared interests.

## System Logic Diagram ##
![image](https://github.com/user-attachments/assets/2f0e91a2-6fcf-44f5-92ea-58c3da44cfb9)


## Installation  ##
### For IOS/Android Expo Go ###
1. Clone the repository: `git clone https://github.com/ucsb-cs184-f24/team08-StudyMeets.git`
2. Navigate to the StudyMeets directory: `cd StudyMeets`
3. Install dependencies: `npm i`, `npm install`
4. Start the Expo project: `npx expo start`
5. A QR code should pop up in the console; scan it with a mobile device and the application should start up. Alternatively, connect a device via USB or start up a mobile device emulator for the application.
### For Android .apk file ###
Users can download the .apk file in the link below to their mobile phone and run it.

[.apk file link](https://github.com/ucsb-cs184-f24/team08-StudyMeets/releases/tag/1.0)


## User Authentication  ##
### Create Account ###
If the user does not have an account yet, he needs to register an account, enter the email address, username, and password to register the account. After registration, the corresponding email address will receive a verification email. Click the verification email, then log in and you can enter the App.

<img src="https://github.com/user-attachments/assets/ccf896f4-84a1-4a45-84e6-7872d9c30989" alt="Create Account" width="200"/>


### Sign In ###
If the user already has an account, he can directly enter the email address and password to enter the App.

<img src="https://github.com/user-attachments/assets/168c822c-661a-41fe-9d5c-396a299b8014" alt="Sign In" width="200"/>

## Explore ##
### Search StudyMeet Group ###
In the Explore interface, you can view all published StudyMeets. You can enter what you want to search in the search box, and the system will automatically filter out the StudyMeets you want.

<img src="https://github.com/user-attachments/assets/7dde1c15-84b7-4faa-831c-527f668f1498" alt="Create New StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/ca5efc31-b21b-4fc2-9e8b-f516817a3ced" alt="Create New StudyMeet" width="200"/>

### Create StudyMeet Group ###
Click the plus sign in the lower left corner to create a new StudyMeet, enter the relevant information, and create it.

<img src="https://github.com/user-attachments/assets/fad31ec9-8d52-41ad-9496-c65c0b844c5e" alt="Explore StudyMeets" width="200"/>
<img src="https://github.com/user-attachments/assets/371749aa-d494-4b9b-91d3-a8e750a45693" alt="Explore StudyMeets" width="200"/>

### Join StudyMeet Group ###
You can choose the StudyMeet you are interested in to join. Click the Join button to achieve this operation, and then you are in this StudyMeet.

<img src="https://github.com/user-attachments/assets/916f453e-8ad5-4ba7-b1f5-daa06ed33490" alt="Search StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/3635647a-5d08-4fea-9e85-3418b5dbb7fb" alt="Search StudyMeet" width="200"/>

### Search People ###
Switch to the All Users Tab, you can see all the users of the current App. Similarly, you can use the search box to filter users, and you can also click on users to view their profiles.

<img src="https://github.com/user-attachments/assets/8ff62b19-ce7a-4aff-9855-81963ddcaa20" alt="Join StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/bdd420cf-2983-4e84-a32f-86cffc8a16e9" alt="Join StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/f601965e-c722-4b64-8f6c-ddaae045db80" alt="Join StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/9d754330-5318-4259-ad57-62b760fd30df" alt="Join StudyMeet" width="200"/>


## MyGroups ##
### Edit Group You Created ###
Enter the Created Groups Tab in the MyGroups interface, and you can see the group you created. You can click Edit to update the information of the StudyMeet.

<img src="https://github.com/user-attachments/assets/7661af60-dcdc-4e54-9dda-e44930df7788" alt="Join StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/9730e7f5-1620-4145-875b-56d1d631fe29" alt="Join StudyMeet" width="200"/>


### Check the Group People ###
Click the People button to see who is in the current StudyMeet.

<img src="https://github.com/user-attachments/assets/14ed8559-dc40-4120-92c6-56f40ffa58d3" alt="Join StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/cac40150-5098-4928-9cf6-102a7747c4c4" alt="Join StudyMeet" width="200"/>

### Delete Group You Created ###
Click the Delete button to delete the StudyMeet you created.

<img src="https://github.com/user-attachments/assets/7e742b10-ab12-46c5-abf3-1b407a190654" alt="Join StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/e147945e-099b-44ae-9782-28ab449aa22e" alt="Join StudyMeet" width="200"/>

### Leave Group You Joined ###
Enter the Joined Groups Tab of the MyGroups interface, and you can see two operations. The People button has the same function as before, and Leave Group can leave the current group you joined.

<img src="https://github.com/user-attachments/assets/72baa2d9-b392-461b-931a-910945422062" alt="Join StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/5008ec3f-fa4b-4f4c-bcc1-fef2fc3e8051" alt="Join StudyMeet" width="200"/>


## People ##
### Check Friends, Following, Followers ###
On the People page, you can view your Friends, Following, and Followers. You can also click on a user and view their Profile.

<img src="https://github.com/user-attachments/assets/1aac154c-ba11-47e1-abf9-61676a74d05a" alt="Join StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/fb5b6c4a-323b-488d-ad28-85152962c6ee" alt="Join StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/08c483cd-159f-43fb-9e3e-07da1e84b7e4" alt="Join StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/96ca353c-058e-4e57-b31f-6181635dfd59" alt="Join StudyMeet" width="200"/>

### Change Profile Information ###
Click on your own avatar in the upper right corner to view your Profile, and then you can choose to make changes.

<img src="https://github.com/user-attachments/assets/c1507b4a-760c-406e-aef8-102f9b724ea1" alt="Join StudyMeet" width="200"/>

## Setting ##
### Check Notification ###
On the settings page, click the email symbol in the upper right corner. Users can view the friend requests they have received. Click the request and then choose Accept or Reject. In addition, you can also view the profile of the user who wants to request to add you as a friend.

<img src="https://github.com/user-attachments/assets/5fdcebe2-32de-488b-925f-14090ea085ec" alt="Join StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/c699b04d-2bfe-4058-95f1-86e39d11382e" alt="Join StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/2e1db35d-bb84-4006-810a-8171641d120b" alt="Join StudyMeet" width="200"/>

### Change Password ###
Click the Change Password button below to change your password. After clicking, you will receive an email in your mailbox. Follow the instructions in the email to complete the password change.

<img src="https://github.com/user-attachments/assets/d46aa53e-c0f4-4bfd-b507-e07732f20417" alt="Join StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/50e90098-9ba5-4235-85df-1c55b56deb4e" alt="Join StudyMeet" width="200"/>

### Set Dark Mode ###
Click the Dark Mode button below to set Dark Mode.

<img src="https://github.com/user-attachments/assets/b68ff1c2-f251-41b8-901a-a24dd5d7d9b5" alt="Join StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/3cf6b6bc-3966-434b-80f1-0c53f4eb114e" alt="Join StudyMeet" width="200"/>

### Logout ###
Click Logout to log out of the current account.

<img src="https://github.com/user-attachments/assets/f6cb39c8-64aa-4847-bcad-3ae9d7768d45" alt="Join StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/168c822c-661a-41fe-9d5c-396a299b8014" alt="Sign In" width="200"/>

## Known Issues  ##
- Some permission errors can occur when trying to sign in
- Changing the profile picture repeatedly can cause a visual error
- App goes blank when an internal error occurs, and needs to be force stopped

