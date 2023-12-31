import type { BaseApiResponse } from '@/libs/type/server';

import { server as http } from '@/api/instance';
import { Advertise } from '@/api/server/ads';
import {
  SignUp,
  SocialAuth,
  SignIn,
  SignOut,
  Password,
} from '@/api/server/auth';
import { Deactivate, UserInfo } from '@/api/server/user';
import { Resources } from '@/api/server/resource';
import { GitHub } from '@/api/server/externalHistory';
import { Projects, MileStone, TaskGroup, Task } from '@/api/server/project';
import { Report } from '@/api/server/report';
import { handleApiError } from '@/api/handleError';

const server = {
  async getHealthCheck() {
    try {
      const { data, status } = await http.get<BaseApiResponse>('/');

      return { data, status };
    } catch (e) {
      handleApiError(e);
    }
  },

  ...Advertise,
  ...SignUp,
  ...SignIn,
  ...SignOut,
  ...SocialAuth,
  ...Password,
  ...Deactivate,
  ...UserInfo,
  ...Resources,
  ...GitHub,
  ...Projects,
  ...MileStone,
  ...TaskGroup,
  ...Task,
  ...Report,
};

export default server;
