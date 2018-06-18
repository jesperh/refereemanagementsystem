# Referee Management System for Kyykkä (Finnish skittles)

Referee management system built for managing the referees of a kyykka tournament.

## Getting Started

Demo available at https://rms-kyykka.herokuapp.com<br/>
User with admin privileges: admin : rul3R<br/>
User with basic privileges: user : regul4R<br/>
<br/>
Login and check https://rms-kyykka.herokuapp.com/admin/map<br/>
This is where the fancy stuff is located

## General info

This application is divided into three parts:

* The referee view: https://rms-kyykka.herokuapp.com, where users can register and modify their info
* The admin view: https://rms-kyykka.herokuapp.com/admin (requires admin privileges), where admins can manage referees, courts, etc.
* The score reporting (mobile) view: https://rms-kyykka.herokuapp.com/tissi, where referees report the scores of games

### Prerequisites

Node v4.1.2

### Installing

After cloning the repository, run

```
npm install
npm start
```

This will download the required dependencies and start the development server at http://localhost:3000

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* AngularJS 1.5.7
* Express 4
* Sequelize v3

## Authors

* **Jesper Haapalinna** - *Initial work*

## License

This project is licensed under the MIT License

## Notes

* This system was built many years ago in a great hurry
* However, it works very well but there is still room for improvements
