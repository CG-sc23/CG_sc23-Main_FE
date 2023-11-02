export type HealthCheckResponse = {
  end_point_ok: boolean;
  api_ok: boolean;
};

export type SignUpResponse = {
  ok: boolean;
  reason?: string;
};
