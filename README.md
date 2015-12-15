# BipHubMobile
A companion application to the biphub platform that uses phonegap build.

## Version 0.0.1 - Prototype
The prototype version of the mobile companion application is done. It meets
most core functionality, logging in, viewing the oldest unanswered observation,
the ablity to use jquery mobile widgets, sliders etc, to answer the observation,
and a notification when the observation que is empty. This application has been
minimally styled in css, and can be used in design interviews in early spring.

##Contributing
As with the main BipHub project, https://github.com/adamfluke/biphub, the
project is being maintained by a generous group of developers.

Please see the trello board for current issues/needed features. The project
is in serious need of a spring cleaning (refactoring). Also, automated testing
hasn't been set up yet, so make sure and manually test all features before putting
in a PR.

https://trello.com/b/KrmMLQ2l/biphub-project-board

###The developement environment
Because of the nature of a phonegap app, I thought it would be beneficial
to take a moment to walk through setting up the developement environment.
<ol>
  <li>You will need the current version of the rails app up and running at localhost:3000. (Run the seed file before hand to give you access to pregenerated users) EDIT: The applicaiton now uses the heroku server. If you are working on the api change the ajax actions back to localhost.</li>
  <li>Install the Phonegap CLI app (http://docs.phonegap.com/references/phonegap-cli/install/)</li>
  <li>Install Xcode if you haven't already (From the App Store)</li>
  <li>cd to the root of the biphubmobile project folder</li>
  <li>Add the ios platform to your local version (platforms is ignored in the git repo)  - phonegap platform add ios</li>
  <li>Build the app  -  phonegap build
  <li>open the xcode project found at ./platforms/ios/BiphubMobile.xcodeproj </li>
  <li>run the ios simulator from xcode, or connect it to your iphone</li>
  <li>To make changes you need to edit the html/css/js in the top level code in sublime, go to the terminal, build again, go to xcode and run the simulator.</li>
</ol>