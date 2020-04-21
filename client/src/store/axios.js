// This file is a helper for exporting a local axios instance.
// Use this instance for all backend calls (need authorization, CORS calls prohibited).
// Use the default axios (import axios from "axios") for online calls.
import axios from "axios";

export default axios.create();
