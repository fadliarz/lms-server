import { createGenerator, SchemaGenerator } from "ts-json-schema-generator";
import fs from "fs";
import path from "path";

const types = ["CreateCourseDto", "UpdateCourseDto"];

const generator: SchemaGenerator = createGenerator({
  path: path.join(__dirname, "type.ts"),
  tsconfig: path.join(__dirname, "../../../tsconfig.json"),
});

types.forEach((type) => {
  const schema = generator.createSchema(type);
  fs.writeFileSync(`${__dirname}/${type}Schema.json`, JSON.stringify(schema, null, 2));
});
