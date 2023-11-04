import { http, HttpResponse, type PathParams } from 'msw';
import type { ReqPostSignUp, ResPostSignUp } from '@/api/type';

async function postSignUp({ request }: { request: Request }) {
  /** For Only Test */
  const forInvalidInput = 'Invalid';
  const forDuplicatedEmail = 'Duplicated@test.com';
  const forDBProblem = 'DBProblem';

  /** CODE */
  const req = (await request.json()) as ReqPostSignUp;

  if (req.name === forInvalidInput) {
    return HttpResponse.json(
      { success: false, reason: 'Invalid request.' },
      { status: 400 },
    );
  }

  if (req.email === forDuplicatedEmail) {
    return HttpResponse.json(
      { success: false, reason: 'User with this email already exists.' },
      { status: 400 },
    );
  }

  if (req.name === forDBProblem) {
    return HttpResponse.json(
      { success: false, reason: 'Error creating user.' },
      { status: 500 },
    );
  }

  return HttpResponse.json({ success: true }, { status: 201 });
}

function handlers() {
  return [
    http.post<PathParams, ReqPostSignUp, ResPostSignUp>(
      'http://43.200.38.207/api/auth/v1/sign-up',
      postSignUp,
    ),
  ];
}

export default handlers;
