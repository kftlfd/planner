// https://docs.djangoproject.com/en/4.0/ref/csrf/#acquiring-the-token-if-csrf-use-sessions-and-csrf-cookie-httponly-are-false
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const API = {
  root: "/api/",
  auth: "/auth/",
  csrftoken: () => getCookie("csrftoken"),
  register: "/auth/register",
  login: "/auth/login",
  logout: "/auth/logout",
  userProjects: (n) => `/api/user/${n}/`,
  projectCreate: "/api/project/",
  projectDetail: (n) => `/api/project/${n}/`,
  taskCreate: "/api/task/",
  taskDetail: (n) => `/api/task/${n}/`,
};

export default API;
