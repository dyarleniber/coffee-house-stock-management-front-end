import { objectForEach } from "./object";

export const toFormData = (data) => {
  let formData = new FormData();
  objectForEach(data, (key, value) => {
    const type = typeof value;
    switch (type) {
      case "object":
        if (value instanceof FileList) {
          if (value.length > 0) {
            formData.append(key, value[0]);
          }
        } else {
          if (value) {
            formData.append(key, JSON.stringify(value));
          }
        }
        break;
      default:
        formData.append(key, value);
        break;
    }
  });
  return formData;
};
