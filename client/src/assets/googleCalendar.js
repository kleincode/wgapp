import axios from "../store/axios";
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
var SCOPES = "https://www.googleapis.com/auth/calendar";

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
async function initClient() {
  try {
    await gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    });
    GoogleAuth = gapi.auth2.getAuthInstance();
    // Listen for sign-in state changes.
    GoogleAuth.isSignedIn.listen(updateSigninStatus);

    user = GoogleAuth.currentUser.get();

    // Handle the initial sign-in state.
    updateSigninStatus(GoogleAuth.isSignedIn.get());
  } catch (error) {
    throw Error(error);
  }
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
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

async function createHomeCalendar() {
  await initClient();
  try {
    const { data } = await axios.get("/_/fetchhousehold");
    try {
      const response = await gapi.client.calendar.calendars.insert({
        summary: data.name
      });
      await syncSharing(data.members, response.result.id);
      try {
        await axios.post("/_/addhomecalendar", { id: response.result.id });
        return response.result.id;
      } catch (err) {
        console.error("Error adding calendar to db.", err);
      }
    } catch (err) {
      console.error("Error adding calendar.", err);
    }
  } catch (err) {
    console.error("Error fetching household information.", err);
  }
  return false;
}

// inputMembers: [{firstname: "", gmail:"mail.."}]
// home calendar id
async function syncSharing(inputMembers, calendarId) {
  try {
    console.log("calID: " + calendarId);
    const resACL = await gapi.client.calendar.acl.list({ calendarId });
    console.log(resACL);
    let toDelete = [];
    let toAdd = [];
    let members = inputMembers.map(mem => mem.gmail).filter(mem => mem != "");
    resACL.result.items.forEach(acl => {
      if (
        acl.id.substr(0, 4) == "user" &&
        !acl.id.includes("group.calendar.google.com")
      ) {
        let mail = acl.id.substr(5, acl.id.length - 5);
        if (members.includes(mail)) {
          //already shared
          members.splice(members.indexOf(mail), 1);
        } else {
          toDelete.push(acl);
        }
      }
    });
    toAdd = members;
    console.log("add: ", toAdd);
    console.log("delete: ", toDelete);
    let promises = [];
    toAdd.forEach(add => {
      promises.push(
        gapi.client.calendar.acl.insert({
          calendarId,
          scope: {
            type: "user",
            value: add
          },
          role: "owner"
        })
      );
    });
    toDelete.forEach(del => {
      promises.push(
        gapi.client.calendar.acl.delete({
          calendarId,
          ruleId: del.id
        })
      );
    });
    Promise.all(promises)
      .then(values => {
        //alle übrigen in members: to delete
        console.log(values);
        return true;
      })
      .catch(err => {
        console.error("Error syncing calendar.", err);
      });
  } catch (err) {
    console.error("Error fetching calendar information.", err);
  }
}

export {
  listUpcomingEvents,
  handleAuthClick,
  handleSignoutClick,
  handleClientLoad,
  listCalendars,
  createHomeCalendar,
  syncSharing,
  signedIn,
  gapiLoaded,
  user
};
