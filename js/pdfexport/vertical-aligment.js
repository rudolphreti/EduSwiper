function mapTableBodies(t) {
  const i = this.findInlineHeight(t, maxWidth, usedWidth);
  return (usedWidth = i.width), i.height;
}
function findInlineHeight(t, i, e = 0) {
  if ((t._offsets && (e += t._offsets.total), t._inlines && t._inlines.length))
    return ((t) => {
      if (!t) return { height: 0, width: 0 };
      let h = 0,
        n = !1;
      for (const a of t)
        (e += a.width) > i || n
          ? ((h += a.height), (e = a.width))
          : (h = Math.max(a.height, h)),
          (n = !!a.lineEnd);
      return { height: h, width: e };
    })(t._inlines);
  if (t.stack && t.stack[0])
    return t.stack
      .map((t) => findInlineHeight(t, i))
      .reduce((t, i) => ({
        height: t.height + i.height,
        width: Math.max(t.width + i.width),
      }));
  if (t.table) {
    let i = 0;
    for (const e of t.table.body) {
      const t = e.map(mapTableBodies);
      i = Math.max(...t, i);
    }
    return { height: i, width: e };
  }
  return t._height
    ? ((e += t._width), { height: t._height, width: e })
    : { height: null, width: e };
}
function applyVerticalAlignment(t, i, e, h = 0) {
  const n = t.table.body[i].map((i, e) => {
      return findInlineHeight(i, t.table.widths[e]._calcWidth).height;
    }),
    a = h ? h[i] : Math.max(...n);
  t.table.body[i].forEach((t, i) => {
    if (n[i] && a > n[i]) {
      let h,
        d = e;
      Array.isArray(e) && (d = e[i]),
        'bottom' === d
          ? (h = a - n[i])
          : 'center' === d && (h = (a - n[i]) / 2),
        h && (t._margin ? (t._margin[1] = h) : (t._margin = [0, h, 0, 0]));
    }
  });
}
