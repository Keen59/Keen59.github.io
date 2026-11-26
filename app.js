const REPO = "Keen59/Keen59.github.io";
const BRANCH = "master";
const DATA_PATH = "marangoz/products.json";
const TOKEN_KEY = "marangoz-github-token";
const CART_KEY = "marangoz-sepet";

const defaultSettings = {
  shopName: "Marangoz Atölyesi",
  tagline: "Masif ahşap, atölyeden kapınıza.",
  phone: "",
  about: "",
};

const state = {
  catalog: { settings: { ...defaultSettings }, products: [] },
  ready: false,
  error: "",
  cart: [],
  token: localStorage.getItem(TOKEN_KEY) || "",
  user: "",
  notice: "",
  adminError: "",
  editing: null,
};

const app = document.querySelector("#app");

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatTry(value) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(value) || 0);
}

function parsePrice(value) {
  const trimmed = String(value ?? "").trim().replace(/\s/g, "");
  let normalized = trimmed;
  if (trimmed.includes(",") && trimmed.includes(".")) normalized = trimmed.replace(/\./g, "").replace(",", ".");
  else if (trimmed.includes(",")) normalized = trimmed.replace(",", ".");
  const number = Math.round(Number(normalized) * 100) / 100;
  return Number.isFinite(number) ? number : NaN;
}

function slugify(input) {
  const map = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", İ: "i", I: "i", Ö: "o", Ş: "s", Ü: "u" };
  const slug = String(input)
    .split("")
    .map((char) => map[char] ?? char)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "urun";
}

