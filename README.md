# BipHubMobile
A companion application to the biphub platform that uses phonegap build.

##Contributing
As with the main BipHub project, https://github.com/adamfluke/biphub, the
project is being maintained by a generous group of developers.

Please see the trello board for current issues/needed features.
https://trello.com/b/KrmMLQ2l/biphub-project-board

###The developement environment
Because of the nature of a phonegap app, I thought it would be beneficial
to take a moment to walk through setting up the developement environment.
1. You will need the current version of the rails app up and running at localhost:3000.
   (Run the seed file before hand to give you access to pregenerated users)
2. Install the Phonegap CLI app (http://docs.phonegap.com/references/phonegap-cli/install/)
3. Install Xcode if you haven't already (From the App Store)
4. cd to the root of the biphubmobile project folder
5. Add the ios platform to your local version (platforms is ignored in the git repo)
   phonegap platform add ios
6. Build the app
   phonegap build
7. open the xcode project found at ./platforms/ios/BiphubMobile.xcodeproj
8. run the ios simulator from xcode
9. To make changes you need to edit the html/css/js in the top level code in sublime, go to the terminal, build again, go to xcode and run the simulator.