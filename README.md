# team08-StudyMeets

Tech Stack: React Native

An app tailored for UCSB students that displays study sessions and events based on location and interests, with student ID verification for full access; hosts can create both study and social sessions, set participant limits, and restrict access by distance to keep it local; additional features include friend recommendations, college-specific events, and options for verifying students through email domains, LinkedIn profiles, or existing campus networks.

User Roles:
- Group creators: Students looking to create study groups in their area. They are verified students.
- Group joiners: Students looking to join interested study groups in their area

## Github IDs
* Luis Miguel: miguel-luis9
* Garvin Young: GarvinYoung
* Tim Choi: tim-choi
* Meron Tesfandrias: MeronDT
* Wesley Chiba: jeffsmithepic
* David Joyner: djoyneruscb
* Kai Han: Kai-Hann

==========================================================

# Installation
# Prerequisites
Users will need to install the Expo framework (51.0.28) before installing the project, along with the dependencies listed in the [Dependencies](#dependencies) section. In the future, binary distributions (.apk, .ipa) will be provided to directly install the app on Android and iOS devices.

# Dependencies
These are the following dependencies used in the project.  
* @react-native-async-storage/async-storage ^1.24.0  
  - A simple, unencrypted, asynchronous, persistent, key-value storage system for React Native.
* @react-native-firebase/app ^21.2.0  
  - The core Firebase library for React Native, required for all Firebase services.
* @react-native-firebase/firestore ^21.2.0  
  - Firebase Firestore library for React Native, providing cloud-based NoSQL database functionality.
* @react-navigation/bottom-tabs ^6.6.1  
  - Adds support for navigation tabs at the bottom of the screen.
* @react-navigation/native ^6.1.18  
  - The core library for React Navigation, providing navigation functionality for React Native apps.
* react-navigation/native-stack ^6.11.0  
  - A stack navigator for React Navigation, providing a way to transition between screens.
* expo ~51.0.28  
  - A framework and platform for universal React applications.
* expo-constants ~17.0.2 
  - Provides system information that remains constant throughout the lifetime of your app.
* expo-image-picker ~16.0.1  
  - Allows the user to pick images and videos from their library or take a photo with the camera.
* expo-linking ~7.0.2  
  - Provides utilities for handling deep links and URLs.
* expo-location ~18.0.1  
  - Provides access to the device's location services.
* expo-status-bar ~2.0.0  
  - A component for controlling the app's status bar appearance.
* firebase ^11.0.1  
  - The Firebase JavaScript SDK, providing backend services for authentication, database, and more.
* react ^18.3.1  
  - A JavaScript library for building user interfaces.
* react-native 0.76.1  
  - A framework for building native apps using React.
* react-native-elements ^3.4.3 
  - A UI toolkit for React Native with customizable components.
* react-native-paper ^5.12.5  
  - A high-quality, standard-compliant Material Design library for React Native.
* react-native-safe-area-context 4.12.0 
  - A library for handling safe area insets in React Native.
* react-native-screens 4.0.0 
  - Provides native primitives to represent screens in React Native.
* tamagui ^1.116.12  
  - A UI kit for React Native and web, providing a consistent design system.
* expo-file-system ~18.3.1  
  - Provides access to the file system on the device.

# Installation Steps
1. Clone the repository: `git clone https://github.com/ucsb-cs184-f24/team08-StudyMeets.git`
2. Navigate to the StudyMeets directory: `cd StudyMeets`
3. Install dependencies: `npm i`, `npm install`
4. Start the Expo project: `npx expo start`
5. A QR code should pop up in the console; scan it with a mobile device and the application should start up. Alternatively, connect a device via USB or start up a mobile device emulator for the application.

In the future, .apk, .ipa files will be provided for users to directly install the app.


# Functionality
* Sign up / Sign in
  - Users can create an account with a username (optional), email, and password combination
  - A verification email is sent to the submitted email when signing up to unlock the new account
* Explore Study Groups
  - Users can browse through a list of study groups to join
  - Each study groups shows their name, location, creation date, and tags that describe what the study group is about
  - Users can search for a study group by name
* Create Study Group
  - Users can create a study group by inputting a title, location, and description
  - Users can also add tags to the study group that describe what the study group is about (ex: Math, Computer Science, Group Development)
* My Study Groups
  - Users can browse through the study groups they created
  - Users can edit their own study groups and change their title, location, description, and tags
* Profile
  - Users can change their profile picture by submitting an image file
  - Users can submit a request email to change their password
  - Users can log out
  - Displays the user's email and username

# Known Problems
- Some permission errors can occur when trying to sign in
- Changing the profile picture repeatedly can cause a visual error
- App goes blank when an internal error occurs, and needs to be force stopped

# Contributing
To contribute to the project, follow these steps:

1. Create your feature branch: `git checkout -b my-new-feature`  
2. Commit your changes: `git commit -am 'Add some feature'`  
3. Push to the branch: `git push origin my-new-feature`  
4. Submit a pull request for the branch

# License
The app license can be found in LICENSE.md of this repository.

# Deployment
For Android, a .apk file is provided in the releases tab [here.](https://github.com/ucsb-cs184-f24/team08-StudyMeets/releases/tag/1.0)
