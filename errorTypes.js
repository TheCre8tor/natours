/*
 * There are two types of error handling in Express
 * 1. Operational Errors
 * 2. Programming Errors
 *
 * 1. Operational Error:
 * Are problems that we can predict will happen
 * at some point, so we just need to handle them
 * in advance.
 * --> Invalid path accessed
 * --> Invalid user input (validator error from mongoose)
 * --> Failed to connect to server
 * --> Failed to connect to database
 * --> Request timeout
 * Etc...
 *
 * 2. Programming Errors
 * Are bugs we developers introduce into our code.
 * Difficult to find and handle.
 * --> Reading properties on undefined
 * --> Passing a number where an object is expected
 * --> Using await without async
 * --> Using req.query instead of req.body
 * Etc...  */
