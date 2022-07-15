import API from "./config";

export const projects = {
  async getAll(userId) {
    let response = await fetch(API.userProjects(userId));
    console.log(response);
    if (response.ok) {
      return await response.json();
    } else {
      console.log("throwing error");
      throw new Error(await response.text());
    }
  },
};
