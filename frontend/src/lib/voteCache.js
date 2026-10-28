const KEY = 'sunika.votes';

const readAll = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

const writeAll = (obj) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(obj));
  } catch {
    return;
  }
};

export const cachedRating = (id) => Number(readAll()[`r:${id}`]) || 0;

export const cacheRating = (id, value) => writeAll({ ...readAll(), [`r:${id}`]: value });

export const cachedLike = (id) => readAll()[`l:${id}`] === true;

export const cacheLike = (id, liked) => {
  const all = readAll();
  if (liked) all[`l:${id}`] = true;
  else delete all[`l:${id}`];
  writeAll(all);
};
