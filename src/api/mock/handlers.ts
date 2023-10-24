import { http, HttpResponse } from 'msw';

function getTest() {
  return HttpResponse.json({
    ok: true,
  });
}

function handlers() {
  return [http.get('/test', getTest)];
}

export default handlers;
