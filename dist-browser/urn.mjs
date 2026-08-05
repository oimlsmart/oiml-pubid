//#region src/urn.ts
var e = "urn:oiml:", t = /* @__PURE__ */ new Set([
	"r",
	"d",
	"b",
	"v",
	"g",
	"e",
	"cs"
]), n = /* @__PURE__ */ new Set([
	"clause",
	"sec",
	"fig",
	"tabl",
	"anx",
	"note",
	"contents"
]), r = /* @__PURE__ */ new Set([
	"reqclass",
	"req",
	"confclass",
	"conf",
	"trd",
	"trf",
	"eval"
]), i = {
	r: "Recommendation",
	d: "Document",
	b: "Basic Publication",
	v: "Vocabulary",
	g: "Guide",
	e: "Expert Report",
	cs: "Certification System Publication"
};
function a(t) {
	return t.startsWith(e);
}
function o(n) {
	if (!n.startsWith(e)) return null;
	let i = n.slice(9);
	if (!i.startsWith("pub:")) return null;
	i = i.slice(4);
	let a = i.indexOf("#"), o = a >= 0 ? i.slice(0, a) : i, c = a >= 0 ? i.slice(a + 1) : void 0, l = o.split(":");
	if (l.length < 2) return null;
	let u = l[0], d = l[1];
	if (!t.has(u) || !d || u === "cs" && !/^[a-z]+-\d{2}$/.test(d)) return null;
	let f = l.slice(2), p, m, h;
	if (f.length > 0) {
		let e = f[0];
		if (/^\d{4}$/.test(e)) {
			p = e;
			let t = f.slice(1);
			if (t.length > 0) if (r.has(t[0])) {
				let e = t[0], n = t.length > 1 ? t.slice(1).join(":") : "";
				h = {
					artifactType: e,
					path: n.startsWith("/") ? n.slice(1).split("/").filter(Boolean) : []
				};
			} else m = t.join(":");
		} else if (r.has(e)) {
			let t = e, n = f.length > 1 ? f.slice(1).join(":") : "";
			h = {
				artifactType: t,
				path: n.startsWith("/") ? n.slice(1).split("/").filter(Boolean) : []
			};
		} else m = f.join(":");
	}
	let g;
	return c && (g = s(c)), {
		doctype: u,
		docnumber: d,
		year: p || void 0,
		language: m || void 0,
		fragment: g,
		smartArtifact: h
	};
}
function s(e) {
	if (e.startsWith("term/")) return {
		kind: "term",
		id: e.slice(5)
	};
	if (e === "contents") return {
		kind: "physical",
		type: "contents",
		number: ""
	};
	let t = e.indexOf("-");
	if (t > 0) {
		let r = e.slice(0, t), i = e.slice(t + 1);
		if (n.has(r)) return {
			kind: "physical",
			type: r,
			number: i
		};
	}
}
function c(t) {
	let n = `${e}pub:${t.doctype}:${t.docnumber}`;
	if (t.year && (n += `:${t.year}`), t.language && (n += `:${t.language}`), t.smartArtifact) {
		let e = t.smartArtifact, r = e.path.length > 0 ? `:/${e.path.join("/")}` : ":/";
		n += `:${e.artifactType}${r}`;
	}
	return t.fragment && (n += "#" + l(t.fragment)), n;
}
function l(e) {
	switch (e.kind) {
		case "physical": return e.number ? `${e.type}-${e.number}` : e.type;
		case "term": return `term/${e.id}`;
	}
}
function u(e) {
	let t = o(e);
	if (!t) return e;
	let n = t.doctype.toUpperCase(), { docnumber: r, year: i, fragment: a, smartArtifact: s } = t, c = `OIML ${n} ${r}`, l = i ? `${c}:${i}` : c;
	if (s) return `${l} [SMART ${s.artifactType}/${s.path.join("/")}]`;
	if (!a) return l;
	switch (a.kind) {
		case "physical": {
			let e = a.number;
			switch (a.type) {
				case "tabl": return `${l}, Table ${e}`;
				case "fig": return `${l}, Figure ${e}`;
				case "anx": return `${l}, Annex ${e}`;
				case "sec": return `${l}, Section ${e}`;
				case "note": return `${l}, Note ${e}`;
				case "contents": return `${l}, Contents`;
				default: return `${l}, ${e}`;
			}
		}
		case "term": return `${l}, term "${a.id.replace(/-/g, " ")}"`;
	}
}
function d(e, t) {
	let n = o(e);
	if (!n) return e;
	let r = n.doctype.toUpperCase(), { docnumber: i, fragment: a, smartArtifact: s } = n, c = `${r} ${i}`;
	if (s) return `${s.artifactType}/${s.path.join("/")}`;
	if (!a) return c;
	switch (a.kind) {
		case "physical": {
			let e = a.number;
			switch (a.type) {
				case "tabl": return `${c}, Table ${e}`;
				case "fig": return `${c}, Figure ${e}`;
				case "anx": return `${c}, Annex ${e}`;
				case "contents": return `${c}, Contents`;
				default: return `${c}, ${e}`;
			}
		}
		case "term": return a.id.replace(/-/g, " ");
	}
}
function f(e) {
	let t = o(e);
	if (t?.smartArtifact) return "/" + [t.smartArtifact.artifactType, ...t.smartArtifact.path].join("/");
}
function p(e, t, n, r, i) {
	return c({
		doctype: e,
		docnumber: t,
		year: n,
		fragment: r,
		smartArtifact: i
	});
}
function m(e, t, n, r) {
	return p(e, t, n, {
		kind: "physical",
		type: "clause",
		number: r
	});
}
function h(e, t, n, r) {
	return p(e, t, n, {
		kind: "physical",
		type: "tabl",
		number: r
	});
}
function g(e, t, n, r) {
	return p(e, t, n, {
		kind: "term",
		id: r
	});
}
function _(e, t, n, r, i) {
	return p(e, t, n, void 0, {
		artifactType: "req",
		path: [r, i]
	});
}
function v(e, t, n, r, i) {
	return p(e, t, n, void 0, {
		artifactType: "conf",
		path: [r, i]
	});
}
function y(e, t) {
	let n = o(e);
	if (!n) return null;
	let r = t.match(/^\/(\w+)\/(.+)$/);
	if (!r) return null;
	let [, i, a] = r, s = a.split("/");
	switch (i) {
		case "req": return p(n.doctype, n.docnumber, n.year, void 0, {
			artifactType: s.length > 1 ? "req" : "reqclass",
			path: s
		});
		case "conf": return p(n.doctype, n.docnumber, n.year, void 0, {
			artifactType: s.length > 1 ? "conf" : "confclass",
			path: s
		});
		case "trd": return p(n.doctype, n.docnumber, n.year, void 0, {
			artifactType: "trd",
			path: s
		});
		case "trf": return p(n.doctype, n.docnumber, n.year, void 0, {
			artifactType: "trf",
			path: s
		});
		default: return null;
	}
}
function b(e) {
	return i[e] || e;
}
//#endregion
export { m as buildClauseUrn, v as buildConfUrn, _ as buildReqUrn, h as buildTableUrn, g as buildTermUrn, p as buildUrn, y as deriveUrn, b as doctypeLabel, c as formatOimlUrn, a as isOimlUrn, o as parseOimlUrn, u as urnToCitation, d as urnToShortCitation, f as urnToSmartIdentifier };
