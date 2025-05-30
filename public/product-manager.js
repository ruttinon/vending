

function showSection(id) {
    document.querySelectorAll('.main-section').forEach(sec => sec.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    document.querySelectorAll('aside nav a').forEach(link => link.classList.remove('active'));
    const link = Array.from(document.querySelectorAll('aside nav a')).find(a => a.textContent.includes(id.charAt(0).toUpperCase() + id.slice(1)));
    if (link) link.classList.add('active');
  
    if (id === 'products') loadProductOptions();
  }
  function logout() {
    alert('กำลังออกจากระบบ...');
  }
  async function fetchData() {
    const dbRef = firebase.database().ref("products");
    const snapshot = await dbRef.once("value");
    return snapshot.val();
  }
  async function renderCharts() {
    const data = await fetchData();
    const dailyRevenue = {};
    const footTypeSales = {};
    const lowStock = [];
  
    Object.values(data || {}).forEach(product => {
      const day = "Monday";
      dailyRevenue[day] = (dailyRevenue[day] || 0) + (product.sold || 0) * (product.price || 0);
      const type = product.footType || "อื่นๆ";
      footTypeSales[type] = (footTypeSales[type] || 0) + (product.sold || 0);
      lowStock.push({ name: product.name, stock: product.stock });
    });
  
    new Chart(document.getElementById("dailyRevenueChart"), {
      type: "line",
      data: {
        labels: Object.keys(dailyRevenue),
        datasets: [{
          label: "รายได้ (บาท)",
          data: Object.values(dailyRevenue),
          borderColor: "#3b82f6",
          tension: 0.3
        }]
      }
    });
  
    new Chart(document.getElementById("salesByFootTypeChart"), {
      type: "bar",
      data: {
        labels: Object.keys(footTypeSales),
        datasets: [{
          label: "จำนวนที่ขายได้",
          data: Object.values(footTypeSales),
          backgroundColor: "#10b981"
        }]
      }
    });
  
    lowStock.sort((a, b) => a.stock - b.stock);
    new Chart(document.getElementById("lowStockChart"), {
      type: "bar",
      data: {
        labels: lowStock.slice(0, 5).map(p => p.name),
        datasets: [{
          label: "คงเหลือ",
          data: lowStock.slice(0, 5).map(p => p.stock),
          backgroundColor: "#f59e0b"
        }]
      }
    });
  }
  
  async function loadProductOptions() {
    const res = await fetch("https://this-pro-done-default-rtdb.asia-southeast1.firebasedatabase.app/products.json");
    const data = await res.json();
    const select = document.getElementById("productSelect");
    select.innerHTML = "";
    Object.entries(data || {}).forEach(([id, product]) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = product.name;
      select.appendChild(option);
    });
  }
  async function addNewProduct() {
    const name = document.getElementById("newProductName").value;
    const price = document.getElementById("newProductPrice").value;
    const stock = document.getElementById("newProductStock").value;
    if (!name || price <= 0 || stock < 0) return alert("❌ กรอกข้อมูลให้ครบ");
    await fetch("https://this-pro-done-default-rtdb.asia-southeast1.firebasedatabase.app/products.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: Number(price), stock: Number(stock), visible: true })
    });
    alert("✅ เพิ่มสินค้าแล้ว");
    loadProductOptions();
  }
  async function addStockToProduct() {
    const id = document.getElementById("productSelect").value;
    const amt = Number(document.getElementById("stockAmount").value);
    if (amt <= 0) return alert("❌ จำนวนไม่ถูกต้อง");
    const res = await fetch("https://this-pro-done-default-rtdb.asia-southeast1.firebasedatabase.app/products.json");
    const data = await res.json();
    const newStock = data[id].stock + amt;
    await fetch(`https://this-pro-done-default-rtdb.asia-southeast1.firebasedatabase.app/products/${id}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: newStock })
    });
    alert("✅ เพิ่มสต็อกแล้ว");
    loadProductOptions();
  }
  window.onload = renderCharts;
  