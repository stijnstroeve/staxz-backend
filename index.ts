import Backend from "./src/Backend";

let backend = new Backend(3000);
backend.start();

//TODO Action logger -> Log action to file
//TODO Database -> Mongodb connection
//TODO Authentication -> Auth + Middleware
//TODO Logging middleware
//TODO External request support
//TODO Write documentation :|