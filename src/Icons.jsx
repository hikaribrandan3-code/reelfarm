import React from 'react';
const paths = {
  arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  diagonal: <><path d="M6 18 18 6M6 6h12v12"/></>,
  play: <path d="m9 5 11 7-11 7Z"/>,
  pause: <><path d="M8 5v14M16 5v14"/></>,
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  layers: <><path d="m3 8 9-5 9 5-9 5ZM3 12l9 5 9-5M3 16l9 5 9-5"/></>,
  chat: <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-1 1v-9.5a9 9 0 0 1 18 0Z"/>,
  globe: <><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  plus: <path d="M12 5v14M5 12h14"/>,
  bookmark: <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-4Z"/>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
  video: <><rect x="3" y="6" width="12" height="12" rx="3"/><path d="m15 10 6-3v10l-6-3"/></>,
  mask: <><path d="M4 4c4 3 12 3 16 0v8c0 6-8 9-8 9s-8-3-8-9Z"/><path d="M7 10h2M15 10h2M8 14c2 3 6 3 8 0"/></>,
  cap: <><path d="m2 9 10-5 10 5-10 5ZM6 11v6c4 3 8 3 12 0v-6M22 9v7"/></>,
  cube: <><path d="m12 3 9 5v9l-9 5-9-5V8ZM3 8l9 5 9-5M12 13v9M7 5.5l9 5"/></>,
  clapper: <><rect x="3" y="9" width="18" height="12" rx="3"/><path d="m3 9-1-5 18-3 1 5ZM7 3l-3 5M13 2l-3 5M19 1l-3 5m-6 8 5 3-5 3Z"/></>,
  volume: <><path d="m11 4-5 4H3v8h3l5 4ZM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/></>,
  spark: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/></>,
};
export function Icon({name, size=20, ...props}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.spark}</svg>;
}
export function Sprout({size=30}) {
  return <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 35V21C19 12 25 5 38 5c-1 13-8 19-18 16" fill="#71CB05"/><path d="M20 24C6 24 3 17 2 11c13-2 20 2 18 13Z" fill="#8BDD08"/><path d="M20 36V23c4-7 9-11 14-14M20 27C16 20 10 17 6 15" stroke="#28A407" strokeWidth="2.5" strokeLinecap="round"/></svg>;
}
