// client/src/__tests__/api.test.js
import api from "../api";

describe("api helper", () => {
  test("uses localhost baseURL in test environment", () => {

    expect(api.defaults.baseURL).toBe("http://localhost:5000/api");
  });

  test("enables withCredentials", () => {
    expect(api.defaults.withCredentials).toBe(true);
  });

  test("adds Authorization header when token exists", async () => {
  
    localStorage.setItem("token", "test-token-123");

    const handler = api.interceptors.request.handlers[0].fulfilled;

    const config = await handler({ headers: {} });

    expect(config.headers.Authorization).toBe("Bearer test-token-123");

   
    localStorage.removeItem("token");
  });
});
