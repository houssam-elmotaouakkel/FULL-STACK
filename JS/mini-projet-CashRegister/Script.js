const CashRegister = {
  discount: 400,
  discountRate: 0.10,
  itemsForSale: {
    'Phone': 300,
    'Smart TV': 220,
    'Gaming Console': 150,
  },
  cart: [],

    // Ajouter un article par nom
    addItem(itemName) {
      if (this.itemsForSale.hasOwnProperty(itemName)) {
        const price = this.itemsForSale[itemName];
        this.cart.push({ name: itemName, price });
        console.log(`[ADD] ${itemName} ajouté au panier pour ${price}.`);
        UI.renderCart();
      } else {
        const msg = `Nous ne vendons pas cet article: "${itemName}"`;
        console.log(`[WARN] ${msg}`);
        UI.toast(msg, 'err');
      }
    },
    
      // Retirer un article par index (qualité de vie pour l'UI)
      removeItem(index) {
        const removed = this.cart.splice(index, 1)[0];
        if (removed) {
          console.log(`[REMOVE] ${removed.name} retiré du panier.`);
          UI.renderCart();
        }
      },

      // Calculer le total hors réduction
      calculateSubtotal() {
        let sum = 0;
        for (const it of this.cart) sum += it.price;
        console.log(`[TOTAL] Sous‑total des ${this.cart.length} article(s): ${sum.toFixed(2)}.`);
        return sum;
      },

      // Calculer le total avec réduction éventuelle
      calculateTotalPrice() {
        const subtotal = this.calculateSubtotal();
        let discount = 0;
        if (subtotal > this.discount) {
          discount = subtotal * this.discountRate;
          console.log(`[DISCOUNT] Réduction de ${(this.discountRate*100).toFixed(0)}% appliquée: -${discount.toFixed(2)}.`);
        } else {
          console.log('[DISCOUNT] Aucune réduction (total ≤ seuil).');
        }
        const total = subtotal - discount;
        return { subtotal, discount, total };
      },

      // Encaisser un paiement en espèces
      pay(paymentAmount) {
        const { subtotal, discount, total } = this.calculateTotalPrice();
        console.log(`[PAY] Montant reçu: ${paymentAmount.toFixed(2)}. Total à payer: ${total.toFixed(2)}.`);

        if (paymentAmount >= total) {
          const change = paymentAmount - total;
          let msg = `Merci pour votre achat !`;
          if (change > 0) msg += ` Monnaie à rendre: ${change.toFixed(2)}.`;
          console.log(`[OK] ${msg}`);
          UI.toast(msg, 'ok');
          // Réinitialiser le panier après paiement réussi
          this.cart = [];
          UI.renderCart();
          return { status: 'ok', change };
        } else {
          const missing = total - paymentAmount;
          const msg = `Fonds insuffisants. Il manque ${missing.toFixed(2)}.`;
          console.log(`[ERR] ${msg}`);
          UI.toast(msg, 'err');
          return { status: 'err', missing };
        }
      },
};

// --- Interface utilisateur ---
const UI = {
  catalogEl: document.getElementById('catalog'),
  cartListEl: document.getElementById('cartList'),
  subtotalEl: document.getElementById('subtotal'),
  discountEl: document.getElementById('discount'),
  totalEl: document.getElementById('total'),
  msgEl: document.getElementById('message'),
  cashInput: document.getElementById('cashInput'),
  payBtn: document.getElementById('payBtn'),

    init() {
      // Construire les cartes du catalogue
      for (const [name, price] of Object.entries(CashRegister.itemsForSale)) {
        const card = document.createElement('div');
        card.className = 'item';
        card.innerHTML = `
          <div class="name">${name}</div>
          <div class="price">${price.toFixed(2)}</div>
          <button type="button">Ajouter</button>
        `;
        card.querySelector('button').addEventListener('click', () => CashRegister.addItem(name));
        this.catalogEl.appendChild(card);
      }
      this.renderCart();
      this.payBtn.addEventListener('click', this.onPayClick.bind(this));
    },

    renderCart() {
    // Liste du panier
    this.cartListEl.innerHTML = '';
      CashRegister.cart.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = 'cart-row';
      li.innerHTML = `
        <span>${item.name}</span>
        <span class="price">${item.price.toFixed(2)}</span>
        <button class="remove" aria-label="Retirer">×</button>
      `;
      li.querySelector('.remove').addEventListener('click', () => CashRegister.removeItem(idx));
      this.cartListEl.appendChild(li);
    });

        // Totaux
        const { subtotal, discount, total } = CashRegister.calculateTotalPrice();
        this.subtotalEl.textContent = subtotal.toFixed(2);
        this.discountEl.textContent = discount.toFixed(2);
        this.totalEl.textContent = total.toFixed(2);

        // Accessibilité: actualiser le message si panier vide
        if (CashRegister.cart.length === 0) {
          const li = document.createElement('li');
          li.className = 'cart-row';
          li.innerHTML = '<span>Votre panier est vide.</span><span></span><span></span>';
          this.cartListEl.appendChild(li);
        }
      },

      onPayClick() {
        const raw = this.cashInput.value.trim();
        if (raw === '') { return this.toast('Saisissez un montant pour encaisser.', 'err'); }
        const amount = Number(raw);
        if (!Number.isFinite(amount) || amount < 0) { return this.toast('Montant invalide.', 'err'); }
        CashRegister.pay(amount);
        this.cashInput.value = '';
      },

      toast(text, type = 'ok') {
        this.msgEl.textContent = text;
        this.msgEl.hidden = false;
        this.msgEl.className = `msg ${type}`;
        // Disparition douce
        clearTimeout(this._timer);
        this._timer = setTimeout(() => { this.msgEl.hidden = true; }, 4500);
      }
    };

    // Lancer l'UI
    UI.init();