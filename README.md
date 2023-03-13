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

Once logged in, you will see a small navigation bar - this bar was added to make it simpler to verify the access of a user.
### User Access
You will have access to different pages based on which role you have.
Student1 only has access to the Student1 page.
Student2 only has access to the Student2 page.
Teacher has access to Student1, Student2, Teacher.
Admin has access to Student1, Student2, Teacher, admin.

## JWT
JWT will be sent to the user as a cookie.
The cookie can be found in your browser, below is an example with Chrome

1. Inspect the page
![Inspect the page](https://cookie-script.com/images/blog/chrome-cookies/view1.png)

2. Select the applications tab.
![Select the applications tab](https://cookie-script.com/images/blog/chrome-cookies/view2.png)

3. The cookie is found under the storage tab, under the Cookies header
![The cookie](https://cookie-script.com/images/blog/chrome-cookies/view3.png)



