--> CourseEnrollment
CREATE OR REPLACE FUNCTION courseEnrollment_onOperation()
    RETURNS TRIGGER AS
$$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE "user"
        SET total_courses = total_courses + 1
        WHERE id = NEW.user_id;

        IF (NEW.role = 'STUDENT') THEN
            UPDATE course
            SET total_students = total_students + 1
            WHERE id = NEW.course_id;
        ELSIF (NEW.role = 'INSTRUCTOR') THEN
            UPDATE course
            SET total_instructors = total_instructors + 1
            WHERE id = NEW.course_id;
        END IF;

    ELSIF (TG_OP = 'UPDATE') THEN
        IF (NEW.role = OLD.role) THEN
        ELSIF (NEW.role = 'STUDENT') THEN
            UPDATE course
            SET total_students    = total_students + 1,
                total_instructors = total_instructors - 1
            WHERE id = NEW.course_id;
        ELSIF (NEW.role = 'INSTRUCTOR') THEN
            UPDATE course
            SET total_instructors = total_instructors + 1,
                total_students    = total_students - 1
            WHERE id = NEW.course_id;
        END IF;

    ELSIF (TG_OP = 'DELETE') THEN
        IF EXISTS (SELECT 1 FROM course WHERE id = OLD.course_id) THEN
            UPDATE "user"
            SET total_courses = total_courses - 1
            WHERE id = OLD.user_id;

            IF (OLD.role = 'STUDENT') THEN
                UPDATE course
                SET total_students = total_students - 1
                WHERE id = OLD.course_id;
            ELSIF (OLD.role = 'INSTRUCTOR') THEN
                UPDATE course
                SET total_instructors = total_instructors - 1
                WHERE id = OLD.course_id;
            END IF;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER courseEnrollment_onInsert
    AFTER INSERT
    ON course_enrollment
    FOR EACH ROW
EXECUTE PROCEDURE courseEnrollment_onOperation();

CREATE TRIGGER courseEnrollment_onUpdate
    AFTER UPDATE
    ON course_enrollment
    FOR EACH ROW
EXECUTE PROCEDURE courseEnrollment_onOperation();

CREATE TRIGGER courseEnrollment_onDelete
    AFTER DELETE
    ON course_enrollment
    FOR EACH ROW
EXECUTE PROCEDURE courseEnrollment_onOperation();


-- CourseLike
CREATE OR REPLACE FUNCTION like_onInsert()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE
        course
    SET total_likes = total_likes + 1
    WHERE id = NEW.course_id;
    RETURN
        NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION like_onUpdate()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE
        course
    SET total_likes = total_likes - 1
    WHERE id = OLD.course_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER like_onInsert
    AFTER INSERT
    ON course_like
    FOR EACH ROW
EXECUTE FUNCTION like_onInsert();

CREATE TRIGGER like_onUpdate
    AFTER DELETE
    ON course_like
    FOR EACH ROW
EXECUTE FUNCTION like_onUpdate();

--> Course
CREATE OR REPLACE FUNCTION course_onDelete()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE
        "user"
    SET total_courses = total_courses - 1
    WHERE id IN (SELECT user_id
                 FROM course_enrollment
                 WHERE course_id = OLD.id);
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER course_onDelete
    BEFORE DELETE
    ON course
    FOR EACH ROW
EXECUTE FUNCTION course_onDelete();


--> CourseLesson
CREATE OR REPLACE FUNCTION lesson_onInsert()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE
        course
    SET total_lessons = total_lessons + 1
    WHERE id = NEW.course_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION lesson_onUpdate()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE
        course
    SET total_videos      = total_videos + NEW.total_videos - OLD.total_videos,
        total_durations   = total_durations + NEW.total_durations - OLD.total_durations,
        total_attachments = total_attachments + NEW.total_attachments - OLD.total_attachments
    WHERE id = OLD.course_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION lesson_onDelete()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE
        course
    SET total_lessons     = total_lessons - 1,
        total_videos      = total_videos - OLD.total_videos,
        total_durations   = total_durations - OLD.total_durations,
        total_attachments = total_attachments - OLD.total_attachments
    WHERE id = OLD.course_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lesson_onInsert
    AFTER INSERT
    ON course_lesson
    FOR EACH ROW
EXECUTE FUNCTION lesson_onInsert();

CREATE TRIGGER lesson_onUpdate
    AFTER UPDATE OF total_videos, total_durations, total_attachments
    ON course_lesson
    FOR EACH ROW
EXECUTE FUNCTION lesson_onUpdate();

CREATE TRIGGER lesson_onDelete
    AFTER DELETE
    ON course_lesson
    FOR EACH ROW
EXECUTE FUNCTION lesson_onDelete();

--> CourseLessonVideo
CREATE OR REPLACE FUNCTION video_onInsert()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE
        course_lesson
    SET total_videos    = total_videos + 1,
        total_durations = total_durations + NEW.total_durations
    WHERE id = NEW.lesson_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION video_onUpdate()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE
        course_lesson
    SET total_durations = total_durations + NEW.total_durations - OLD.total_durations
    WHERE id = NEW.lesson_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION video_onDelete()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE
        course_lesson
    SET total_videos    = total_videos - 1,
        total_durations = total_durations - OLD.total_durations
    WHERE id = OLD.lesson_id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER video_onInsert
    AFTER INSERT
    ON course_lesson_video
    FOR EACH ROW
EXECUTE FUNCTION video_onInsert();

CREATE TRIGGER video_onUpdate
    AFTER UPDATE OF total_durations
    ON course_lesson_video
    FOR EACH ROW
EXECUTE FUNCTION video_onUpdate();

CREATE TRIGGER video_onDelete
    AFTER DELETE
    ON course_lesson_video
    FOR EACH ROW
EXECUTE FUNCTION video_onDelete();


--> CourseLessonAttachment
CREATE OR REPLACE FUNCTION attachment_onInsert()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE
        course_lesson
    SET total_attachments = total_attachments + 1
    WHERE id = NEW.lesson_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION attachment_onDelete()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE
        course_lesson
    SET total_attachments = total_attachments - 1
    WHERE id = OLD.lesson_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER attachment_onInsert
    AFTER INSERT
    ON course_lesson_attachment
    FOR EACH ROW
EXECUTE FUNCTION attachment_onInsert();

CREATE TRIGGER attachment_onDelete
    AFTER DELETE
    ON course_lesson_attachment
    FOR EACH ROW
EXECUTE FUNCTION attachment_onDelete();