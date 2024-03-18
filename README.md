# Learning Management System | Server Side

## This project is under development


## Architecure | 3-layer Architecture

![Alt text](uploads/4-layer-architecture.png)

## Entitiy Relationship Diagram (ERD)
![img.png](uploads/ERD.png)

## API Documentation

Link: https://lms-server-delta.vercel.app/api-docs/ (In progress)
![img.png](uploads/documentation.png)

## Authorization List

- ### [Enrollment](#Enrollment)

1. #### [Creating Enrollment](#CreatingEnrollment)
2. #### [Updating Enrollment](#UpdatingEnrollment)
3. #### [Deleting Enrollment](#DeletingEnrollment)
4. #### [Updating Role Rule](#UpdatingRoleRule)

- ### [Course](#Course)

1. #### [Creating Course](#CreatingCourse)
2. #### [Fetching Course Including Videos](#FecthingCourseIncludingVideos)
3. #### [Fetching Course Excluding Videos](#FetchingCourseExcludingVideos)
4. #### [Updating Course](#UpdatingCourse)
5. #### [Deleting Course](#Deleting course)

- ### [Lesson/Video](#LessonOrVideo)

1. #### [Creating Lesson/Video](#CreatingLessonOrVideo)
2. #### [Fetching Lesson](#FetchingLesson)
3. #### [Fecthing Video](#FecthingVideo)
4. #### [Updating Lesson/Video](#UpdatingLessonOrVideo)
5. #### [Deleting Lesson/Video](#DeletingLessonOrVideo)

---

## Enrollment

- ### Creating Enrollment

| Role                    | Enrolling for Themselves   | Enrolling for Others       |
|-------------------------|----------------------------|----------------------------| 
| **Student**             | `[STUDENT]`               | `Unauthorized`              
| **Student & Author**    | `InternalServerException` | `InternalServerException` 
| **Instructor**          | `[STUDENT]`               | `Unauthorized`            
| **Instructor & Author** | `Unauthorized`            | `Unauthorized`            
| **Admin**               | `Permitted`               | `Permitted`               
| **Admin & Author**      | `Unauthorized`            | `Permitted`               

- ### Updating Enrollment

| Role & Authorship       | Updating for Themselves   | Updating for Others       |
|-------------------------|---------------------------|---------------------------|
| **Student**             | `Unauthorized`            | `Unauthorized`            |
| **Student & Author**    | `InternalServerException` | `InternalServerException` |
| **Instructor**          | `Unauthorized`            | `Unauthorized`            |
| **Instructor & Author** | `InternalServerException` | `Permitted`               |
| **Admin**               | `Permitted`               | `Permitted`               |
| **Admin & Author**      | `InternalServerException` | `Permitted`               |

- ### Deleting Enrollment

| Role & Authorship       | Deleting for Themselves   | Deleting for Others       |
|-------------------------|---------------------------|---------------------------|
| **Student**             | `Permitted`               | `Unauthorized`            |
| **Student & Author**    | `InternalServerException` | `InternalServerException` |
| **Instructor**          | `Permitted`               | `Unauthorized`            |
| **Instructor & Author** | `InternalServerException` | `Permitted`               |
| **Admin**               | `Permitted`               | `Permitted`               |
| **Admin & Author**      | `InternalServerException` | `Permitted`               |

- ### Updating Role Rule

| Target User Role | STUDENT &rarr; INSTRUCTOR | INSTRUCTOR &rarr; STUDENT |
|------------------|---------------------------|---------------------------|
| **Student**      | `Forbidden`               | `InternalServerException` |
| **Instructor**   | `Permitted`               | `Permitted`               |
| **Admin**        | `Permitted`               | `Permitted`               |

---

## Role

- ### Creating Course

| Role       | Permission     |
|------------|----------------|
| Student    | `Unauthorized` |
| Instructor | `Permitted`    |
| Admin      | `Permitted`    |

- ### Fetching Course/Courses

