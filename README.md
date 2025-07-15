# API for event management
This is an API for event management.

## ✨ Features
- Create and manage events (with capacity limits)
- Register users for events
- Cancel event registrations
- Prevent double registrations and past-event signups
- View detailed event data with registered users
- List upcoming events with custom sorting
- Track event statistics (total, remaining, percentage)




## Getting started
PREREQUISITS : postgres, node.js
### Clone the repository 
``` git clone https://github.com/Anuptigga/AI-chatbot-api.git```
### Install necessary packages
```bash
cd api
npm i
```
### Start the server
`nodemon server.js`
### Setup the .env file
Replace with your username,password,database for the postgreSQL
`DATABASE_URL= postgresql://<username>:<password>@localhost:5432/<Database>?schema=public`

## Test the api
### Create user
**POST** route: `http://localhost:8000/api/user`

example input
```
{
  "name":"testUser9",
  "email":"test9@gmail.com"
}
```
example output
```
{
    "message": "User created successfully",
    "userId": 6
}
```
### Create event
**POST** route: `http://localhost:8000/api/event/`

example input
```
{
  "title": "Tech Talk",
  "datetime": "2025-09-01T10:00:00Z",
  "location": "Auditorium",
  "capacity": 300
}

```
example output
```
{
    "message": "Event created successfully",
    "eventId": 39
}
```
### Register for event
**POST** route: `http://localhost:8000/api/event/39`

example input
```
{
  "userId":"6"
}

```
example output
```
{
    "message": "Registration successful",
    "registrationId": 5
}
```
### Get event by id
**GET** route: `http://localhost:8000/api/event/39`

example output
```
{
    "event": {
        "id": 39,
        "title": "Tech Talk",
        "datetime": "2025-09-01T10:00:00.000Z",
        "location": "Auditorium",
        "capacity": 300,
        "registrations": [
            {
                "id": 5,
                "userId": 6,
                "eventId": 39,
                "user": {
                    "id": 6,
                    "name": "testUser9",
                    "email": "test9@gmail.com"
                }
            }
        ]
    }
}
```
### Cancel registration
**DELETE** route: `http://localhost:8000/api/event/39`

example input
```
{
  "userId":"6"
}

```
example output
```
{
    "message": "Registration cancelled"
}
```
### Upcoming events
**GET** route: `http://localhost:8000/api/event/`

example output
```
{
    "events": [
        {
            "id": 36,
            "title": "Tech Fest",
            "datetime": "2025-08-01T14:00:00.000Z",
            "location": "Main Hall",
            "capacity": 500
        },
        {
            "id": 39,
            "title": "Tech Talk",
            "datetime": "2025-09-01T10:00:00.000Z",
            "location": "Auditorium",
            "capacity": 300
        },
        {
            "id": 37,
            "title": "Tech East",
            "datetime": "2025-10-01T14:00:00.000Z",
            "location": "Main Hall",
            "capacity": 500
        },
        {
            "id": 38,
            "title": "Tech Chrome",
            "datetime": "2025-11-01T14:00:00.000Z",
            "location": "Main Hall",
            "capacity": 2
        }
    ]
}
```

### See event stats
**GET** route: `http://localhost:8000/api/event/38/stats`

example output
```
{
    "eventId": 38,
    "totalRegistration": 2,
    "remainingCapacity": 0,
    "percentageOfCapacityUsed": 100
}
```