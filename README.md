# Learning Management System | Server Side

## This project is under development

## Architecure | 4-layer Architecture
![Alt text](image-2.png)

## Entitiy Relationship Diagram (ERD)
![Alt text](image-1.png)

## Prisma Schema 
```prisma
model User {
  id           String   @id
  email        String   @unique
  password     String
  accessToken  String?  @map("access_token")
  refreshToken String?  @map("refresh_token")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  role         Role     @default(STUDENT)

  profile Profile?

  courses Course[]

  courseEnrollments CourseEnrollment[]

  @@map("user")
}

model Profile {
  id          String   @id
  phoneNumber String?  @map("phone_number")
  name        String
  avatar      String?  @default("https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg")
  about       String?  @default("Hello world")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user   User   @relation(fields: [userId], references: [id])
  userId String @unique @map("user_id")

  @@map("profile")
}

model CourseEnrollment {
  id String @id

  user     User   @relation(fields: [userId], references: [id])
  userId   String @map("user_id")
  course   Course @relation(fields: [courseId], references: [id])
  courseId String @map("course_id")
  role     Role   @default(STUDENT)

  @@unique([id, userId, role])
  @@map("course_enrollment")
}

model Course {
  id             String   @id
  image          String   @default("https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg")
  title          String
  description    String?
  material       String?
  totalStudents  Int      @default(0) @map("total_students")
  totalPlaylists Int      @default(0) @map("total_playlists")
  totalHours     Int      @default(0) @map("total_hours")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  author   User   @relation(fields: [authorId], references: [id])
  authorId String

  courseEnrollments CourseEnrollment[]

  coursePlaylists CoursePlaylist[]

  @@map("course")
}

model CoursePlaylist {
  id            String @id
  name          String
  totalDuration Int    @default(0)

  course   Course @relation(fields: [courseId], references: [id])
  courseId String @map("course_id")

  courseVideos CourseVideo[]

  @@map("course_playlist")
}

model CourseVideo {
  id            String  @id
  name          String
  description   String?
  totalDuration Int

  coursePlaylist   CoursePlaylist @relation(fields: [coursePlaylistId], references: [id])
  coursePlaylistId String @map("course_playlist_id")

  @@map("course_video")
}

enum Role {
  OWNER
  INSTRUCTOR
  STUDENT
}
```