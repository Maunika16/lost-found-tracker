let items = JSON.parse(localStorage.getItem("items")) || [];
let currentFilter = "All";
let selectedType = "Lost";

displayItems();

/* Select Type */
function selectType(type) {
  selectedType = type;
  document.getElementById("lostBtn").classList.toggle("active", type === "Lost");
  document.getElementById("foundBtn").classList.toggle("active", type === "Found");
}

/* Add Item */
function addItem() {
  let name = document.getElementById("itemName").value.trim();
  let desc = document.getElementById("description").value.trim();
  let loc = document.getElementById("location").value.trim();

  if (!name || !desc || !loc) {
    showToast("Please fill in all fields ✦");
    return;
  }

  let item = { name, desc, loc, type: selectedType, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
  items.push(item);
  localStorage.setItem("items", JSON.stringify(items));

  displayItems();
  clearInputs();
  showToast(`Item "${name}" added ✦`);
}

/* Display */
function displayItems() {
  let list = document.getElementById("itemList");
  let searchVal = document.getElementById("search").value.toLowerCase();

  let filtered = items.filter(item => {
    let matchFilter = currentFilter === "All" || item.type === currentFilter;
    let matchSearch = !searchVal || (item.name + item.desc + item.loc).toLowerCase().includes(searchVal);
    return matchFilter && matchSearch;
  });

  list.innerHTML = "";

  if (filtered.length === 0) {
    document.getElementById("emptyState").style.display = "block";
  } else {
    document.getElementById("emptyState").style.display = "none";
    filtered.forEach((item, i) => {
      // find actual index in items array
      let realIndex = items.indexOf(item);
      list.innerHTML += `
        <div class="item ${item.type.toLowerCase()}" style="animation-delay:${i * 0.05}s">
          <div class="item-header">
            <span class="item-name">${item.name}</span>
            <span class="badge ${item.type.toLowerCase()}">${item.type}</span>
          </div>
          <p class="item-desc">${item.desc}</p>
          <p class="item-loc"><i class="fa-solid fa-location-dot"></i> ${item.loc}${item.date ? ` &nbsp;·&nbsp; ${item.date}` : ''}</p>
          <div class="actions">
            <button class="edit-btn" onclick="editItem(${realIndex})"><i class="fa-solid fa-pen"></i> Edit</button>
            <button class="delete-btn" onclick="deleteItem(${realIndex})"><i class="fa-solid fa-trash"></i> Delete</button>
          </div>
        </div>
      `;
    });
  }

  updateStats();
}

/* Update Stats */
function updateStats() {
  document.getElementById("totalCount").textContent = items.length;
  document.getElementById("lostCount").textContent = items.filter(i => i.type === "Lost").length;
  document.getElementById("foundCount").textContent = items.filter(i => i.type === "Found").length;
}

/* Delete */
function deleteItem(index) {
  let name = items[index].name;
  items.splice(index, 1);
  localStorage.setItem("items", JSON.stringify(items));
  displayItems();
  showToast(`"${name}" removed`);
}

/* Edit */
function editItem(index) {
  document.getElementById("itemName").value = items[index].name;
  document.getElementById("description").value = items[index].desc;
  document.getElementById("location").value = items[index].loc;
  selectType(items[index].type);
  deleteItem(index);
  showToast("Edit your changes and re-add ✦");
}

/* Clear */
function clearInputs() {
  document.getElementById("itemName").value = "";
  document.getElementById("description").value = "";
  document.getElementById("location").value = "";
}

/* Filter */
function filterItems(type, btn) {
  currentFilter = type;
  document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  displayItems();
}

/* Search */
function searchItem() {
  displayItems();
}

/* Toast */
function showToast(msg) {
  let toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

/* Dark Mode */
function toggleTheme() {
  document.body.classList.toggle("dark");
  let icon = document.getElementById("themeIcon");
  icon.className = document.body.classList.contains("dark")
    ? "fa-solid fa-sun"
    : "fa-solid fa-moon";
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

/* Load saved theme */
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  document.getElementById("themeIcon").className = "fa-solid fa-sun";
}