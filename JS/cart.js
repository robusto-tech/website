/* js/cart.js — Cart state manager with localStorage persistence */
const Cart = {
  _storeId: null,
  _listeners: [],

  init(storeId) {
    this._storeId = storeId;
  },

  _key() {
    return 'cart_' + this._storeId;
  },

  _data() {
    try {
      var raw = localStorage.getItem(this._key());
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return { items: [] };
  },

  _save(data) {
    localStorage.setItem(this._key(), JSON.stringify(data));
    this._notify();
  },

  onChange(fn) {
    this._listeners.push(fn);
  },

  _notify() {
    this._listeners.forEach(function(fn) { fn(); });
  },

  add(product) {
    var data = this._data();
    var found = false;
    for (var i = 0; i < data.items.length; i++) {
      if (data.items[i].id === product.id) {
        data.items[i].qty++;
        found = true;
        break;
      }
    }
    if (!found) {
      data.items.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        qty: 1,
        image_url: product.image_url || '',
        category: product.category || ''
      });
    }
    this._save(data);
  },

  remove(id) {
    var data = this._data();
    for (var i = 0; i < data.items.length; i++) {
      if (data.items[i].id === id) {
        data.items[i].qty--;
        if (data.items[i].qty <= 0) data.items.splice(i, 1);
        break;
      }
    }
    this._save(data);
  },

  deleteItem(id) {
    var data = this._data();
    data.items = data.items.filter(function(item) { return item.id !== id; });
    this._save(data);
  },

  clear() {
    localStorage.removeItem(this._key());
    this._notify();
  },

  items() {
    return this._data().items;
  },

  total() {
    return this._data().items.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
  },

  count() {
    return this._data().items.reduce(function(s, i) { return s + i.qty; }, 0);
  },

  getQty(id) {
    var items = this.items();
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) return items[i].qty;
    }
    return 0;
  }
};

/* WhatsApp order builder */
function buildOrder(settings, items) {
  var c = settings.currency_symbol || 'Rs.';
  var lines = items.map(function(i) {
    return '• ' + i.name + ' x' + i.qty + ' — ' + c + ' ' + (i.price * i.qty).toLocaleString();
  }).join('\n');
  var total = items.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
  return '\uD83C\uDF54 *New Order \u2014 ' + settings.store_name + '*\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n\uD83D\uDED2 *Your Order:*\n' + lines + '\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\uD83D\uDCB0 *Total: ' + c + ' ' + total.toLocaleString() + '*\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n\uD83D\uDCCD *Delivery Address:*\n\uD83D\uDCDE *Contact Number:*\n\nThank you for ordering from ' + settings.store_name + '! \uD83D\uDE4F';
}

function openWhatsApp(settings, items) {
  var num = (settings.whatsapp_number || '').replace(/\D/g, '');
  if (!num || num.length < 10) {
    alert('WhatsApp number not configured. Please contact the store directly.');
    return;
  }
  var msg = buildOrder(settings, items);
  window.open('https://wa.me/' + num + '?text=' + encodeURIComponent(msg), '_blank');
}