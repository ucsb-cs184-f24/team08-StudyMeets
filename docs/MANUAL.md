# StudyMeets User Manual #

## Purpose of the Product ##
The purpose of StudyMeets is to create a dedicated platform for UCSB students to connect through study groups and social events, fostering both academic collaboration and social interaction within a safe campus community. The app addresses the challenge of finding like-minded peers by allowing users to discover and join study groups and events based on location, interests, and academic goals. With features such as student ID verification, location-based restrictions, and participant limits, StudyMeets ensures a safe and localized environment for its users. It also provides tools for hosts to create and manage groups, set participation limits, and define access criteria, while attendees can explore customized recommendations and search for groups by tag or topic. Additional features such as friend suggestions, college-specific events, and multiple verification options-including email domain checks and LinkedIn profiles-enhance its usefulness and inclusiveness. By combining academic and social opportunities, StudyMeets aims to strengthen the sense of belonging and collaboration among UCSB students, creating a vibrant and supportive campus experience.

## Intended User Audience ##
### Group Creators: ###
UCSB students looking to create local study or social groups. These users are verified through email and can create new group, add group tags.
### Group Joiners: ###
UCSB students interested in joining study groups that match their location and interests. These users can search for groups and join them after reviewing details such as tags.

## Introduction  ##
// Do we need to write a introduction for this part?

## System Logic Diagram ##
![image](https://github.com/user-attachments/assets/2f0e91a2-6fcf-44f5-92ea-58c3da44cfb9)


## Installation  ##
1. Clone the repository: `git clone https://github.com/ucsb-cs184-f24/team08-StudyMeets.git`
2. Navigate to the StudyMeets directory: `cd StudyMeets`
3. Install dependencies: `npm i`, `npm install`
4. Start the Expo project: `npx expo start`
5. A QR code should pop up in the console; scan it with a mobile device and the application should start up. Alternatively, connect a device via USB or start up a mobile device emulator for the application.

In the future, .apk, .ipa files will be provided for users to directly install the app.

## User Authentication  ##
### Create Account ###
If the user does not have an account yet, he needs to register an account, enter the email address, username, and password to register the account. After registration, the corresponding email address will receive a verification email. Click the verification email, then log in and you can enter the App.

<img src="https://github.com/user-attachments/assets/ccf896f4-84a1-4a45-84e6-7872d9c30989" alt="Create Account" width="200"/>


### Sign In ###
If the user already has an account, he can directly enter the email address and password to enter the App.

<img src="https://github.com/user-attachments/assets/168c822c-661a-41fe-9d5c-396a299b8014" alt="Sign In" width="200"/>

## Explore ##
### Search StudyMeet Group ###
<img src="https://github.com/user-attachments/assets/7dde1c15-84b7-4faa-831c-527f668f1498" alt="Create New StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/ca5efc31-b21b-4fc2-9e8b-f516817a3ced" alt="Create New StudyMeet" width="200"/>

### Create StudyMeet Group ###
<img src="https://github.com/user-attachments/assets/fad31ec9-8d52-41ad-9496-c65c0b844c5e" alt="Explore StudyMeets" width="200"/>
<img src="https://github.com/user-attachments/assets/371749aa-d494-4b9b-91d3-a8e750a45693" alt="Explore StudyMeets" width="200"/>

### Join StudyMeet Group ###
<img src="https://github.com/user-attachments/assets/916f453e-8ad5-4ba7-b1f5-daa06ed33490" alt="Search StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/3635647a-5d08-4fea-9e85-3418b5dbb7fb" alt="Search StudyMeet" width="200"/>

### Search People ###

<img src="https://github.com/user-attachments/assets/8ff62b19-ce7a-4aff-9855-81963ddcaa20" alt="Join StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/bdd420cf-2983-4e84-a32f-86cffc8a16e9" alt="Join StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/f601965e-c722-4b64-8f6c-ddaae045db80" alt="Join StudyMeet" width="200"/>
<img src="https://github.com/user-attachments/assets/9d754330-5318-4259-ad57-62b760fd30df" alt="Join StudyMeet" width="200"/>


## MyGroups ##
### Edit Group You Created ###
### Delete Group You Created ###
### Leave Group You Joined ###


## People ##
### Check Friends, Following, Followers ###
### Change Profile Information ###

## Setting ##
### Check Notification ###
### Change Password ###
### Set Dark Mode ###
### Logout ###

## Known Issues  ##
- Some permission errors can occur when trying to sign in
- Changing the profile picture repeatedly can cause a visual error
- App goes blank when an internal error occurs, and needs to be force stopped

