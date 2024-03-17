-- CourseLike
CREATE OR REPLACE FUNCTION update_on_CourseLike_insertion_function()
       RETURNS TRIGGER AS $$
        BEGIN
            UPDATE
                course
            SET
                total_likes = total_likes + 1
            WHERE
                id = NEW.course_id;
            RETURN
                NEW;
        END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_on_CourseLike_insertion_function
    AFTER INSERT ON course_like
    FOR EACH ROW
    EXECUTE FUNCTION update_on_CourseLike_insertion_function();

CREATE OR REPLACE FUNCTION update_on_CourseLike_deletion_function()
    RETURNS TRIGGER AS $$
        BEGIN
            UPDATE
                course
            SET
                total_likes = total_likes - 1
            WHERE
                id = OLD.course_id;
            RETURN OLD;
        END
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_on_CourseLike_deletion_function
    AFTER DELETE ON course_like
    FOR EACH ROW
    EXECUTE FUNCTION update_on_CourseLike_deletion_function();

--> CourseLesson
CREATE OR REPLACE FUNCTION update_on_CourseLesson_insertion_function()
    RETURNS TRIGGER AS $$
        BEGIN
            UPDATE
                course
            SET
                total_lessons = total_lessons + 1,
                updated_at = NEW.created_at
            WHERE
                 id = NEW.course_id;
            RETURN NEW;
        END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_on_CourseLesson_insertion
    AFTER INSERT ON course_lesson
    FOR EACH ROW
    EXECUTE FUNCTION update_on_CourseLesson_insertion_function();

--> Todo: Prevent updating courseId
CREATE OR REPLACE FUNCTION update_on_CourseLesson_updation_function()
    RETURNS TRIGGER AS $$
        BEGIN
            UPDATE
                course
            SET
                total_videos = total_videos + NEW.total_videos - OLD.total_videos,
                total_durations = total_durations + NEW.total_durations - OLD.total_durations
            WHERE
                id = OLD.course_id;
            RETURN NEW;
        END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_on_CourseLesson_updation
    AFTER UPDATE ON course_lesson
    FOR EACH ROW
    EXECUTE FUNCTION update_on_CourseLesson_updation_function();

CREATE OR REPLACE FUNCTION update_on_CourseLesson_deletion_function()
    RETURNS TRIGGER AS $$
        BEGIN
            UPDATE
                course
            SET
                total_lessons = total_lessons - 1,
                total_videos = total_videos - OLD.total_videos,
                total_durations = total_durations - OLD.total_durations
            WHERE
                id = OLD.course_id;
            RETURN OLD;
        END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_on_CourseLesson_deletion
    AFTER DELETE ON course_lesson
    FOR EACH ROW
    EXECUTE FUNCTION update_on_CourseLesson_deletion_function();

--> CourseLessonVideo
CREATE OR REPLACE FUNCTION update_on_CourseLessonVideo_insertion_function()
    RETURNS TRIGGER AS $$
        BEGIN
            UPDATE
                course_lesson
            SET
                total_videos = total_videos + 1,
                total_durations = total_durations + NEW.total_durations,
                updated_at = NEW.created_at
            WHERE
                id = NEW.lesson_id;

            RETURN NEW;
        END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_on_CourseLessonVideo_insertion
    AFTER INSERT ON course_video
    FOR EACH ROW
    EXECUTE FUNCTION update_on_CourseLessonVideo_insertion_function();

--> Todo: Prevent updating lessonId
CREATE OR REPLACE FUNCTION update_on_CourseLessonVideo_updation_function()
    RETURNS TRIGGER AS $$
        BEGIN
            UPDATE
                course_lesson
            SET
                total_durations = total_durations + NEW.total_durations - OLD.total_durations,
                updated_at = NEW.created_at
            WHERE
                id = NEW.lesson_id;
            RETURN NEW;
        END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_on_CourseLessonVideo_updation
    AFTER UPDATE ON course_video
    FOR EACH ROW
    EXECUTE FUNCTION update_on_CourseLessonVideo_updation_function();

CREATE OR REPLACE FUNCTION update_on_CourseLessonVideo_deletion_function()
    RETURNS TRIGGER AS $$
        BEGIN
            UPDATE
                course_lesson
            SET
                total_videos = total_videos - 1,
                total_durations = total_durations - OLD.total_durations
            WHERE
                id = OLD.lesson_id;

            RETURN OLD;
        END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_on_CourseLessonVideo_deletion
    AFTER DELETE ON course_video
    FOR EACH ROW
    EXECUTE FUNCTION update_on_CourseLessonVideo_deletion_function();