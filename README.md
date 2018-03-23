# angular-instamap

We would like you to use HTML, CSS and JS to read the Google/Instagram API and display it in an organized way. Feel free to use any frameworks you would like to achieve this task.

Implement a small one-page application, where the user has to login with the Google account. After logging in, the user should see:
  1. Rotating profile picture at the point of user's current location.
  2. Add a marker of 10 recent Instagram photos around you within a 5 km radius.
  3. Display the picture on marker click.

Note: Retrieve current location using JavaScript API.

## Installation

```
npm i
```

## Usage
Command to start webpack-dev-server on localhost:8080
```
npm run start
```


### GeoLocation
Geolocation value was a bit slow and random in my environment so I have set the initial position in Amsterdam. You will have more chances to be 5kms away from your recent Instagram posts.


### Google and Instagram 
- Make sure you are testing on localhost:8080 as it is the url associated to the Google and Instagram APIs.
- Clicking on the Login button on the top right, it will update the pin on the map and get basic user info. Only after login it will be possible to get Instagram images.
- Clicking on the Instagrm Icon on the top left, it will ask to enter the credentials and it will redirect to the page with the token attached. 


### TODO
- Unit testing
- Error message and "No images" message

