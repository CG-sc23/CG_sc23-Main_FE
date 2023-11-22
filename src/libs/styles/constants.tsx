export const breakpoints = [448, 768, 896, 1024];

export const bpmax = breakpoints.map((bp) => `@media (max-width : ${bp}px)`);

export const bpmin = breakpoints.map((bp) => `@media (min-width : ${bp}px)`);
