# Learning Management System | Server Side

## This project is under development

## Architecure | 4-layer Architecture

![Alt text](4-layer-architecture.png)

## Entitiy Relationship Diagram (ERD)

![Alt text](ERD.png)

## Prisma Schema

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           String   @id @unique
  email        String   @unique
  password     String
  accessToken  String?  @map("access_token")
  refreshToken String?  @map("refresh_token")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  role         Role     @default(STUDENT)

  profile Profile?

  courses           Course[]
  courseEnrollments CourseEnrollment[]
  courseLikes       CourseLike[]

  @@map("user")
}

model Profile {
  id          String   @id @unique
  phoneNumber String?  @map("phone_number")
  name        String
  NIM         String   @map("nim")
  avatar      String?  @default("https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg")
  about       String?  @default("Hello world")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user   User   @relation(fields: [userId], references: [id])
  userId String @unique @map("user_id")

  @@map("profile")
}

model CourseEnrollment {
  id String @id @unique

  user     User   @relation(fields: [userId], references: [id])
  userId   String @map("user_id")
  course   Course @relation(fields: [courseId], references: [id])
  courseId String @map("course_id")
  role     Role   @default(STUDENT)

  @@unique([userId, courseId])
  @@map("course_enrollment")
}

model Course {
  id               String   @id @unique
  image            String   @default("https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg")
  title            String
  description      String?
  material         String?
  totalStudents    Int      @default(0) @map("total_students")
  totalInstructors Int      @default(0) @map("total_instructors")
  totalLessons     Int      @default(0) @map("total_lessons")
  totalDurations   Float    @default(0) @map("total_durations")
  totalLikes       Int      @default(0) @map("total_likes")
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  author   User   @relation(fields: [authorId], references: [id])
  authorId String

  enrollments CourseEnrollment[]
  lessons     CourseLesson[]
  likes       CourseLike[]

  @@map("course")
}

model CourseLesson {
  id             String   @id @unique
  title          String
  description    String?
  totalDurations Decimal  @default(0)
  totalMaterials Int      @default(0)
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  course   Course @relation(fields: [courseId], references: [id])
  courseId String @map("course_id")

  videos CourseLessonVideo[]

  @@map("course_lesson")
}

model CourseLessonVideo {
  id             String   @id @unique
  name           String
  description    String?
  totalDurations Decimal  @default(0)
  youtubeLink    String   @map("youtube_link")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  courseLesson   CourseLesson @relation(fields: [courseLessonId], references: [id])
  courseLessonId String       @map("course_playlist_id")

  @@map("course_video")
}

model CourseLike {
  id String @id @unique

  course   Course @relation(fields: [courseId], references: [id])
  courseId String @map("course_id")
  user     User   @relation(fields: [userId], references: [id])
  userId   String @map("user_id")

  @@unique([courseId, userId])
}

enum Role {
  OWNER
  INSTRUCTOR
  STUDENT
}
```
