import { client as http } from '@/api/instance';
import { SignUp, SignIn, SignOut, Password } from '@/api/client/auth';
import { Deactivate, UserInfo } from '@/api/client/user';
import { Resources } from '@/api/client/resource';
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
  ...Password,
  ...Deactivate,
  ...UserInfo,
  ...Resources,
};

export default client;
