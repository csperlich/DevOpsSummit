Acme Global Summit
========

This is a node.js application that handles event registration for a DevOps conference.

Requirements
------------
This project requires [node.js](https://nodejs.org)<br>
This project requires [mongodb](https://www.mongodb.org/)

Installation (development environment)
------------
```
$ git clone https://github.com/csperlich/DevOpsSummit.git
$ cd DevOpsSummit
$ npm install
```

Before starting the server you will need to create and add a configuration
file at DevOpsSummit/config/env/development.js<br>
The contents of the file should be as follows, with your email and password replaced:
```
module.exports = {
  db: 'mongodb://localhost/acme-summit',
  email: {
    user: '<your-email-address>@gmail.com',
    pass: '<your-password>'
  },
  url: 'http://localhost:8080',
  logging: true
};
```
The email section is necessary for sending confirmation emails to registrants of the event. If you are using a gmail account, you will have to enable [less secure apps](https://support.google.com/accounts/answer/6010255?hl=en).
The rest of the file configures the project.

Also, before we start the server, we have to create the conference event in mongodb:<br>
In one terminal, start mongodb ```$ mongod```<br>
Then in another terminal:
```
$ mongo
> use acme-summit
> db.conferences.insert({"name" : "Acme Global Summit 2016", "address" : "223 Awesome St, Awesome Town, NY 22134, USA", "date":new Date("2015-09-09")});
```
The "name" field must have the exact value, "Acme Global Summit 2016", and the database must be called acme-summit<br><br>
After creating the configuration file and the conference event:<br>
Make sure mongodb is running.<br>
In another terminal, navigate to the project folder and start the server ```$ node server```


Exploring the project as a user
-------------------------------
Point your browser to https://localhost:8080.<br>
You will see tabs to: register, un-register, re-register, and check your reservation status. <br>
If you register or re-register, you will receive a confirmation email. <br>

Creating an admin account (conference organizer)
-------------------------
You will need to create an admin account to explore the admin section.<br>
Point your browser to https://localhost:8080/admin/register<br>
Enter an email and password.<br>
Your admin account will be created but not enabled.<br>
To enable your admin account, in a terminal, while mongdb is running in another terminal:
```
$ mongo
> use acme-summit
> db.admins.update({email:"<your-admin-email>"}, {$set{isValidated:true}});
```
Now your account should be enabled.

Exploring the project as an admin
---------------------------------
Point your browser to https://localhost:8080/admin/login<br>
Enter your email and password<br>
From there you will be able to view all of the attendee information for the event and print out the report.<br>
