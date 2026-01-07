const els = {
  baseGain: document.getElementById("baseGain"),
  champBonus: document.getElementById("champBonus"),
  jutsu: document.getElementById("jutsu"),
  vip: document.getElementById("vip"),
  extraBuff: document.getElementById("extraBuff"),
  cChamp: document.getElementById("cChamp"),
  eBuff: document.getElementById("eBuff"),
  gTotal: document.getElementById("gTotal"),
  formulaLine: document.getElementById("formulaLine"),
  resetBtn: document.getElementById("resetBtn"),
  copyBtn: document.getElementById("copyBtn"),
};

function num(v, fallback = 0) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

function formatNumber(x) {
  if (!Number.isFinite(x)) return "0";
  // Keep it clean: if it's basically an integer, no decimals.
  const isIntish = Math.abs(x - Math.round(x)) < 1e-9;
  return isIntish ? Math.round(x).toLocaleString() : x.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

function calc() {
  const B = Math.max(0, num(els.baseGain.value, 0));
  const champPct = Math.max(0, num(els.champBonus.value, 0));
  const C = 1 + (champPct / 100);

  const J = num(els.jutsu.value, 1);
  const vipMult = num(els.vip.value, 1);
  const extra = Math.max(0, num(els.extraBuff.value, 1));
  const E = vipMult * extra;

  const G = B * C * J * E;

  els.cChamp.textContent = `${C.toFixed(2)}x`;
  els.eBuff.textContent = `${E.toFixed(2)}x`;
  els.gTotal.textContent = formatNumber(G);

  els.formulaLine.textContent =
    `G = ${B} × ${C.toFixed(2)} × ${J.toFixed(2)} × ${E.toFixed(2)}\n` +
    `  = ${formatNumber(G)}`;
}

function reset() {
  els.baseGain.value = 0;
  els.champBonus.value = 70;
  els.jutsu.value = "1.8";
  els.vip.value = "1";
  els.extraBuff.value = 1.0;
  calc();
}

async function copyResult() {
  const text = `AFSE Stat Gain Result: ${els.gTotal.textContent}`;
  try {
    await navigator.clipboard.writeText(text);
    els.copyBtn.textContent = "Copied ✅";
    setTimeout(() => (els.copyBtn.textContent = "Copy Result"), 1000);
  } catch {
    // Fallback: select/copy not necessary; just show it
    alert(text);
  }
}

["input", "change"].forEach(evt => {
  els.baseGain.addEventListener(evt, calc);
  els.champBonus.addEventListener(evt, calc);
  els.jutsu.addEventListener(evt, calc);
  els.vip.addEventListener(evt, calc);
  els.extraBuff.addEventListener(evt, calc);
});

els.resetBtn.addEventListener("click", reset);
els.copyBtn.addEventListener("click", copyResult);

calc();
