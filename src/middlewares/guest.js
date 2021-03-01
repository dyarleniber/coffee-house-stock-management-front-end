import { isAuthenticated } from "../utils/auth";

const guest = (fn) => async (context) => {
  const authenticated = await isAuthenticated(context.req.cookies);
  if (authenticated) {
    return {
      redirect: {
        destination: "/products",
        permanent: false,
      },
    };
  }
  return await fn(context);
};

export default guest;
