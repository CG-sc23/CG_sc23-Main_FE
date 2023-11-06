export const convertGradeToMedal = (grade: number): string | any => {
  const medals = ["🥉", "🥈", "🥇", "🏅", "🎖️"];
  return medals[grade - 1];
};
