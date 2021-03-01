export const toSerializable = (data) => {
  return JSON.parse(JSON.stringify(data));
};
