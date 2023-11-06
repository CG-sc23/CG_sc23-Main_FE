import { client as http } from '@/api/instance';
import { SignUp, SignIn, SignOut } from '@/api/client/auth';
import { handleClientError } from '@/api/handleError';

const client = {
  async healthCheck() {
    try {
      const { data, status } = await http.get('/api');

      return {
        data,
        status,
      };
    } catch (e) {
      handleClientError(e);
    }
  },

  ...SignUp,
  ...SignIn,
  ...SignOut,
};

export default client;
