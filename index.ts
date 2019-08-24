import Backend from "./src/Backend";

Backend.createInstance(3000);
Backend.getInstance().start();

//TODO Action logger -> Log action to file
//TODO External request support
//TODO Type parsing(parameters)
//TODO Write documentation :|
//TODO Create a postman api page