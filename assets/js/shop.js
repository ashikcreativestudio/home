/* Ashik Creative Studio — শপ, কার্ট, চেকআউট, ট্র্যাক */

/* =====================================================
   shop.js — প্যাকেজ শপ, কার্ট, চেকআউট, অর্ডার ট্র্যাক
   ===================================================== */
(function () {
  'use strict';
  var C = window.SHOP_CONFIG, DB = window.DB;
  if (!C || !DB) return;

  var q = function (s, r) { return (r || document).querySelector(s); };
  var qa = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var money = function (n) { return C.currency + Number(n).toLocaleString('en-US'); };
  var wa = function (msg) { return 'https://wa.me/' + C.whatsapp + (msg ? '?text=' + encodeURIComponent(msg) : ''); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var tt;
  function toast(m) {
    var t = q('#toast'); if (!t) { alert(m); return; }
    t.textContent = m; t.classList.add('show'); clearTimeout(tt);
    tt = setTimeout(function () { t.classList.remove('show'); }, 2400);
  }
  function copy(text) {
    var done = function () { toast('কপি হয়েছে ✔'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { toast(text); });
    else toast(text);
  }
  function normPhone(v) {
    var d = String(v || '').replace(/\D/g, '');
    if (d.indexOf('880') === 0) d = '0' + d.slice(3);
    if (d.length === 10 && d[0] === '1') d = '0' + d;
    return d;
  }
  var validPhone = function (p) { return /^01[3-9]\d{8}$/.test(p); };
  var fmtDate = function (t) {
    try { return new Date(t).toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' }); }
    catch (e) { return new Date(t).toLocaleString(); }
  };

  /* ---------- কার্ট ---------- */
  var cart = {};
  try { cart = JSON.parse(store.get('ac_cart') || '{}') || {}; } catch (e) { cart = {}; }
  function prod(id) { return C.products.filter(function (p) { return p.id === id; })[0]; }
  function cleanCart() { Object.keys(cart).forEach(function (id) { if (!prod(id) || !(cart[id] > 0)) delete cart[id]; }); }
  function saveCart() { cleanCart(); store.set('ac_cart', JSON.stringify(cart)); updBadge(); }
  function cartCount() { return Object.keys(cart).reduce(function (s, k) { return s + cart[k]; }, 0); }
  function cartTotal() { return Object.keys(cart).reduce(function (s, k) { var p = prod(k); return s + (p ? p.price * cart[k] : 0); }, 0); }
  function updBadge() {
    var n = q('#cartN'); if (!n) return;
    n.textContent = cartCount(); n.classList.remove('bump'); void n.offsetWidth; n.classList.add('bump');
  }

  /* ---------- শপ গ্রিড ---------- */
  var cat = 'all', term = '';
  function renderCats() {
    var box = q('#shopCats'); if (!box) return; box.innerHTML = '';
    Object.keys(C.categories).forEach(function (k) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'chip' + (k === cat ? ' on' : ''); b.textContent = C.categories[k];
      b.onclick = function () { cat = k; renderCats(); renderGrid(); };
      box.appendChild(b);
    });
  }
  function renderGrid() {
    var g = q('#shopGrid'); if (!g) return;
    var t = term.toLowerCase();
    var list = C.products.filter(function (p) {
      return (cat === 'all' || p.cat === cat) && (!t || (p.name + ' ' + p.desc).toLowerCase().indexOf(t) > -1);
    });
    if (!list.length) { g.innerHTML = '<div class="muted" style="grid-column:1/-1">😕 কোনো প্যাকেজ পাওয়া যায়নি। WhatsApp এ জিজ্ঞেস করুন।</div>'; return; }
    g.innerHTML = list.map(function (p) {
      var inCart = cart[p.id] > 0;
      return '<div class="pcard" style="--c:' + esc(p.c) + '"><div class="pic">' + p.ic + '</div><h3>' + esc(p.name) + '</h3><p>' + esc(p.desc) +
        '</p><div class="pfoot"><div class="price">' + money(p.price) + '</div><button type="button" class="padd' + (inCart ? ' in' : '') + '" data-id="' + esc(p.id) + '">' +
        (inCart ? '✔ কার্টে আছে (' + cart[p.id] + ')' : '🛒 কার্টে যোগ করুন') + '</button></div></div>';
    }).join('');
    qa('.padd', g).forEach(function (b) {
      b.onclick = function () { cart[b.dataset.id] = (cart[b.dataset.id] || 0) + 1; saveCart(); renderGrid(); toast('কার্টে যোগ হয়েছে ✔'); };
    });
  }
  function renderPayBar() {
    var box = q('#payBar'); if (!box) return;
    var pms = Object.keys(C.payment).filter(function (k) { return C.payment[k].number; });
    box.innerHTML = '<h3>💳 পেমেন্ট করবেন যেভাবে</h3><ol><li>পছন্দের প্যাকেজ কার্টে যোগ করুন।</li>' +
      '<li>নিচের যেকোনো নম্বরে <b>Send Money</b> করুন।</li><li>চেকআউটে Transaction ID (TrxID) দিয়ে অর্ডার কনফার্ম করুন।</li>' +
      '<li>পেমেন্ট যাচাই হলেই কাজ শুরু হবে — অবস্থা দেখুন <b>ট্র্যাক</b> বাটনে।</li></ol><div class="pms">' +
      pms.map(function (k) {
        var p = C.payment[k];
        return '<div class="pm" style="--pc:' + esc(p.color) + '">' + (p.logo ? '<img class="pml" src="' + p.logo + '" alt="' + esc(p.name) + '">' : '') + '<div><b>' + esc(p.name) + ' (' + esc(p.type) + ')</b><span>' + esc(p.number) +
          '</span></div><button type="button" data-copy="' + esc(p.number) + '">কপি</button></div>';
      }).join('') + '</div>';
    qa('[data-copy]', box).forEach(function (b) { b.onclick = function () { copy(b.dataset.copy); }; });
    if (!pms.length) box.style.display = 'none';
  }

  /* ---------- মোডাল ---------- */
  function modal(id) {
    var ov = q('#' + id);
    if (!ov) {
      ov = document.createElement('div'); ov.className = 'sov'; ov.id = id;
      ov.innerHTML = '<div class="sbox" role="dialog" aria-modal="true"><button type="button" class="sx" aria-label="বন্ধ করুন">×</button><div class="mb"></div></div>';
      document.body.appendChild(ov);
      ov.addEventListener('click', function (e) { if (e.target === ov) closeModal(ov); });
      q('.sx', ov).onclick = function () { closeModal(ov); };
    }
    return ov;
  }
  function openModal(ov) { ov.classList.add('show'); document.body.style.overflow = 'hidden'; ov.scrollTop = 0; }
  function closeModal(ov) { ov.classList.remove('show'); if (!qa('.sov.show').length) document.body.style.overflow = ''; }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') qa('.sov.show').forEach(closeModal); });

  /* ---------- পেমেন্ট রশিদ ---------- */
  var LOGO = 'assets/img/logo.webp';
  var RCSS = '*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;padding:16px;background:#fff;color:#0b2a6b}.rcpt{border:2px dashed #16a34a;border-radius:16px;overflow:hidden;max-width:520px;margin:auto}.rh{display:flex;align-items:center;gap:10px;background:#0b2a6b;color:#fff;padding:12px 14px;-webkit-print-color-adjust:exact;print-color-adjust:exact}.rh img{width:40px;height:40px;border-radius:50%}.rh b{display:block}.rb{padding:6px 14px 12px}.rr{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px dotted #aab}.rr span:first-child{color:#667}.rr span:last-child{font-weight:700;text-align:right}.pst{margin:12px 0;padding:10px;border-radius:12px;background:#dcfce7;color:#14532d;font-weight:700;text-align:center}.pst.wait{background:#fef3c7;color:#78350f}.pn{font-size:12px;color:#667;text-align:center;padding:0 14px 12px}';
  function statusLabel(o) { var s = C.statuses.filter(function (x) { return x.k === o.status; })[0]; return s ? s.l : ''; }
  function receiptHTML(o) {
    var pm = o.method && o.method !== 'later' ? C.payment[o.method] : null;
    var rows = function (a, b, cls) { return '<div class="rr ' + (cls || '') + '"><span>' + a + '</span><span>' + b + '</span></div>'; };
    return '<div class="rcpt" id="rcpt"><div class="rh"><img src="' + LOGO + '" alt=""><div><b>Ashik Creative Studio</b><small>পেমেন্ট ও অর্ডার রশিদ</small></div></div><div class="rb">' +
      rows('অর্ডার নম্বর', esc(o.id)) + rows('তারিখ', esc(fmtDate(o.createdAt))) + rows('নাম', esc(o.name)) + rows('মোবাইল', esc(o.phone)) +
      (o.items || []).map(function (i) { return rows(esc(i.name) + ' × ' + esc(i.qty), money(i.price * i.qty)); }).join('') +
      rows('মোট বিল', money(o.total), 'big') +
      (pm ? rows('পেমেন্ট মাধ্যম', (pm.logo ? '<img src="' + pm.logo + '" alt="" style="width:22px;height:22px;border-radius:6px;vertical-align:middle;margin-right:6px">' : '') + esc(pm.name) + ' ' + esc(pm.type)) + rows('টাকা পাঠানো হয়েছে', esc(pm.number)) + rows('Transaction ID', '<span style="font-family:monospace">' + esc(o.trxId) + '</span>')
          : rows('পেমেন্ট মাধ্যম', 'পরে দেওয়া হবে')) +
      rows('অর্ডার স্ট্যাটাস', esc(statusLabel(o))) +
      '<div class="pst ' + (pm ? '' : 'wait') + '">' + (pm ? '✅ পেমেন্ট কমপ্লিট — TrxID জমা হয়েছে, যাচাই শেষে কাজ শুরু হবে' : '⏳ পেমেন্ট বাকি — পেমেন্টের পর WhatsApp এ জানান') + '</div></div>' +
      '<div class="pn">TrxID মিলিয়ে দেখার পর আমরা অর্ডার কনফার্ম করব। এই রশিদটি সংরক্ষণ করুন।</div></div>';
  }
  function printReceipt(o) {
    var w = window.open('', '_blank'); if (!w) { toastMsg('পপআপ ব্লক করা আছে — অনুমতি দিন'); return; }
    w.document.write('<!doctype html><meta charset="utf-8"><title>Receipt ' + esc(o.id) + '</title><style>' + RCSS + '</style>' + receiptHTML(o) + '<script>setTimeout(function(){print()},400)<\/script>');
    w.document.close();
  }
  function toastMsg(m) { var t = q('#toast'); if (t) { t.textContent = m; t.classList.add('show'); setTimeout(function () { t.classList.remove('show'); }, 2200); } }

  /* ---------- অর্ডার সম্পন্ন — আলাদা পূর্ণ পৃষ্ঠা ---------- */
  function openDonePage() {
    var pg = q('#donePage');
    if (!pg) { pg = document.createElement('div'); pg.id = 'donePage'; pg.className = 'dpage'; document.body.appendChild(pg); }
    pg.style.display = 'block'; pg.scrollTop = 0; document.body.style.overflow = 'hidden';
    try { if (location.hash !== '#order-success') history.pushState(null, '', '#order-success'); } catch (e) {}
    window.scrollTo(0, 0); return pg;
  }
  function closeDonePage() {
    var pg = q('#donePage'); if (pg) { pg.style.display = 'none'; pg.innerHTML = ''; }
    if (!qa('.sov.show').length) document.body.style.overflow = '';
    try { if (location.hash === '#order-success') history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    window.scrollTo(0, 0);
  }
  window.addEventListener('popstate', function () { if (location.hash !== '#order-success') { var pg = q('#donePage'); if (pg && pg.style.display === 'block') closeDonePage(); } });

  /* ---------- কার্ট মোডাল ---------- */
  function openCart() {
    var ov = modal('cartOv'), mb = q('.mb', ov); openModal(ov); viewCart();
    function viewCart() {
      cleanCart(); var ids = Object.keys(cart);
      if (!ids.length) {
        mb.innerHTML = '<h3>🛒 আপনার কার্ট</h3><div class="muted">কার্ট খালি। সেবা বেছে নিয়ে কার্টে যোগ করুন।</div><a class="btn btn-yellow" href="#shop" id="goShop">🛍️ প্যাকেজ দেখুন</a>';
        q('#goShop', mb).onclick = function () { closeModal(ov); };
        return;
      }
      mb.innerHTML = '<h3>🛒 আপনার কার্ট</h3>' + ids.map(function (id) {
        var p = prod(id);
        return '<div class="crow"><div class="ci">' + p.ic + '</div><div class="cn"><b>' + esc(p.name) + '</b><span>' + money(p.price) + '</span></div>' +
          '<div class="qty"><button type="button" data-m="' + id + '" aria-label="কমান">−</button><i>' + cart[id] + '</i><button type="button" data-p="' + id + '" aria-label="বাড়ান">+</button></div>' +
          '<button type="button" class="rm" data-r="' + id + '" aria-label="মুছুন">🗑</button></div>';
      }).join('') + '<div class="tot"><span>মোট</span><span>' + money(cartTotal()) + '</span></div>' +
        '<button type="button" class="btn btn-wa" id="toCk">✅ অর্ডার করতে এগিয়ে যান</button>';
      qa('[data-m]', mb).forEach(function (b) { b.onclick = function () { cart[b.dataset.m]--; saveCart(); renderGrid(); viewCart(); }; });
      qa('[data-p]', mb).forEach(function (b) { b.onclick = function () { cart[b.dataset.p]++; saveCart(); renderGrid(); viewCart(); }; });
      qa('[data-r]', mb).forEach(function (b) { b.onclick = function () { delete cart[b.dataset.r]; saveCart(); renderGrid(); viewCart(); }; });
      q('#toCk', mb).onclick = viewCheckout;
    }

    function viewCheckout() {
      var pms = Object.keys(C.payment).filter(function (k) { return C.payment[k].number; });
      var saved = {}; try { saved = JSON.parse(store.get('ac_cust') || '{}'); } catch (e) {}
      mb.innerHTML = '<h3>📝 অর্ডার কনফার্ম করুন</h3>' +
        '<div class="tot" style="padding-top:0"><span>মোট বিল</span><span>' + money(cartTotal()) + '</span></div>' +
        '<form id="ckf" novalidate>' +
        '<label class="l" for="ckn">আপনার নাম *</label><input class="fld" id="ckn" autocomplete="name" maxlength="80" value="' + esc(saved.name || '') + '">' +
        '<label class="l" for="ckp">মোবাইল নম্বর * (যেমন 017XXXXXXXX)</label><input class="fld" id="ckp" type="tel" inputmode="numeric" autocomplete="tel" maxlength="16" value="' + esc(saved.phone || '') + '">' +
        '<label class="l">পেমেন্ট পদ্ধতি</label><div class="mopts">' +
        pms.map(function (k, i) { return '<label class="mopt"><input type="radio" name="pm" value="' + k + '"' + (i === 0 ? ' checked' : '') + '><span>' + (C.payment[k].logo ? '<img class="pml s" src="' + C.payment[k].logo + '" alt="">' : '') + esc(C.payment[k].name) + '</span></label>'; }).join('') +
        '<label class="mopt"><input type="radio" name="pm" value="later"' + (pms.length ? '' : ' checked') + '><span>পরে দেব</span></label></div>' +
        '<div class="payinfo" id="pinfo"></div>' +
        '<div id="trxw"><label class="l" for="ckt">Transaction ID (TrxID) *</label><input class="fld" id="ckt" autocomplete="off" maxlength="20" placeholder="যেমন 8N7A6D5E4C"></div>' +
        '<label class="l" for="ckm">কাজের বিস্তারিত / মন্তব্য</label><textarea class="fld" id="ckm" rows="3" maxlength="500" placeholder="আপনার প্রয়োজন সংক্ষেপে লিখুন..."></textarea>' +
        '<div class="errmsg" id="cke"></div>' +
        '<button class="btn btn-wa" type="submit" id="cks">🚀 অর্ডার সাবমিট করুন</button>' +
        '<button class="btn ghost" type="button" id="ckb">← কার্টে ফিরে যান</button></form>';
      var f = q('#ckf', mb), pinfo = q('#pinfo', mb), trxw = q('#trxw', mb);
      function pmSel() { return q('input[name=pm]:checked', f).value; }
      function updPm() {
        var m = pmSel();
        if (m === 'later') {
          pinfo.innerHTML = 'পেমেন্ট পরে করতে পারেন। অর্ডার সাবমিটের পর WhatsApp এ আমাদের জানান — আমরা পেমেন্টের নিয়ম জানিয়ে দেব।'; trxw.style.display = 'none';
        } else {
          var p = C.payment[m]; trxw.style.display = '';
          pinfo.innerHTML = (p.logo ? '<img class="pml" src="' + p.logo + '" alt="" style="float:left;margin-right:10px">' : '') + '<b>' + esc(p.name) + ' ' + esc(p.type) + ':</b> <b>' + esc(p.number) + '</b><button type="button" id="cpn">কপি</button><br>এই নম্বরে <b>' + money(cartTotal()) + '</b> Send Money করে নিচে TrxID দিন।';
          q('#cpn', pinfo).onclick = function () { copy(p.number); };
        }
      }
      qa('input[name=pm]', f).forEach(function (r) { r.onchange = updPm; }); updPm();
      q('#ckb', mb).onclick = viewCart;
      f.onsubmit = function (e) {
        e.preventDefault();
        var nm = q('#ckn', f), ph = q('#ckp', f), tx = q('#ckt', f), er = q('#cke', f);
        [nm, ph, tx].forEach(function (x) { x.classList.remove('bad'); }); er.textContent = '';
        var phone = normPhone(ph.value), m = pmSel(), trx = tx.value.trim().toUpperCase();
        if (nm.value.trim().length < 2) { nm.classList.add('bad'); er.textContent = 'অনুগ্রহ করে আপনার নাম লিখুন।'; nm.focus(); return; }
        if (!validPhone(phone)) { ph.classList.add('bad'); er.textContent = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন 017XXXXXXXX)।'; ph.focus(); return; }
        if (m !== 'later' && !/^[A-Z0-9]{8,14}$/.test(trx)) { tx.classList.add('bad'); er.textContent = 'সঠিক TrxID দিন (৮–১৪ অক্ষর, ইংরেজি অক্ষর/সংখ্যা)।'; tx.focus(); return; }
        var items = Object.keys(cart).map(function (id) { var p = prod(id); return { id: id, name: p.name, price: p.price, qty: cart[id] }; });
        var order = {
          name: nm.value.trim(), phone: phone, items: items, total: cartTotal(),
          method: m, trxId: m === 'later' ? '' : trx, note: q('#ckm', f).value.trim()
        };
        var btn = q('#cks', f); btn.disabled = true; btn.textContent = '⏳ পাঠানো হচ্ছে...';
        store.set('ac_cust', JSON.stringify({ name: order.name, phone: order.phone }));
        DB.createOrder(order).then(function (o) {
          store.set('ac_last', o.id); cart = {}; saveCart(); renderGrid(); viewDone(o);
        }).catch(function (err) {
          console.error(err); btn.disabled = false; btn.textContent = '🚀 অর্ডার সাবমিট করুন';
          er.innerHTML = (err && err.userMessage ? esc(err.userMessage) + '<br>' : '') + 'দুঃখিত, অর্ডার পাঠানো যায়নি। ইন্টারনেট দেখে আবার চেষ্টা করুন অথবা <a href="' + wa(orderMsg(order, '')) + '" target="_blank" rel="noopener" style="text-decoration:underline">WhatsApp এ অর্ডার পাঠান</a>।';
        });
      };
    }

    function orderMsg(o, id) {
      return 'আসসালামু আলাইকুম, আমি ' + o.name + '।\n' + (id ? 'অর্ডার নম্বর: ' + id + '\n' : '') +
        o.items.map(function (i) { return '• ' + i.name + ' × ' + i.qty + ' = ' + money(i.price * i.qty); }).join('\n') +
        '\nমোট: ' + money(o.total) + '\nপেমেন্ট: ' + (o.method === 'later' ? 'পরে দেব' : C.payment[o.method].name + ' | TrxID: ' + o.trxId) +
        '\nফোন: ' + o.phone + (o.note ? '\nবিস্তারিত: ' + o.note : '');
    }

    function viewDone(o) {
      var local = DB.mode === 'local', paid = o.method && o.method !== 'later';
      closeModal(ov); var pg = openDonePage();
      pg.innerHTML = '<div class="okbox dpin"><div class="tick"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="25"/><path d="M14 27l8 8 16-17"/></svg></div>' +
        '<h3 style="padding:0">' + (paid ? 'পেমেন্ট কমপ্লিট!' : 'অর্ডার গৃহীত হয়েছে!') + '</h3>' +
        '<p class="sub">' + (paid ? 'ধন্যবাদ, ' + esc(o.name) + '! আপনার পেমেন্ট তথ্য সফলভাবে জমা হয়েছে।' : 'ধন্যবাদ, ' + esc(o.name) + '! আপনার অর্ডার জমা হয়েছে।') + '</p>' +
        receiptHTML(o) +
        '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:6px"><button type="button" class="btn btn-yellow" id="cpo" style="width:auto;display:inline-flex">📋 নম্বর কপি</button><button type="button" class="btn ghost" id="prc" style="width:auto;display:inline-flex">🖨️ রশিদ সেভ / প্রিন্ট</button></div>' +
        '<p style="margin:6px 0;color:var(--mut);font-size:.9rem">এই নম্বর ও ফোন নম্বর দিয়ে <b>📦 ট্র্যাক</b> বাটনে অর্ডারের অবস্থা দেখতে পারবেন।</p>' +
        (local ? '<div class="warn">⚠️ অর্ডারটি আপনার ডিভাইসে সেভ হয়েছে। দ্রুত কনফার্ম করতে নিচের বাটনে WhatsApp এ অর্ডারটি পাঠিয়ে দিন।</div>' : '<div class="warn">দ্রুত কাজ শুরু করতে চাইলে নিচের বাটনে WhatsApp এও জানিয়ে রাখতে পারেন।</div>') +
        '<a class="btn btn-wa" target="_blank" rel="noopener" href="' + wa(orderMsg(o, o.id)) + '">💬 WhatsApp এ অর্ডার জানান</a>' +
        '<button type="button" class="btn btn-yellow" id="tkd">📦 অর্ডার ট্র্যাক করুন</button><button type="button" class="btn ghost" id="cld">🏠 হোমে ফিরে যান</button></div>';
      q('#cpo', pg).onclick = function () { copy(o.id); };
      q('#prc', pg).onclick = function () { printReceipt(o); };
      q('#cld', pg).onclick = closeDonePage;
      var tk = q('#tkd', pg); if (tk) tk.onclick = function () { closeDonePage(); setTimeout(function () { var t = q('#trackBtn'); if (t) t.click(); }, 50); };
    }
  }

  /* ---------- ট্র্যাক মোডাল ---------- */
  function openTrack() {
    var ov = modal('trackOv'), mb = q('.mb', ov); openModal(ov);
    var saved = {}; try { saved = JSON.parse(store.get('ac_cust') || '{}'); } catch (e) {}
    mb.innerHTML = '<h3>📦 অর্ডার ট্র্যাক করুন</h3>' +
      '<form id="trf" novalidate><label class="l" for="tro">অর্ডার নম্বর (যেমন AC-XXXXXXX)</label><input class="fld" id="tro" autocomplete="off" maxlength="14" value="' + esc(store.get('ac_last') || '') + '">' +
      '<label class="l" for="trp">অর্ডারে দেওয়া মোবাইল নম্বর</label><input class="fld" id="trp" type="tel" inputmode="numeric" maxlength="16" value="' + esc(saved.phone || '') + '">' +
      '<div class="errmsg" id="tre"></div><button class="btn btn-red" type="submit" id="trs">🔍 অবস্থা দেখুন</button></form><div id="trr"></div>';
    var f = q('#trf', mb), res = q('#trr', mb), er = q('#tre', mb);
    f.onsubmit = function (e) {
      e.preventDefault(); er.textContent = ''; res.innerHTML = '';
      var id = q('#tro', f).value.trim().toUpperCase().replace(/\s/g, ''), phone = normPhone(q('#trp', f).value);
      if (id && id.indexOf('AC-') !== 0) id = 'AC-' + id.replace(/^AC/, '').replace(/^-/, '');
      if (id.length < 6) { er.textContent = 'সঠিক অর্ডার নম্বর দিন।'; return; }
      if (!validPhone(phone)) { er.textContent = 'সঠিক মোবাইল নম্বর দিন।'; return; }
      var btn = q('#trs', f); btn.disabled = true; btn.textContent = '⏳ খোঁজা হচ্ছে...';
      DB.getOrder(id, phone).then(function (o) {
        btn.disabled = false; btn.textContent = '🔍 অবস্থা দেখুন';
        if (!o || normPhone(o.phone) !== phone) { er.textContent = 'এই তথ্যের কোনো অর্ডার পাওয়া যায়নি। নম্বর মিলিয়ে আবার দেখুন।'; return; }
        showOrder(o);
      }).catch(function (err) {
        console.error(err); btn.disabled = false; btn.textContent = '🔍 অবস্থা দেখুন';
        er.textContent = 'অবস্থা আনা যায়নি। ইন্টারনেট দেখে আবার চেষ্টা করুন।';
      });
    };
    function showOrder(o) {
      var steps = C.statuses.filter(function (s) { return s.k !== 'cancelled'; });
      var idx = steps.map(function (s) { return s.k; }).indexOf(o.status);
      var html = receiptHTML(o);
      if (o.status === 'cancelled') html += '<div class="cancelled">❌ এই অর্ডারটি বাতিল করা হয়েছে।</div>';
      else html += '<ul class="tl-list">' + steps.map(function (s, i) {
        return '<li class="' + (i <= idx ? 'done' : '') + (i === idx ? ' cur' : '') + '"><i>' + (i <= idx ? '✓' : s.ic) + '</i>' + esc(s.l) + '</li>';
      }).join('') + '</ul>';
      if (o.adminNote) html += '<div class="tinfo"><b>📌 আশিকের নোট:</b> ' + esc(o.adminNote) + '</div>';
      html += '<a class="btn btn-wa" target="_blank" rel="noopener" href="' + wa('আসসালামু আলাইকুম, আমার অর্ডার নম্বর ' + o.id + ' নিয়ে জানতে চাই।') + '">💬 WhatsApp এ জিজ্ঞেস করুন</a>';
      html += '<div style="text-align:center;margin-bottom:8px"><button type="button" class="btn ghost" id="prt" style="width:auto;display:inline-flex">🖨️ রশিদ সেভ / প্রিন্ট</button></div>';
      res.innerHTML = html;
      q('#prt', res).onclick = function () { printReceipt(o); };
    }
  }

  /* ---------- ইনিট ---------- */
  var tb = q('#trackBtn'); if (tb) tb.innerHTML = '📦<span class="tl"> ট্র্যাক</span>';
  qa('[data-act]').forEach(function (b) {
    b.addEventListener('click', function () { (b.dataset.act === 'cart' ? openCart : openTrack)(); });
  });
  var sq = q('#shopQ'); if (sq) sq.oninput = function () { term = sq.value.trim(); renderGrid(); };
  cleanCart(); updBadge(); renderCats(); renderGrid(); renderPayBar();

  window.Shop = {
    focusCat: function (c) { if (C.categories[c]) { cat = c; term = ''; if (sq) sq.value = ''; renderCats(); renderGrid(); } },
    openCart: openCart, openTrack: openTrack
  };

  /* হেডারের শপ-ট্যাব থেকে নির্দিষ্ট ক্যাটাগরি খোলা (হোম পেজে ক্লিক, অন্য পেজে ?shopcat=) */
  qa('[data-shopcat]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      window.Shop.focusCat(a.dataset.shopcat);
      var s = q('#shop'); if (s) s.scrollIntoView({ behavior: 'smooth' });
    });
  });
  try {
    var sc = new URLSearchParams(location.search).get('shopcat');
    if (sc && C.categories[sc]) { window.Shop.focusCat(sc); }
  } catch (e) {}
})();

