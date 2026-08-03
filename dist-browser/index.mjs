//#region src/index.ts
function e(e) {
	let t = [], n = 0, r = e.trim();
	for (; n < r.length;) {
		let e = r[n];
		if (/\s/.test(e)) {
			n++;
			continue;
		}
		if (/[A-Za-z]/.test(e)) {
			let e = n;
			for (; e < r.length && /[A-Za-z/]/.test(r[e]);) e++;
			t.push({
				kind: "word",
				value: r.slice(n, e)
			}), n = e;
		} else if (/[0-9]/.test(e)) {
			let e = n;
			for (; e < r.length && /[0-9]/.test(r[e]);) e++;
			t.push({
				kind: "num",
				value: r.slice(n, e)
			}), n = e;
		} else t.push({
			kind: "punct",
			value: e
		}), n++;
	}
	return t;
}
var t = /* @__PURE__ */ new Set([
	"r",
	"b",
	"d",
	"g",
	"e",
	"v"
]), n = /* @__PURE__ */ new Set([
	"pd",
	"od",
	"cid"
]);
function r(r, i = "") {
	let a = e(r), o = 0, s = () => a[o], c = () => a[o++], l = c();
	if (l?.kind !== "word" || l.value.toUpperCase() !== "OIML") return null;
	let u = "pub";
	s()?.kind === "punct" && s().value === "-" && a[o + 1]?.kind === "word" && a[o + 1].value.toUpperCase() === "CS" ? (c(), c(), u = "cs") : s()?.kind === "word" && s().value.toUpperCase() === "CS" && (c(), u = "cs");
	let d = c();
	if (d?.kind !== "word") return null;
	let f = d.value.toLowerCase();
	if (u === "cs" ? !n.has(f) : !t.has(f)) return null;
	s()?.kind === "punct" && s().value === "-" && c();
	let p = c();
	if (p?.kind !== "num") return null;
	let m;
	s()?.kind === "punct" && s().value === "-" && a[o + 1]?.kind === "num" && (c(), m = c().value);
	let h;
	if (s()?.kind === "punct" && s().value === ":" && a[o + 1]?.kind === "num" && a[o + 1].value.length === 4 && (c(), h = c().value), s()?.kind === "punct" && s().value === "(") {
		let e = 0, t = o;
		for (; t < a.length && (a[t].kind !== "punct" || a[t].value !== ")" || e !== 1) && (a[t].kind === "punct" && a[t].value === "(" && e++, t++, e !== 1 || a[t]?.kind !== "punct" || a[t].value !== ")"););
		t < a.length && (o = t + 1);
	}
	let g;
	s()?.kind === "word" && s().value.toLowerCase() === "edition" && a[o + 1]?.kind === "num" && (c(), g = c().value);
	let _;
	return s()?.kind === "punct" && s().value === "(" && a[o + 1]?.kind === "word" && a[o + 1].value.toLowerCase() === "amendment" && a[o + 2]?.kind === "num" && (c(), c(), _ = c().value, s()?.kind === "punct" && s().value === ")" && c()), o < a.length ? null : {
		series: u,
		family: f,
		number: p.value,
		...m ? { part: m } : {},
		...h ? { year: h } : i ? { year: i } : {},
		...g ? { edition: g } : {},
		..._ ? { amendment: _ } : {}
	};
}
function i(e) {
	let t = e.year ? `:${e.year}` : "";
	if (e.series === "cs") return `urn:oiml:pub:cs:${e.family}-${e.number}${t}`;
	let n = e.part ? `-${e.part}` : "";
	return `urn:oiml:pub:${e.family}:${e.number}${n}${t}`;
}
function a(e, t = "") {
	let n = r(e, t);
	return n ? i(n) : null;
}
//#endregion
export { r as parseOimlPubid, a as urnForIdentifier, i as urnForOimlPubid };