function uniqueSlug(products, name, currentId) {
  const base = slugify(name);
  let slug = base;
  let n = 2;
  while (products.some((product) => product.slug === slug && product.id !== currentId)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

function safeHttp(url) {
  const raw = String(url ?? "").trim();
  if (!raw) return "";
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return "";
    return parsed.href;
  } catch {
    return "";
  }
}

function safeImage(url) {
  const raw = String(url ?? "").trim();
  if (!raw) return "";
  if (raw.startsWith("images/") && !raw.includes("..") && !raw.includes("\\")) return raw;
  return safeHttp(raw);
}

function activeProducts() {
  return state.catalog.products.filter((product) => product.active);
}

function productBySlug(slug) {
  return activeProducts().find((product) => product.slug === slug) || null;
}

function productById(id) {
  return state.catalog.products.find((product) => product.id === id) || null;
}

function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    state.cart = Array.isArray(parsed)
      ? parsed.filter((item) => item && typeof item.id === "string" && Number.isInteger(item.quantity) && item.quantity > 0)
      : [];
  } catch {
    state.cart = [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
  paintChrome();
}

function cartCount() {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function paintChrome() {
  const settings = state.catalog.settings;
  document.title = settings.shopName || "Marangoz Atölyesi";
  document.querySelector("#brand-name").textContent = settings.shopName;
  document.querySelector("#foot-name").textContent = settings.shopName;
  document.querySelector("#foot-tag").textContent = settings.tagline || "";
  document.querySelector("#cart-link").textContent = cartCount() ? `Sepet (${cartCount()})` : "Sepet";
  const phone = document.querySelector("#phone-link");
  if (settings.phone) {
    phone.hidden = false;
    phone.textContent = settings.phone;
    phone.href = `tel:${settings.phone.replace(/\s/g, "")}`;
  } else {
    phone.hidden = true;
  }
}

function photoHtml(product) {
  const src = safeImage(product.imageUrl);
  if (!src) return `<span>${escapeHtml(product.name)}</span>`;
  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(product.name)}" />`;
}

function shopierLink(product) {
  const href = safeHttp(product.shopierUrl);
  if (!href || product.stock < 1) return "";
  return `<a class="btn" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">Shopier ile satın al</a>`;
}

function cardHtml(product) {
  return `<article class="card">
    <a class="photo" href="#/urun/${escapeHtml(product.slug)}">${photoHtml(product)}</a>
    <div class="card-body">
      <div class="title-row">
        <h2><a href="#/urun/${escapeHtml(product.slug)}">${escapeHtml(product.name)}</a></h2>
        <p class="price">${formatTry(product.price)}</p>
      </div>
      <p class="muted clamp">${escapeHtml(product.description)}</p>
      <div class="card-foot">
        <span class="stock">${product.stock > 0 ? `${product.stock} adet` : "Tükendi"}</span>
        <button class="btn" type="button" data-action="add" data-id="${escapeHtml(product.id)}" ${product.stock < 1 ? "disabled" : ""}>Sepete ekle</button>
      </div>
    </div>
  </article>`;
}

function homeView() {
  const featured = activeProducts().slice(0, 3);
  return `<section class="hero">
      <img src="https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=2000&q=80" alt="" />
      <div class="hero-shade"></div>
      <div class="hero-copy">
        <p class="eyebrow">Atölye</p>
        <h1>Ahşabı işler, evi ısıtır.</h1>
        <p class="lede">${escapeHtml(state.catalog.settings.about)}</p>
        <div class="row">
          <a class="btn light" href="#/urunler">Parçalara bak</a>
          <a class="btn ghost" href="#/sepet" style="color:#faf7f2;border-color:rgba(250,247,242,.35)">Sepeti aç</a>
        </div>
      </div>
    </section>
    <section class="steps">
      <div><p class="eyebrow">01</p><h2>Parçayı seçin</h2><p class="muted">Vitrindeki hazır işlerden sepete ekleyin.</p></div>
      <div><p class="eyebrow">02</p><h2>Shopier sayfasına geçin</h2><p class="muted">Adres ve kart orada sorulur. Bu sitede kart bilgisi tutulmaz.</p></div>
      <div><p class="eyebrow">03</p><h2>Sipariş Shopier'da durur</h2><p class="muted">Ödeme ve kargo kaydı Shopier panelinize düşer.</p></div>
    </section>
    <div class="section-head"><h2 class="serif" style="font-size:2.4rem;margin:0">Vitrin</h2><a href="#/urunler">Tümü</a></div>
    ${featured.length ? `<div class="grid" style="margin-top:18px">${featured.map(cardHtml).join("")}</div>` : `<p class="empty">Şu an vitrinde ürün yok.</p>`}`;
}

function listView() {
  const products = activeProducts();
  return `<p class="eyebrow">Vitrin</p><h1>Hazır parçalar</h1>
    ${products.length ? `<div class="grid">${products.map(cardHtml).join("")}</div>` : `<p class="empty">Şu an vitrinde ürün yok.</p>`}`;
}

function detailView(slug) {
  const product = productBySlug(slug);
  if (!product) return `<h1>Bu parça vitrinde yok.</h1><p><a href="#/urunler">Vitrine dön</a></p>`;
  const pay = shopierLink(product);
  return `<article class="detail">
    <div class="photo">${photoHtml(product)}</div>
    <div>
      <p><a href="#/urunler">Vitrine dön</a></p>
      <h1>${escapeHtml(product.name)}</h1>
      <p class="serif price" style="font-size:2rem">${formatTry(product.price)}</p>
      <p class="stock">${product.stock > 0 ? `Stokta ${product.stock} adet` : "Tükendi"}</p>
      <p class="prose">${escapeHtml(product.description)}</p>
      <div class="row" style="margin-top:18px">
        <button class="btn" type="button" data-action="add" data-id="${escapeHtml(product.id)}" ${product.stock < 1 ? "disabled" : ""}>Sepete ekle</button>
        ${pay || `<p class="warn">Bu parçanın Shopier linki henüz yok.</p>`}
      </div>
      <p class="muted">Sitedeki fiyat bilgi içindir. Karttan çekilen tutar Shopier'daki fiyattır.</p>
    </div>
  </article>`;
}

function cartView() {
  if (!state.cart.length) {
    return `<h1>Sepet</h1><div class="empty"><p class="serif" style="font-size:2rem">Sepet boş.</p><a class="btn" href="#/urunler">Ürünlere bak</a></div>`;
  }
  const rows = state.cart.map((item) => ({ item, product: productById(item.id) }));
  const total = rows.reduce((sum, row) => (row.product && row.product.active ? sum + row.product.price * row.item.quantity : sum), 0);
  return `<h1>Sepet</h1>
    <div class="layout">
      <div class="panel" style="padding:8px 16px">
        ${rows
          .map(({ item, product }) => {
            if (!product || !product.active) {
              return `<div class="line"><div><p class="serif" style="font-size:1.4rem;margin:0">Bu ürün kaldırıldı</p><button class="btn ghost" type="button" data-action="remove" data-id="${escapeHtml(item.id)}">Çıkar</button></div></div>`;
            }
            const pay = shopierLink(product);
            return `<div class="line">
              <div class="thumb">${safeImage(product.imageUrl) ? `<img src="${escapeHtml(safeImage(product.imageUrl))}" alt="" />` : ""}</div>
              <div style="flex:1">
                <a class="serif" style="font-size:1.4rem" href="#/urun/${escapeHtml(product.slug)}">${escapeHtml(product.name)}</a>
                <p class="price">${formatTry(product.price)}</p>
                <div class="row">
                  <input class="qty" type="number" min="1" max="${Math.min(product.stock, 20)}" value="${item.quantity}" data-action="qty" data-id="${escapeHtml(product.id)}" />
                  <button class="btn ghost" type="button" data-action="remove" data-id="${escapeHtml(product.id)}">Çıkar</button>
                  ${pay || `<span class="warn">Shopier linki yok</span>`}
                </div>
              </div>
            </div>`;
          })
          .join("")}
      </div>
      <aside class="summary">
        <p class="eyebrow">Özet</p>
        <p class="spread serif" style="font-size:2rem"><span>Toplam</span><span>${formatTry(total)}</span></p>
        <p class="muted">Her parça kendi Shopier sayfasında ödenir. Tek çekimde birleşmez. Tahsil edilen tutar Shopier fiyatıdır.</p>
      </aside>
    </div>`;
}

function adminGate() {
  return `<section class="panel" style="max-width:640px;padding:22px">
    <p class="eyebrow">Yönetim</p>
    <h1>Vitrini kaydet</h1>
    <p class="muted">Sunucu yok. Ürün ekleyip çıkarmak, tarayıcıdan GitHub'daki vitrin dosyasını günceller. Anahtar yalnızca bu tarayıcıda durur, siteye yazılmaz.</p>
    <ol class="help">
      <li><a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer">İnce ayarlı anahtar</a> oluşturun.</li>
      <li>Depo olarak yalnızca <strong>Keen59.github.io</strong> seçin.</li>
      <li>Contents iznini <strong>Read and write</strong> yapın.</li>
      <li>Anahtarı aşağıya yapıştırın.</li>
    </ol>
    <form id="token-form">
      <label class="field"><span>GitHub anahtarı</span><input name="token" type="password" autocomplete="off" required /></label>
      <button class="btn" type="submit">Bağlan</button>
    </form>
    ${state.adminError ? `<p class="warn">${escapeHtml(state.adminError)}</p>` : ""}
  </section>`;
}

function adminView() {
  if (!state.token) return adminGate();
  const draft = state.editing;
  const editingExisting = Boolean(draft?.id);
  const settings = state.catalog.settings;
  return `<div class="row" style="justify-content:space-between">
      <div><p class="eyebrow">Yönetim</p><h1>Vitrin</h1></div>
      <button class="btn ghost" type="button" data-action="logout">Çıkış</button>
    </div>
    <p class="muted">Bağlı: ${escapeHtml(state.user || "GitHub")}. Kayıt, yayınlanan siteye işlenir. Shopier siparişleri Shopier panelinde kalır.</p>
    ${state.notice ? `<p class="note">${escapeHtml(state.notice)}</p>` : ""}
    ${state.adminError ? `<p class="warn">${escapeHtml(state.adminError)}</p>` : ""}
    <div class="admin-grid">
      <form id="product-form" class="panel" style="padding:18px">
        <h2>${editingExisting ? "Ürünü düzenle" : "Ürün ekle"}</h2>
        <input type="hidden" name="id" value="${escapeHtml(draft?.id || "")}" />
        <label class="field"><span>Ad</span><input name="name" required value="${escapeHtml(draft?.name || "")}" /></label>
        <label class="field"><span>Açıklama</span><textarea name="description">${escapeHtml(draft?.description || "")}</textarea></label>
        <label class="field"><span>Fiyat (TL)</span><input name="price" inputmode="decimal" required value="${escapeHtml(draft ? draft.price : "")}" /></label>
        <label class="field"><span>Stok</span><input name="stock" type="number" min="0" required value="${escapeHtml(draft ? draft.stock : 1)}" /></label>
        <label class="field"><span>Görsel adresi</span><input name="imageUrl" value="${escapeHtml(draft?.imageUrl || "")}" placeholder="https://..." /></label>
        <label class="field"><span>Bilgisayardan görsel</span><input name="file" type="file" accept="image/jpeg,image/png,image/webp" /></label>
        <label class="field"><span>Shopier ürün linki</span><input name="shopierUrl" value="${escapeHtml(draft?.shopierUrl || "")}" placeholder="https://www.shopier.com/..." /></label>
        <p class="muted">Shopier'da ürünü aynı fiyatla oluşturup linkini yapıştırın. Müşteri o sayfada öder.</p>
        <label class="check"><input name="active" type="checkbox" ${!draft || draft.active ? "checked" : ""} /> Vitrinde görünsün</label>
        <div class="row">
          <button class="btn" type="submit">${editingExisting ? "Değişiklikleri kaydet" : "Ürünü ekle"}</button>
          ${draft ? `<button class="btn ghost" type="button" data-action="cancel-edit">Vazgeç</button>` : ""}
        </div>
      </form>
      <div class="panel" style="overflow:auto">
        <table>
          <thead><tr><th>Ürün</th><th>Fiyat</th><th>Stok</th><th></th></tr></thead>
          <tbody>
            ${
              state.catalog.products.length
                ? state.catalog.products
                    .map(
                      (product) => `<tr>
                        <td><strong>${escapeHtml(product.name)}</strong><br /><span class="muted">${product.active ? "Vitrinde" : "Gizli"}${safeHttp(product.shopierUrl) ? "" : " · Shopier linki yok"}</span></td>
                        <td>${formatTry(product.price)}</td>
                        <td>${product.stock}</td>
                        <td class="row">
                          <button class="btn ghost" type="button" data-action="edit" data-id="${escapeHtml(product.id)}">Düzenle</button>
                          <button class="btn danger" type="button" data-action="delete" data-id="${escapeHtml(product.id)}">Kaldır</button>
                        </td>
                      </tr>`,
                    )
                    .join("")
                : `<tr><td colspan="4">Henüz ürün yok.</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </div>
    <form id="settings-form" class="panel" style="padding:18px;margin-top:18px">
      <h2>Dükkan</h2>
      <label class="field"><span>Ad</span><input name="shopName" required value="${escapeHtml(settings.shopName)}" /></label>
      <label class="field"><span>Kısa cümle</span><input name="tagline" value="${escapeHtml(settings.tagline)}" /></label>
      <label class="field"><span>Telefon</span><input name="phone" value="${escapeHtml(settings.phone)}" /></label>
      <label class="field"><span>Hakkında</span><textarea name="about">${escapeHtml(settings.about)}</textarea></label>
      <button class="btn" type="submit">Dükkan yazısını kaydet</button>
    </form>`;
}

function render() {
  paintChrome();
  if (!state.ready) {
    app.innerHTML = `<p class="muted">Vitrin açılıyor...</p>`;
    return;
  }
  if (state.error) {
    app.innerHTML = `<p class="warn">${escapeHtml(state.error)}</p>`;
    return;
  }
  const hash = location.hash || "#/";
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  let html = homeView();
  if (parts[0] === "urunler") html = listView();
  else if (parts[0] === "urun") html = detailView(decodeURIComponent(parts[1] || ""));
  else if (parts[0] === "sepet") html = cartView();
  else if (parts[0] === "yonetim") html = adminView();
  app.innerHTML = html;
}

function addToCart(id) {
  const product = productById(id);
  if (!product || !product.active || product.stock < 1) return;
  const existing = state.cart.find((item) => item.id === id);
  const nextQty = Math.min(product.stock, (existing?.quantity || 0) + 1);
  state.cart = existing
    ? state.cart.map((item) => (item.id === id ? { ...item, quantity: nextQty } : item))
    : [...state.cart, { id, quantity: 1 }];
  saveCart();
}

function githubHeaders() {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${state.token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function encodeBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeBase64(content) {
  const binary = atob(String(content).replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function githubError(response) {
  if (response.status === 401) return "Anahtar geçersiz.";
  if (response.status === 403) return "Bu anahtarın depoya yazma izni yok.";
  if (response.status === 409) return "Vitrin aynı anda değişti. Tekrar kaydedin.";
  const data = await response.json().catch(() => ({}));
  return data.message || "Kayıt tamamlanamadı.";
}

async function connect(token) {
  state.adminError = "";
  const response = await fetch("https://api.github.com/user", { headers: { ...githubHeaders(), Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(await githubError(response));
  const user = await response.json();
  const probe = await fetch(`https://api.github.com/repos/${REPO}/contents/${DATA_PATH}?ref=${BRANCH}`, {
    headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token}`, "X-GitHub-Api-Version": "2022-11-28" },
  });
  if (probe.status === 403 || probe.status === 401) throw new Error(await githubError(probe));
  state.token = token;
  state.user = user.login || "";
  localStorage.setItem(TOKEN_KEY, token);
}

async function putFile(path, base64, message, sha) {
  const body = { message, content: base64, branch: BRANCH };
  if (sha) body.sha = sha;
  const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: { ...githubHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(await githubError(response));
  return response.json();
}

async function saveCatalog(next, message) {
  const current = await fetch(`https://api.github.com/repos/${REPO}/contents/${DATA_PATH}?ref=${BRANCH}`, { headers: githubHeaders() });
  if (current.status !== 404 && !current.ok) throw new Error(await githubError(current));
  const file = current.status === 404 ? null : await current.json();
  const text = `${JSON.stringify(next, null, 2)}\n`;
  await putFile(DATA_PATH, encodeBase64(text), message, file?.sha);
  state.catalog = next;
  state.notice = "Kaydedildi. Yayındaki sitede görünmesi bir dakika sürebilir.";
  state.adminError = "";
  paintChrome();
}

