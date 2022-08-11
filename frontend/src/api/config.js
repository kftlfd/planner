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

export const urls = {
  auth: {
    register: `/auth/register/`,
    login: `/auth/login/`,
    logout: `/auth/logout/`,
  },

  user: {
    details: `/api/user/`,
    projects: `/api/user/projects/`,
    password: `/api/user/password/`,
  },

  project: {
    create: `/api/project/`,
    details: (id) => `/api/project/${id}/`,
    tasks: (id) => `/api/project/${id}/tasks/`,
    chat: (id) => `/api/project/${id}/chat/`,
    sharing: (id) => `/api/project/${id}/sharing/`,
    leave: (id) => `/api/project/${id}/leave/`,
  },

  invite: (code) => `/api/invite/${code}/`,

  task: {
    create: `/api/task/`,
    details: (id) => `/api/task/${id}/`,
  },

  chat: `/api/chat/`,
};

export const methods = {
  get: "GET",
  post: "POST",
  patch: "PATCH",
  delete: "DELETE",
};

export async function query(url, method, body) {
  const response = await fetch(url, {
    method: method,
    headers: {
      "X-CSRFToken": csrftoken(),
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

export async function authQuery(url, formData) {
  const response = await fetch(url, {
    method: methods.post,
    headers: { "X-CSRFToken": csrftoken() },
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

export async function queryNoResponse(url, method, body) {
  const response = await fetch(url, {
    method: method,
    headers: {
      "X-CSRFToken": csrftoken(),
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
}
