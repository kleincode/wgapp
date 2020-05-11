/* global gapi */
// Client ID and API key from the Developer Console
var CLIENT_ID =
  "175332090206-9olusr4jpp5q5uk0mlibbbgkm359frte.apps.googleusercontent.com";
var API_KEY = "AIzaSyDyw_4pPRYlJ0QjbqMAgPYDZ55agoAK33k";

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var GoogleAuth;

var signedIn = false;
var gapiLoaded = false;
var onSignedIn = null,
  onNotSignedIn = null;
var user = null;

/**
 *  On load, called to load the auth2 library and API client library.
 */
async function handleClientLoad(signedInCallback, notSignedInCallback) {
  onSignedIn = signedInCallback;
  onNotSignedIn = notSignedInCallback;
  gapiLoaded = true;
  gapi.load("client:auth2", initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    })
    .then(
      function() {
        GoogleAuth = gapi.auth2.getAuthInstance();
        // Listen for sign-in state changes.
        GoogleAuth.isSignedIn.listen(updateSigninStatus);

        user = GoogleAuth.currentUser.get();

        // Handle the initial sign-in state.
        updateSigninStatus(GoogleAuth.isSignedIn.get());
      },
      function(error) {
        throw Error(error);
      }
    );
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  console.log(isSignedIn);
  signedIn = isSignedIn;
  if (isSignedIn) {
    if (onSignedIn) onSignedIn();
  } else if (onNotSignedIn) onNotSignedIn();
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(signedInCallback, notSignedInCallback) {
  onSignedIn = signedInCallback;
  onNotSignedIn = notSignedInCallback;
  console.log("Logging in");
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(notSignedInCallback) {
  onNotSignedIn = notSignedInCallback;
  console.log("Sign out");
  gapi.auth2.getAuthInstance().signOut();
}

async function listCalendars() {
  const response = await gapi.client.calendar.calendarList.list({});
  return response.result.items;
}

async function listColors() {
  const response = await gapi.client.calendar.colors.get({});
  return response.result.calendar;
}

/**
 * Returns all events in the requested range
 */
async function listUpcomingEvents(minDate, maxDate, calIDs, allCalendars) {
  let colors = await listColors();
  if (calIDs.length == 0) {
    return null;
  }
  let items = [];
  for (let i = 0; i < calIDs.length; i++) {
    const response2 = await gapi.client.calendar.events.list({
      calendarId: calIDs[i],
      timeMin: minDate.toISOString(),
      timeMax: maxDate.toISOString(),
      showDeleted: false,
      singleEvents: true,
      orderBy: "startTime"
    });
    let tempItems = response2.result.items;
    tempItems.forEach(item => {
      item.color = colors[allCalendars[i].colorId].background;
    });
    items = items.concat(tempItems);
  }
  return items;
}

export {
  listUpcomingEvents,
  handleAuthClick,
  handleSignoutClick,
  handleClientLoad,
  listCalendars,
  signedIn,
  gapiLoaded,
  user
};