async function uploadImage(file) {
  if (!file) return "";
  if (file.size > 1_200_000) throw new Error("Görsel 1,2 MB'dan küçük olmalı.");
  const types = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
  const ext = types[file.type];
  if (!ext) throw new Error("Yalnızca JPG, PNG veya WEBP.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const magic = {
    jpg: [0xff, 0xd8, 0xff],
    png: [0x89, 0x50, 0x4e, 0x47],
    webp: [0x52, 0x49, 0x46, 0x46],
  }[ext];
  if (!magic.every((value, index) => bytes[index] === value)) throw new Error("Dosya gerçek bir görsel değil.");
  const name = `${crypto.randomUUID()}.${ext}`;
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Görsel okunamadı."));
    reader.readAsDataURL(file);
  });
  const base64 = dataUrl.split(",")[1];
  await putFile(`marangoz/images/${name}`, base64, "Ürün görseli ekle");
  return `images/${name}`;
}

function readProduct(form) {
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const description = String(data.get("description") || "").trim();
  const price = parsePrice(data.get("price"));
  const stock = Number(data.get("stock"));
  const imageUrl = safeImage(data.get("imageUrl"));
  const shopierUrl = safeHttp(data.get("shopierUrl"));
  if (String(data.get("imageUrl") || "").trim() && !imageUrl) return { error: "Görsel adresi http veya https olmalı." };
  if (String(data.get("shopierUrl") || "").trim() && !shopierUrl) return { error: "Shopier linki http veya https olmalı." };
  if (name.length < 2) return { error: "Ürün adı en az 2 karakter olmalı." };
  if (!Number.isFinite(price) || price <= 0) return { error: "Geçerli bir fiyat girin." };
  if (!Number.isInteger(stock) || stock < 0) return { error: "Stok tam sayı olmalı." };
  return {
    value: {
      id: String(data.get("id") || ""),
      name,
      description,
      price,
      stock,
      imageUrl,
      shopierUrl,
      active: form.querySelector("[name=active]").checked,
      file: form.querySelector("[name=file]").files[0] || null,
    },
  };
}

