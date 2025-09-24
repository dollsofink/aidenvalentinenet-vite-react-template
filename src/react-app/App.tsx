import React, { useEffect, useMemo, useRef, useState } from "react";


/**
* TabbedBrowser (JavaScript version)
* ------------------------------------------------------------
* Five fixed tabs that each render an <iframe> to a different site.
* If a site blocks being embedded (X-Frame-Options / frame-ancestors),
* you'll see a helper overlay with an "Open in New Tab" button.
*/


const SITES = [
{ key: "google", title: "Google", url: "https://www.google.com" },
{ key: "clipnuke", title: "ClipNuke", url: "https://clipnuke.org" },
{ key: "yolandi", title: "YOLANDI", url: "https://yolandi.org" },
{ key: "iggy", title: "IGGY.it.com", url: "https://iggy.it.com" },
{ key: "twitter", title: "Twitter", url: "https://twitter.com" },
];


export default function TabbedBrowser() {
const [activeKey, setActiveKey] = useState(SITES[0].key);
const [reloadNonce, setReloadNonce] = useState(0);
const active = useMemo(() => SITES.find((s) => s.key === activeKey), [activeKey]);


return (
<div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col">
{/* Title bar */}
<div className="px-4 py-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center gap-3">
<div className="font-semibold tracking-wide">Tabbed Browser</div>
<div className="text-xs text-slate-400">(5 fixed sites)</div>
</div>


{/* Tabs */}
<div className="px-2 pt-2 flex gap-2 flex-wrap bg-slate-900/60 border-b border-slate-800">
{SITES.map((s) => (
<button
key={s.key}
onClick={() => setActiveKey(s.key)}
className={[
"px-3 py-2 rounded-t-xl text-sm transition-colors",
activeKey === s.key
? "bg-slate-800 text-white shadow"
: "bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/50",
].join(" ")}
title={s.url}
>
{s.title}
</button>
))}
<div className="ml-auto flex items-center gap-2 pr-2">
{active && <OpenBtn href={active.url} />}
<ReloadBtn onReload={() => setReloadNonce((n) => n + 1)} />
</div>
</div>


{/* Address bar */}
<div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2">
<span className="text-xs uppercase text-slate-400">URL</span>
<span className="text-sm truncate text-slate-200" title={active?.url}>{active?.url}</span>
</div>


{/* Iframe stage */}
<div className="flex-1 min-h-0 bg-slate-950/80">
{active && <Frame key={`${active.key}:${reloadNonce}`} url={active.url} />}
</div>
</div>
);
}


function Frame({ url }) {
const [loading, setLoading] = useState(true);
const [assumeBlocked, setAssumeBlocked] = useState(false);
const ref = useRef(null);


useEffect(() => {
setLoading(true);
setAssumeBlocked(false);


// If still "loading" after 2s, show a gentle helper overlay.
const t = setTimeout(() => {
setAssumeBlocked(true);
}, 2000);
return () => clearTimeout(t);
}, [url]);


return (
<div className="relative h-full w-full">
<iframe
