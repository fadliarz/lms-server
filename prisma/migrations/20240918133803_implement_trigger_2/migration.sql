--> DepartmentProgram
CREATE OR REPLACE FUNCTION department_program_onInsert()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE
        department
    SET total_programs = total_programs + 1
    WHERE id = NEW.department_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION department_program_onDelete()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE
        department
    SET total_programs = total_programs - 1
    WHERE id = OLD.department_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER department_program_onInsert
    AFTER INSERT
    ON department_program
    FOR EACH ROW
EXECUTE FUNCTION department_program_onInsert();

CREATE TRIGGER department_program_onDelete
    AFTER DELETE
    ON department_program
    FOR EACH ROW
EXECUTE FUNCTION department_program_onDelete();

--> DepartmentProgramEnrollment
CREATE OR REPLACE FUNCTION department_program_enrollment_onInsert()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE
        department
    SET total_program_enrollments = total_program_enrollments + 1
    WHERE id IN (SELECT department_id
                 FROM department_program
                 WHERE id = NEW.program_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION department_program_enrollment_onDelete()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE
        department
    SET total_program_enrollments = total_program_enrollments - 1
    WHERE id IN (SELECT department_id
                 FROM department_program
                 WHERE id = OLD.program_id);
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER department_program_enrollment
    AFTER INSERT
    ON department_program_enrollment
    FOR EACH ROW
EXECUTE FUNCTION department_program_enrollment_onInsert();

CREATE TRIGGER department_program_enrollment_onDelete
    AFTER DELETE
    ON department_program_enrollment
    FOR EACH ROW
EXECUTE FUNCTION department_program_enrollment_onDelete();

--> DepartmentDivision
CREATE OR REPLACE FUNCTION division_onInsert()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE
        department
    SET total_divisions = total_divisions + 1
    WHERE id = NEW.department_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION division_onUpdate()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE
        department
    SET total_members = total_members + NEW.total_members - OLD.total_members
    WHERE id = OLD.department_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION division_onDelete()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE
        department
    SET total_divisions = total_divisions - 1
    WHERE id = OLD.department_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER division_onInsert
    AFTER INSERT
    ON department_division
    FOR EACH ROW
EXECUTE FUNCTION division_onInsert();

CREATE TRIGGER division_onUpdate
    AFTER UPDATE OF total_members
    ON department_division
    FOR EACH ROW
EXECUTE FUNCTION division_onUpdate();

CREATE TRIGGER division_onDelete
    AFTER DELETE
    ON department_division
    FOR EACH ROW
EXECUTE FUNCTION division_onDelete();

--> DepartmentDivisionEnrollment
CREATE OR REPLACE FUNCTION department_division_enrollment_onInsert()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE
        department_division
    SET total_members = total_members + 1
    WHERE id = NEW.division_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION department_division_enrollment_onDelete()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE
        department_division
    SET total_members = total_members - 1
    WHERE id = OLD.division_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER department_division_enrollment_onInsert
    AFTER INSERT
    ON department_division_enrollment
    FOR EACH ROW
EXECUTE FUNCTION department_division_enrollment_onInsert();

CREATE TRIGGER department_division_enrollment_onDelete
    AFTER DELETE
    ON department_division_enrollment
    FOR EACH ROW
EXECUTE FUNCTION department_division_enrollment_onDelete();
