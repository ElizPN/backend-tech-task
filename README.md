# Backend tech task:

Main domain logic is in `creditDataController.js` .

Module Function: Retrieve credit data based on a given SSN from a database or external API.

Parameters:
- `databaseService`: interacts with the database to check if cached data exists.
- `getCreditData`: retrieves credit data from an external API based on an endpoint and SSN.
- `ssn`: social security number used to retrieve credit data.
- `creditDataResponse`: Express response object used to send the credit data back to the client.

Module Logic:
Check if requested data exists in the DB. If found, send it back to the client.
If not found, retrieve the data from the external API using `getCreditData`
Catch any errors and send an appropriate response to the client.
Cache the data to the DB using `databaseService`.
Send the retrieved data back to the client using the `creditDataResponse` object.

Completed Task Requirements:
- Implemented an asynchronous function named "creditDataController".
- Included a unit test for the module to ensure it works as expected.
- Implemented DB caching by storing the data in an SQLite database and serving subsequent requests from the database.

