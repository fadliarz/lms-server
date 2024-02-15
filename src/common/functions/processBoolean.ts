export default function processBoolean(value: string | undefined) {
  return value ? /true/i.test(value) : false;
}