| Role & Authorship        | Enrolled                  | Unenrolled    |
|--------------------------|---------------------------|---------------|
| **Student**              | `Permitted`               | `Permitted`   |
| **Instructor & !Author** | `Permitted`               | `Permitted`   |
| **Instructor & Author**  | `InternalServerException` | `Permitted`   |
| **Admin & !Author**      | `Permitted`               | `Permitted`   |
| **Admin & Author**       | `InternalServerException` | `Permitted`   |

- ### Updating Course

| Role & Authorship        | Enrolled                  | Unenrolled     |
|--------------------------|---------------------------|----------------|
| **Student**              | `Unauthorized`            | `Unauthorized` |
| **Instructor & !Author** | `[INSTRUCTOR]`            | `Unauthorized` |
| **Instructor & Author**  | `InternalServerException` | `Permitted`    |
| **Admin & !Author**      | `Permitted`               | `Permitted`    |
| **Admin & Author**       | `InternalServerException` | `Permitted`    |

- ### Deleting Course

| Role & Authorship        | Enrolled                  | Unenrolled     |
|--------------------------|---------------------------|----------------|
| **Student**              | `Unauthorized`            | `Unauthorized` |
| **Instructor & !Author** | `Unauthorized`            | `Unauthorized` |
| **Instructor & Author**  | `InternalServerException` | `Permitted`    |
| **Admin & !Author**      | `Permitted`               | `Permitted`    |
| **Admin & Author**       | `InternalServerException` | `Permitted`    |

---

## Lesson / Video

### Creating Lesson / Video

| Role & Authorship        | Enrolled                  | Unenrolled     |
|--------------------------|---------------------------|----------------|
| **Student**              | `Unauthorized`            | `Unauthorized` |
| **Instructor & !Author** | `[INSTRUCTOR]`            | `Unauthorized` |
| **Instructor & Author**  | `InternalServerException` | `Permitted`    |
| **Admin & !Author**      | `Permitted`               | `Permitted`    |
| **Admin & Author**       | `InternalServerException` | `Permitted`    |

### Fetching Lesson

| Role & Authorship        | Enrolled    | Unenrolled  |
|--------------------------|-------------|-------------|
| **Student**              | `Permitted` | `Permitted` |
| **Instructor & !Author** | `Permitted` | `Permitted` |
| **Instructor & Author**  | `InternalServerException`         | `Permitted` |
| **Admin & !Author**      | `Permitted` | `Permitted` |
| **Admin & Author**       | `InternalServerException`         | `Permitted` |

### Fetching Video

| Role & Authorship        | Enrolled    | Unenrolled     |
|--------------------------|-------------|----------------|
| **Student**              | `Permitted` | `Unauthorized` |
| **Instructor & !Author** | `Permitted` | `Unauthorized` |
| **Instructor & Author**  | `-`         | `Permitted`    |
| **Admin & !Author**      | `Permitted` | `Permitted`    |
| **Admin & Author**       | `-`         | `Permitted`    |

### Updating Lesson / Video

| Role & Authorship        | Enrolled       | Unenrolled     |
|--------------------------|----------------|----------------|
| **Student**              | `Unauthorized` | `Unauthorized` |
| **Instructor & !Author** | `[INSTRUCTOR]` | `Unauthorized` |
| **Instructor & Author**  | `-`            | `Permitted`    |
| **Admin & !Author**      | `Permitted`    | `Permitted`    |
| **Admin & Author**       | `-`            | `Permitted`    |

### Deleting Lesson / Video

| Role & Authorship        | Enrolled       | Unenrolled     |
|--------------------------|----------------|----------------|
| **Student**              | `Unauthorized` | `Unauthorized` |
| **Instructor & !Author** | `[INSTRUCTOR]` | `Unauthorized` |
| **Instructor & Author**  | `-`            | `Permitted`    |
| **Admin & !Author**      | `Permitted`    | `Permitted`    |
| **Admin & Author**       | `-`            | `Permitted`    |
