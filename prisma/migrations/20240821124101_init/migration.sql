-- CreateEnum
CREATE TYPE "Privilege" AS ENUM ('DEPARTMENT', 'DIVISION', 'PROGRAM', 'SCHOLARSHIP', 'COMPETITION', 'REPORT', 'COURSE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'INSTRUCTOR', 'STUDENT');

-- CreateEnum
CREATE TYPE "CourseEnrollmentRole" AS ENUM ('INSTRUCTOR', 'STUDENT');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('PUBLISHED', 'DRAFT');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "access_token" TEXT,
    "phone_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nim" TEXT NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg',
    "about" TEXT,
    "total_courses" INTEGER NOT NULL DEFAULT 0,
    "total_lessons" INTEGER NOT NULL DEFAULT 0,
    "total_unread_messages" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "refresh_token" TEXT[],
    "address" TEXT NOT NULL,
    "blood_type" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "emergency_number" TEXT NOT NULL,
    "hmm" TEXT NOT NULL,
    "hobbies" TEXT NOT NULL,
    "line_id" TEXT NOT NULL,
    "medical_histories" TEXT NOT NULL,
    "ukm" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_assignment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "submission" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "personal_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_enrollment" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "role" "CourseEnrollmentRole" NOT NULL DEFAULT 'STUDENT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "class_id" INTEGER,

    CONSTRAINT "course_enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" SERIAL NOT NULL,
    "status" "CourseStatus" NOT NULL DEFAULT 'PUBLISHED',
    "image" TEXT NOT NULL DEFAULT 'https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "material" TEXT,
    "total_students" INTEGER NOT NULL DEFAULT 0,
    "total_instructors" INTEGER NOT NULL DEFAULT 0,
    "total_lessons" INTEGER NOT NULL DEFAULT 0,
    "total_videos" INTEGER NOT NULL DEFAULT 0,
    "total_durations" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_likes" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_id" INTEGER,
    "category_id" INTEGER,
    "code" TEXT NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_lesson" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "total_videos" INTEGER NOT NULL DEFAULT 0,
    "total_durations" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_materials" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "course_id" INTEGER NOT NULL,

    CONSTRAINT "course_lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_video" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "total_durations" DOUBLE PRECISION NOT NULL,
    "youtube_link" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lesson_id" INTEGER NOT NULL,
    "attachment" TEXT,

    CONSTRAINT "course_video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_like" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "course_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_category" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_class" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "course_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_class_assignment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "submission" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "class_id" INTEGER NOT NULL,

    CONSTRAINT "course_class_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseClassAssignmentCompletion" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "assignment_id" INTEGER NOT NULL,

    CONSTRAINT "CourseClassAssignmentCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_schedule" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "course_id" INTEGER NOT NULL,

    CONSTRAINT "course_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "total_divisions" INTEGER NOT NULL DEFAULT 0,
    "total_members" INTEGER NOT NULL DEFAULT 0,
    "total_programs" INTEGER NOT NULL DEFAULT 0,
    "total_program_enrollments" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leader_id" INTEGER,
    "co_leader_id" INTEGER,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department_division" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "total_members" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "department_id" INTEGER NOT NULL,
    "leader_id" INTEGER,
    "co_leader_id" INTEGER,

    CONSTRAINT "department_division_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department_division_enrollment" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "division_id" INTEGER NOT NULL,

    CONSTRAINT "department_division_enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department_program" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "division_id" INTEGER NOT NULL,

    CONSTRAINT "department_program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department_program_enrollment" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "program_id" INTEGER NOT NULL,

    CONSTRAINT "department_program_enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report" (
    "id" SERIAL NOT NULL,
    "points" DOUBLE PRECISION,
    "performance" DOUBLE PRECISION,
    "participation" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scholarship" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "provider" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "reference" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scholarship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competition" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "organizer" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "reference" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "division_privilege" (
    "id" SERIAL NOT NULL,
    "division_id" INTEGER NOT NULL,
    "privilege" "Privilege" NOT NULL,

    CONSTRAINT "division_privilege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "size" TEXT[],

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_nim_key" ON "user"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "course_enrollment_course_id_user_id_key" ON "course_enrollment"("course_id", "user_id");

-- CreateIndex
CREATE INDEX "course_author_id_idx" ON "course"("author_id");

-- CreateIndex
CREATE INDEX "course_category_id_idx" ON "course"("category_id");

-- CreateIndex
CREATE INDEX "course_video_lesson_id_idx" ON "course_video"("lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_like_user_id_course_id_key" ON "course_like"("user_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_class_title_key" ON "course_class"("title");

-- CreateIndex
CREATE UNIQUE INDEX "department_leader_id_key" ON "department"("leader_id");

-- CreateIndex
CREATE UNIQUE INDEX "department_co_leader_id_key" ON "department"("co_leader_id");

-- CreateIndex
CREATE UNIQUE INDEX "department_division_leader_id_key" ON "department_division"("leader_id");

-- CreateIndex
CREATE UNIQUE INDEX "department_division_co_leader_id_key" ON "department_division"("co_leader_id");

-- CreateIndex
CREATE UNIQUE INDEX "department_division_enrollment_user_id_division_id_key" ON "department_division_enrollment"("user_id", "division_id");

-- CreateIndex
CREATE UNIQUE INDEX "report_user_id_key" ON "report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "division_privilege_division_id_key" ON "division_privilege"("division_id");

-- CreateIndex
CREATE UNIQUE INDEX "division_privilege_division_id_privilege_key" ON "division_privilege"("division_id", "privilege");

-- AddForeignKey
ALTER TABLE "personal_assignment" ADD CONSTRAINT "personal_assignment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollment" ADD CONSTRAINT "course_enrollment_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "course_class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollment" ADD CONSTRAINT "course_enrollment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollment" ADD CONSTRAINT "course_enrollment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "course_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_lesson" ADD CONSTRAINT "course_lesson_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_video" ADD CONSTRAINT "course_video_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "course_lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_like" ADD CONSTRAINT "course_like_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_like" ADD CONSTRAINT "course_like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_class" ADD CONSTRAINT "course_class_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_class_assignment" ADD CONSTRAINT "course_class_assignment_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "course_class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseClassAssignmentCompletion" ADD CONSTRAINT "CourseClassAssignmentCompletion_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseClassAssignmentCompletion" ADD CONSTRAINT "CourseClassAssignmentCompletion_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "course_class_assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_schedule" ADD CONSTRAINT "course_schedule_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_co_leader_id_fkey" FOREIGN KEY ("co_leader_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_division" ADD CONSTRAINT "department_division_co_leader_id_fkey" FOREIGN KEY ("co_leader_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_division" ADD CONSTRAINT "department_division_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_division" ADD CONSTRAINT "department_division_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_division_enrollment" ADD CONSTRAINT "department_division_enrollment_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "department_division"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_division_enrollment" ADD CONSTRAINT "department_division_enrollment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_program" ADD CONSTRAINT "department_program_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_program_enrollment" ADD CONSTRAINT "department_program_enrollment_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "department_program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_program_enrollment" ADD CONSTRAINT "department_program_enrollment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "division_privilege" ADD CONSTRAINT "division_privilege_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "department_division"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
