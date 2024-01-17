### What's possible for each Role?
1. STUDENT
- Enrolled on a course as STUDENT
!!! Enrolled on a course as INSTRUCTOR
!!! Owned a course

2. INSTRUCTOR
- Enrolled on a course as STUDENT
- Enrolled on a course as INSTRUCTOR
- Owned a course

3. OWNER/ADMIN
- Enrolled on a course as STUDENT
- Enrolled on a course as INSTRUCTOR
- Owned a course

##### Note:
Allowed: -
Forbidden: !!!

### What happen when switching Role?
1. From INSTRUCTOR to STUDENT
- If they are enrolled on a course as INSTRUCTOR, delete their enrollment
- For owned Course, set the Course status to ARCHIVED
- For Enrollment with role INSTRUCTOR

2. FROM OWNER/ADMIN to STUDENT
- If they are enrolled on a course as INSTRUCTOR, delete their enrollment
- For owned Course, set the Course status to ARCHIVED
- For Enrollment with role INSTRUCTOR



### What's possible for each EnrollmentRole?
1. STUDENT
- Create Like
- Delete Like

2. INSTRUCTOR
!!! Create Like
!!! Delete Like

3. AUTHOR
!!! Create Like
!!! Delete Like

### What happen when switching EnrollmentRole?
1. From STUDENT to INSTRUCTOR
- If they liked a course, delte their like


