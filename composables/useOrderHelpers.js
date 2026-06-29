export const useOrderHelpers = () => {
  const orderTotal = (o) => {
    const items = (o.order_items || []).reduce((s, i) => s + i.quantity * Number(i.price_snapshot), 0);
    const shipping = o.order_shipping_details?.price_gross || 0;
    return Number((items + shipping).toFixed(2));
  };

  const getInitials = (o) => {
    const a = o.first_name?.[0] || o.email?.[0] || '?';
    const b = o.last_name?.[0] || '';
    return (a + b).toUpperCase();
  };

  const getClientName = (o) => {
    const name = `${o.first_name || ''} ${o.last_name || ''}`.trim();
    return name || o.email || '—';
  };

  const avatarColor = (str = '') => {
    const palette = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899'];
    let h = 0;
    for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
    return palette[Math.abs(h) % palette.length];
  };

  const fmtMoney = (v) =>
    Number(v).toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł';

  const hexAlpha = (hex, a) => {
    const h = hex.replace('#', '').slice(0, 6);
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  };

  const badgeStyle = (color) => ({
    color: '#' + color.replace('#', '').slice(0, 6),
    background: hexAlpha(color, 0.1),
    border: `1px solid ${hexAlpha(color, 0.25)}`,
  });

  const inWindow = (dateStr, from, to) => {
    const d = new Date(dateStr);
    return d >= from && d < to;
  };

  return { orderTotal, getInitials, getClientName, avatarColor, fmtMoney, badgeStyle, inWindow };
};
