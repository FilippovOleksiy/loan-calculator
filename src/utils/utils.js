export const roundUp = (value, fractionDigits) =>
  Number((Math.ceil(value * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits))
    .toFixed(fractionDigits));

export const generateArray = (count, element = {}) => {
  const newArray = [];
  for (let i = 0; i < count; i++) {
    newArray.push(new element.constructor());
  }
  return newArray;
};

export const desc = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

export const getSorting = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}
