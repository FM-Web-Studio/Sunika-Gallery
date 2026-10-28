const seconds = (ts) => ts?.seconds ?? 0;

export const byOrderThenNewest = (a, b) => {
  const ao = typeof a?.order === 'number' ? a.order : Number.POSITIVE_INFINITY;
  const bo = typeof b?.order === 'number' ? b.order : Number.POSITIVE_INFINITY;
  if (ao !== bo) return ao - bo;
  return seconds(b?.createdAt) - seconds(a?.createdAt);
};

export const sortByOrder = (list = []) => [...list].sort(byOrderThenNewest);

export const moveItem = (list, from, to) => {
  if (to < 0 || to >= list.length || from === to) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};
