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
	"v",
	"s"
]), n = /* @__PURE__ */ new Set([
	"pd",
	"od",
	"cid"
]), r = {
	e: "en",
	f: "fr",
	a: "ar",
	en: "en",
	fr: "fr",
	ar: "ar",
	eng: "en",
	fra: "fr",
	ara: "ar",
	sr: "sr",
	srp: "sr",
	uk: "uk",
	ua: "uk",
	ukr: "uk",
	zh: "zh",
	zho: "zh",
	chi: "zh",
	cn: "zh",
	de: "de",
	deu: "de",
	ger: "de",
	ru: "ru",
	rus: "ru",
	pl: "pl",
	pol: "pl",
	pt: "pt",
	por: "pt",
	es: "es",
	spa: "es",
	sp: "es",
	fa: "fa",
	fas: "fa",
	fara: "fa",
	ro: "ro",
	ron: "ro"
};
function i(e) {
	let t = e.toLowerCase().split("/").map((e) => e.trim()).filter(Boolean);
	if (t.length === 0 || !t.every((e) => /^[a-z]+$/.test(e))) return;
	let n = t.map((e) => r[e] ?? e);
	return [...new Set(n)].sort().join("-");
}
function a(r, a = "") {
	let o = e(r), s = 0, c = () => o[s], l = () => o[s++], u = l();
	if (u?.kind !== "word" || u.value.toUpperCase() !== "OIML") return null;
	let d = "pub";
	c()?.kind === "punct" && c().value === "-" && o[s + 1]?.kind === "word" && o[s + 1].value.toUpperCase() === "CS" ? (l(), l(), d = "cs") : c()?.kind === "word" && c().value.toUpperCase() === "CS" && (l(), d = "cs");
	let f = l();
	if (f?.kind !== "word") return null;
	let p = f.value.toLowerCase();
	if (d === "cs" ? !n.has(p) : !t.has(p)) return null;
	c()?.kind === "punct" && c().value === "-" && l();
	let m = l();
	if (m?.kind !== "num") return null;
	let h;
	c()?.kind === "punct" && c().value === "-" && o[s + 1]?.kind === "num" && (l(), h = l().value);
	let g, _, v, y;
	for (c()?.kind === "punct" && c().value === ":" && o[s + 1]?.kind === "num" && o[s + 1].value.length === 4 && (l(), g = l().value), c()?.kind === "num" && o[s + 1]?.kind === "word" && /^(st|nd|rd|th)$/i.test(o[s + 1].value) && o[s + 2]?.kind === "word" && o[s + 2].value.toLowerCase() === "edition" && o[s + 3]?.kind === "num" && o[s + 3].value.length === 4 && (_ = l().value, l(), l(), g = l().value);;) {
		if (c()?.kind === "punct" && c().value === "(" && o[s + 1]?.kind === "word" && o[s + 1].value.toLowerCase() === "amendment" && o[s + 2]?.kind === "num") {
			l(), l(), v = l().value, c()?.kind === "punct" && c().value === ")" && l();
			continue;
		}
		if (c()?.kind === "punct" && c().value === "(") {
			let e = 0, t = s, n = [];
			for (; t < o.length && (o[t].kind !== "punct" || o[t].value !== ")" || e !== 1);) {
				if (o[t].kind === "punct" && o[t].value === "(") {
					e++, t++;
					continue;
				}
				if (n.push(o[t].value), t++, e === 1 && o[t]?.kind === "punct" && o[t].value === ")") break;
			}
			if (t < o.length) {
				let e = i(n.join(" "));
				e && (y = e), s = t + 1;
				continue;
			}
		}
		if (c()?.kind === "word" && c().value.toLowerCase() === "amendment") {
			l(), c()?.kind === "punct" && c().value === ":" && o[s + 1]?.kind === "num" ? (l(), v = l().value) : c()?.kind === "num" && (v = l().value);
			continue;
		}
		if (c()?.kind === "word" && c().value.toLowerCase() === "edition" && o[s + 1]?.kind === "num") {
			l();
			let e = l().value;
			e.length === 4 ? g ??= e : _ ??= e;
			continue;
		}
		break;
	}
	return s < o.length ? null : {
		series: d,
		family: p,
		number: m.value,
		...h ? { part: h } : {},
		...g ? { year: g } : a ? { year: a } : {},
		..._ ? { edition: _ } : {},
		...v ? { amendment: v } : {},
		...y ? { language: y } : {}
	};
}
function o(e) {
	let t = e.year ? `:${e.year}` : "", n = e.language ? `:${e.language}` : "";
	if (e.series === "cs") return `urn:oiml:pub:cs:${e.family}-${e.number}${t}${n}`;
	let r = e.part ? `-${e.part}` : "";
	return `urn:oiml:pub:${e.family}:${e.number}${r}${t}${n}`;
}
function s(e, t = "") {
	let n = a(e, t);
	return n ? o(n) : null;
}
//#endregion
export { a as parseOimlPubid, s as urnForIdentifier, o as urnForOimlPubid };