async function onProductSubmit(event) {
  const parsed = readProduct(event.target);
  if (parsed.error) {
    const data = new FormData(event.target);
    state.editing = {
      id: String(data.get("id") || ""),
      name: String(data.get("name") || ""),
      description: String(data.get("description") || ""),
      price: String(data.get("price") || ""),
      stock: String(data.get("stock") || ""),
      imageUrl: String(data.get("imageUrl") || ""),
      shopierUrl: String(data.get("shopierUrl") || ""),
      active: event.target.querySelector("[name=active]").checked,
    };
    state.adminError = parsed.error;
    state.notice = "";
    render();
    return;
  }
  const button = event.target.querySelector("button[type=submit]");
  button.disabled = true;
  try {
    const input = parsed.value;
    let imageUrl = input.imageUrl;
    if (input.file) imageUrl = await uploadImage(input.file);
    const products = state.catalog.products.slice();
    if (input.id) {
      const index = products.findIndex((product) => product.id === input.id);
      if (index < 0) throw new Error("Ürün bulunamadı.");
      products[index] = {
        ...products[index],
        name: input.name,
        slug: uniqueSlug(products, input.name, input.id),
        description: input.description,
        price: input.price,
        stock: input.stock,
        imageUrl,
        shopierUrl: input.shopierUrl,
        active: input.active,
      };
    } else {
      const id = `p-${crypto.randomUUID().slice(0, 8)}`;
      products.unshift({
        id,
        name: input.name,
        slug: uniqueSlug(products, input.name),
        description: input.description,
        price: input.price,
        stock: input.stock,
        imageUrl,
        shopierUrl: input.shopierUrl,
        active: input.active,
      });
    }
    await saveCatalog({ ...state.catalog, products }, input.id ? "Ürünü güncelle" : "Ürün ekle");
    state.editing = null;
    render();
  } catch (error) {
    state.adminError = error.message;
    state.notice = "";
    render();
  }
}

