// import { GetCoursesQuery } from "../../modules/course/course.type";
//
// export default function getCoursesIncludeQuery(query: GetCoursesQuery) {
//   const { include_author, include_category } = query;
//
//   const courseIncludeArg = {
//     author: include_author
//       ? {
//           /**
//            * id, name, NIM
//            */
//           select: {
//             id: true,
//             name: true,
//             NIM: true,
//           },
//         }
//       : undefined,
//     category: include_category
//       ? {
//           select: {
//             title: true,
//           },
//         }
//       : undefined,
//   };
//
//   return courseIncludeArg;
// }
