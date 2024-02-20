"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapPrismaQueryRawObject = void 0;
const snakeToCamel = (s) => s.replace(/(_\w)/g, (k) => k[1].toUpperCase());
function mapPrismaQueryRawObject(obj) {
    const mappedObject = Object.entries(obj).reduce((x, [k, v]) => {
        x[snakeToCamel(k)] = v;
        return x;
    }, {});
    return mappedObject;
}
exports.mapPrismaQueryRawObject = mapPrismaQueryRawObject;
