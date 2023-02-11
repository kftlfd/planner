// https://docs.djangoproject.com/en/4.0/ref/csrf/#acquiring-the-token-if-csrf-use-sessions-and-csrf-cookie-httponly-are-false
function csrftoken() {
  const name = "csrftoken";
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

//
// Endpoints and constants
//

// const apiDevUrl = "http://localhost:8000/api/";
// const apiProdUrl = "/api/";
// const baseUrl =
//   process.env.NODE_ENV === "development" ? apiProdUrl : apiProdUrl;
const baseUrl = "/api/";

// const wsDevUrl = "ws://localhost:8000/ws/";
// const wsProdUrl =
//   window.location.protocol.replace("http", "ws") +
//   `//${window.location.host}/ws/`;
// export const baseWsUrl =
//   process.env.NODE_ENV === "development" ? wsDevUrl : wsProdUrl;
export const baseWsUrl =
  window.location.protocol.replace("http", "ws") +
  `//${window.location.host}/ws/`;

export const urls = {
  auth: {
    register: `auth/register/`,
    login: `auth/login/`,
    logout: `auth/logout/`,
  },

  user: {
    details: `user/`,
    projects: `user/projects/`,
    password: `user/password/`,
  },

  project: {
    create: `project/`,
    details: (id: string) => `project/${id}/`,
    tasks: (id: string) => `project/${id}/tasks/`,
    chat: (id: string) => `project/${id}/chat/`,
    sharing: (id: string) => `project/${id}/sharing/`,
    leave: (id: string) => `project/${id}/leave/`,
    join: (code: string) => `project/join/${code}/`,
  },

  task: {
    create: `task/`,
    details: (id: string) => `task/${id}/`,
  },

  chat: `chat/`,
};

export const methods = {
  get: "GET",
  post: "POST",
  patch: "PATCH",
  delete: "DELETE",
} as const;
type RequestMethod = typeof methods[keyof typeof methods];

//
// Queries
//

function getFullUrl(url: string) {
  return baseUrl + url;
}

export async function query<ResponseData>(
  url: string,
  method: RequestMethod,
  body?: any
): Promise<ResponseData> {
  const response = await fetch(getFullUrl(url), {
    method: method,
    headers: {
      "X-CSRFToken": csrftoken() || "",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(await response.text());
  }
}

export async function authQuery(url: string, formData?: FormData) {
  const response = await fetch(getFullUrl(url), {
    method: methods.post,
    headers: { "X-CSRFToken": csrftoken() || "" },
    body: formData,
  });
  if (response.ok) {
    return {
      ok: true,
      user: await response.json(),
    };
  } else if (response.status === 406) {
    return {
      ok: false,
      status: response.status,
      formErrors: await response.json(),
    };
  } else {
    return {
      ok: false,
      status: response.status,
      error: await response.text(),
    };
  }
}

export async function queryNoResponse(
  url: string,
  method: RequestMethod,
  body?: any
) {
  const response = await fetch(getFullUrl(url), {
    method: method,
    headers: {
      "X-CSRFToken": csrftoken() || "",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
}
