import { isAuthenticated } from "../utils/auth";

const auth = (fn) => async (context) => {
  const authenticated = await isAuthenticated(context.req.cookies);
  if (!authenticated) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return await fn(context);
};

export default auth;
