import { isAuthenticatedByManager } from "../utils/auth";

const manager = (fn) => async (context) => {
  const authenticated = await isAuthenticatedByManager(context.req.cookies);
  if (!authenticated) {
    return {
      redirect: {
        destination: "/products",
        permanent: false,
      },
    };
  }
  return await fn(context);
};

export default manager;
