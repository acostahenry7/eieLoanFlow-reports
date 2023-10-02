import { request } from "../utils/request";

async function loginApi(username, password) {
  try {
    const user = await request({
      method: "POST",
      path: "/signin",
      data: { username, password },
    });

    return user;
  } catch (error) {
    throw error;
  }
}

export { loginApi };
