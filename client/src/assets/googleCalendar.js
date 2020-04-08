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

var signedIn = false;

/**
 *  On load, called to load the auth2 library and API client library.
 */
async function handleClientLoad(updateG) {
  await gapi.load("client:auth2", initClient);
  updateG();
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
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      },
      function(error) {
        console.error(JSON.stringify(error, null, 2));
      }
    );
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    signedIn = true;
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  console.log("Loging in");
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
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
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
async function listUpcomingEvents(minDate, calIDs, allCalendars) {
  let colors = await listColors();
  if (calIDs.length == 0) {
    return null;
  }
  let items = [];
  for (let i = 0; i < calIDs.length; i++) {
    const response2 = await gapi.client.calendar.events.list({
      calendarId: calIDs[i],
      timeMin: minDate.toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
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
  signedIn
};