async function onSettingsSubmit(event) {
  const data = new FormData(event.target);
  const shopName = String(data.get("shopName") || "").trim();
  if (shopName.length < 2) {
    state.adminError = "Dükkan adı girin.";
    render();
    return;
  }
  const button = event.target.querySelector("button[type=submit]");
  button.disabled = true;
  try {
    await saveCatalog(
      {
        ...state.catalog,
        settings: {
          shopName,
          tagline: String(data.get("tagline") || "").trim(),
          phone: String(data.get("phone") || "").trim(),
          about: String(data.get("about") || "").trim(),
        },
      },
      "Dükkan yazısını güncelle",
    );
    render();
  } catch (error) {
    state.adminError = error.message;
    render();
  }
}

document.body.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  const id = button.dataset.id;
  if (action === "add") {
    addToCart(id);
    button.textContent = "Eklendi";
    window.setTimeout(() => {
      if (button.isConnected) button.textContent = "Sepete ekle";
    }, 1200);
  }
  if (action === "remove") {
    state.cart = state.cart.filter((item) => item.id !== id);
    saveCart();
    render();
  }
  if (action === "edit") {
    state.editing = productById(id);
    state.adminError = "";
    render();
    app.querySelector("#product-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (action === "cancel-edit") {
    state.editing = null;
    render();
  }
  if (action === "logout") {
    state.token = "";
    state.user = "";
    localStorage.removeItem(TOKEN_KEY);
    render();
  }
  if (action === "delete") {
    const product = productById(id);
    if (!product || !window.confirm(`${product.name} vitrinden kaldırılsın mı?`)) return;
    try {
      await saveCatalog(
        { ...state.catalog, products: state.catalog.products.filter((item) => item.id !== id) },
        "Ürünü kaldır",
      );
      if (state.editing?.id === id) state.editing = null;
      render();
    } catch (error) {
      state.adminError = error.message;
      render();
    }
  }
});

