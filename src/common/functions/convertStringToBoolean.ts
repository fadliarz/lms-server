export default function convertStringToBoolean(text: string | undefined) {
  if (text && text.toLowerCase() === "true") {
    return true;
  }

  return false;
}
