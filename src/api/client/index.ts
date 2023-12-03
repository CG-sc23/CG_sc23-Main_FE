import { client as http } from '@/api/instance';
import { Advertise } from '@/api/client/ads';
import { SignUp, SignIn, SignOut, Password } from '@/api/client/auth';
import { Deactivate, UserInfo } from '@/api/client/user';
import { Resources } from '@/api/client/resource';
import { GitHub } from '@/api/client/externalHistory';
import { Projects, Milestone, TaskGroup, Task } from '@/api/client/project';
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

  ...Advertise,
  ...SignUp,
  ...SignIn,
  ...SignOut,
  ...Password,
  ...Deactivate,
  ...UserInfo,
  ...Resources,
  ...GitHub,
  ...Projects,
  ...Milestone,
  ...TaskGroup,
  ...Task,
};

export default client;