document.body.addEventListener("change", (event) => {
  const input = event.target.closest("[data-action=qty]");
  if (!input) return;
  const product = productById(input.dataset.id);
  if (!product) return;
  const quantity = Math.min(product.stock, Math.max(0, Number(input.value)));
  state.cart =
    quantity < 1
      ? state.cart.filter((item) => item.id !== product.id)
      : state.cart.map((item) => (item.id === product.id ? { ...item, quantity } : item));
  saveCart();
  render();
});

document.body.addEventListener("submit", async (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  if (form.id === "token-form" || form.id === "product-form" || form.id === "settings-form") event.preventDefault();
  if (form.id === "token-form") {
    const token = String(new FormData(form).get("token") || "").trim();
    try {
      await connect(token);
      state.notice = "Bağlantı hazır. Yaptığınız değişiklik yayınlanan vitrine yazılır.";
      render();
    } catch (error) {
      state.adminError = error.message;
      render();
    }
  }
  if (form.id === "product-form") await onProductSubmit(event);
  if (form.id === "settings-form") await onSettingsSubmit(event);
});

window.addEventListener("hashchange", render);

async function init() {
  loadCart();
  try {
    const response = await fetch(`products.json?ts=${Date.now()}`);
    if (!response.ok) throw new Error("Vitrin dosyası açılmadı.");
    const data = await response.json();
    state.catalog = {
      settings: { ...defaultSettings, ...(data.settings || {}) },
      products: Array.isArray(data.products) ? data.products : [],
    };
    state.ready = true;
  } catch (error) {
    state.error = error.message;
    state.ready = true;
  }
  if (state.token) {
    try {
      await connect(state.token);
    } catch {
      state.token = "";
      state.user = "";
      localStorage.removeItem(TOKEN_KEY);
    }
  }
  render();
}

init();
