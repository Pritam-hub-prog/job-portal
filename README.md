\# JobPortal



A full-stack MERN job portal that connects job seekers with recruiters.



\## About the Project



JobPortal is a web-based job recruitment platform where job seekers can create profiles, search for jobs, apply for suitable positions, upload resumes, and track their application status.



Recruiters can create and manage job postings, view applications from candidates, review resumes, and update application statuses.



The project was built using the MERN stack with JWT-based authentication and role-based access control.



\## Features



\### Job Seekers



\- User registration and login

\- Secure JWT authentication

\- Create and update profile

\- Search and view available jobs

\- View detailed job information

\- Apply for jobs

\- Upload resume in PDF format

\- Track submitted applications

\- View application status



\### Recruiters



\- Recruiter registration and login

\- Secure JWT authentication

\- Recruiter dashboard

\- Create job postings

\- View and manage posted jobs

\- Edit job postings

\- Delete job postings

\- View candidate applications

\- View candidate resumes

\- Update application status



\### Security



\- Password hashing using bcrypt

\- JWT-based authentication

\- Role-based authorization

\- Protected API routes

\- Recruiter ownership validation

\- Duplicate application prevention

\- Resume upload validation

\- Environment variables for sensitive configuration



\## Tech Stack



\### Frontend



\- React.js

\- Vite

\- React Router

\- Axios

\- JavaScript

\- CSS



\### Backend



\- Node.js

\- Express.js

\- MongoDB

\- Mongoose

\- JWT

\- bcryptjs

\- Multer



\### Development Tools



\- Git

\- GitHub

\- MongoDB Atlas

\- VS Code



\## Project Structure



```text

job-portal/

│

├── backend/

│   ├── middleware/

│   ├── models/

│   ├── routes/

│   ├── uploads/

│   ├── .env

│   └── server.js

│

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   ├── pages/

│   │   └── App.jsx

│   └── package.json

│

├── .gitignore

└── README.md

