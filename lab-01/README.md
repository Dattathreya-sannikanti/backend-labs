# Lab 1: Node.js and Express server
Venkata Datthathreya Sannikanti · [Your Registration Number] · CSE
Live link: Not applicable (Executed locally for this lab)

## How to run
1. Install dependencies: npm install
2. Environment variables: None required
3. Start command: node server.js

## Endpoints
| Method | Path | Description |
| :--- | :--- | :--- |
| GET | / | Welcome text |
| GET | /about | JSON with name and section |
| GET | /time | Current date and time |
| GET | Unknown | Returns a 404 Route Not Found error |

## Screenshots
![Welcome Route](screenshots/welcome.png)
![About Route](screenshots/about.png)
![Time Route](screenshots/time-route.png)
![404 Error Route](screenshots/random.png)

## Notes
Problems faced: Initial difficulty making the browser Network tab display the HTTP status codes.
Solution: Used a hard refresh with cache disabled to force the browser to make a new request, successfully capturing the 200 and 404 status codes.