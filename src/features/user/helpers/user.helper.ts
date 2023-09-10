export function generateFullName(
  firstName: string,
  lastName: string,
  middleName?: string,
) {
  if (!middleName) {
    return `${lastName}, ${firstName}`;
  } else {
    const middleInitial = middleName[0].toUpperCase();
    return `${lastName}, ${firstName} ${middleInitial}.`;
  }
}
