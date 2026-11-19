/* Static (GitHub Pages) data layer.
   GitHub Pages has no server, so orders & messages are kept in THIS browser (localStorage).
   Orders are also sent to the owner on WhatsApp by the customer (see the success page). */
(function () {
  var ORDERS = 'ac_orders_v1', MSGS = 'ac_msgs_v1';
  function read(k) { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch (e) { return []; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function newId() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = '';
    for (var i = 0; i < 7; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
    return 'AC-' + s;
  }
  window.DB = {
    mode: 'local',
    createOrder: function (o) {
      return new Promise(function (resolve) {
        var list = read(ORDERS);
        var order = Object.assign({}, o, { id: newId(), status: 'pending', createdAt: new Date().toISOString() });
        list.push(order); write(ORDERS, list);
        resolve(order);
      });
    },
    getOrder: function (id, phone) {
      return new Promise(function (resolve) {
        var digits = String(phone || '').replace(/\D/g, '');
        var found = read(ORDERS).filter(function (o) {
          return o.id === id && String(o.phone || '').replace(/\D/g, '').slice(-11) === digits.slice(-11);
        })[0];
        resolve(found || null);
      });
    },
    createMessage: function (m) {
      return new Promise(function (resolve) {
        var list = read(MSGS); list.push(Object.assign({}, m, { createdAt: new Date().toISOString() }));
        write(MSGS, list); resolve(true);
      });
    }
  };
})();
