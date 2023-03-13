# Lab4_Robin-Cobanov

## Login
You can log in to the page by using any of the default users, or register a new one.
There's a set of default users that can be used.
1. Username: 'id1', password: 'password'. This user has the role STUDENT1
2. Username: 'id2', password: 'password2'. This user has the role STUDENT2
3. Username: 'id3', password: 'password3'. This user has the role TEACHER.
4. Username: 'admin, password: 'admin'. This user has the role ADMIN.

You can also select to register a new user by pressing the registration button.

On sucessful login, your browser will receive a JWT.

## When logged in
Users will be directed to their own route, users/:id. 
Once logged in, you will see a small navigation bar - this bar was added to make it simpler to verify the access of a user.
### User Access
You will have access to different pages based on which role you have.

Student1 only has access to the Student1 page.

Student2 only has access to the Student2 page.

Teacher has access to Student1, Student2 and the Teacher page.

Admin has access to Student1, Student2, Teacher and Admin page.

## JWT
JWT will be sent to the user as a cookie.
The cookie can be found in your browser, below is a link to a chrome instruction.

https://developer.chrome.com/docs/devtools/storage/cookies/





