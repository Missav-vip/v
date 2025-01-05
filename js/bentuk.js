import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Global Variables for Data
let kueData;
let plastikData;

// Fetch Data from Firestore
async function fetchDataFromFirestore() {
    const kueCollection = collection(db, "Kue");
    const plastikCollection = collection(db, "Plastik");

    const kueSnapshot = await getDocs(kueCollection);
    const plastikSnapshot = await getDocs(plastikCollection);

    kueData = { Kue: kueSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) };
    plastikData = { Plastik: plastikSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) };

    // Generate rows in the HTML table
    generateItemRows(kueData.Kue, "kueBody");
    generateItemRows(plastikData.Plastik, "plastikBody");
    enableEditing();
}

// Generate Item Rows for Table
function generateItemRows(data, tableId) {
    const tbody = document.getElementById(tableId);
    tbody.innerHTML = ""; // Clear existing rows
    data.forEach(group => {
        const groupRow = document.createElement("tr");
        groupRow.classList.add("table-subtitle");
        groupRow.innerHTML = `<td colspan="4"></td><td colspan="4">${group.group}</td><td colspan="3"></td>`;
        tbody.appendChild(groupRow);
        group.items.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = tableId === "plastikBody" ? `
                <td>${item.no}</td><td>${item.ukuran}</td><td>${item.kode_gudang}</td><td>${item.kode_toko}</td>
                <td class="money editable">${item.harga_dus}</td><td class="money editable">${item.harga_1_pak}</td><td class="money editable">${item.harga_1_pis}</td>
                <td class="money editable">${item.harga_1_ons}</td><td class="money editable">${item.harga_1000_gram}</td><td class="money editable">${item.harga_500_gram}</td>
                <td class="money editable">${item.harga_250_gram}</td><td class="editable">${item.stok_gudang}</td><td class="editable">${item.stok_toko}</td>
                <td class="editable">${item.masuk}</td><td class="editable">${item.keluar}</td>
            ` : `
                <td>${item.no}</td><td>${item.nama_barang}</td><td>${item.kode_gudang}</td><td>${item.kode_toko}</td>
                <td class="money editable">${item.harga_dus}</td><td class="money editable">${item.harga_1000_gram}</td><td class="money editable">${item.harga_500_gram}</td>
                <td class="money editable">${item.harga_250_gram}</td><td class="editable">${item.stok_gudang}</td><td class="editable">${item.stok_toko}</td>
                <td class="editable">${item.masuk}</td><td class="editable">${item.keluar}</td>
            `;
            tbody.appendChild(row);
        });
    });
}

// Enable Editing of Table Cells
function enableEditing() {
    document.querySelectorAll(".editable").forEach(cell => {
        cell.addEventListener("click", function () {
            const newValue = prompt("Edit Value:", cell.innerText);
            if (newValue !== null) {
                cell.innerText = newValue;
                updateDataInFirestore(cell, newValue); // Update in Firestore
            }
        });
    });
}

// Update Data in Firestore
async function updateDataInFirestore(cell, newValue) {
    const row = cell.closest('tr');
    const tableId = row.closest('table').id;
    const itemIndex = Array.from(row.parentElement.children).indexOf(row) - 1;

    if (tableId === "plastikBody") {
        const groupIndex = Math.floor(itemIndex / plastikData.Plastik[0].items.length);
        const group = plastikData.Plastik[groupIndex];
        const item = group.items[itemIndex % group.items.length];

        if (cell.cellIndex === 4) item.harga_dus = newValue;
        if (cell.cellIndex === 5) item.harga_1_pak = newValue;
        if (cell.cellIndex === 6) item.harga_1_pis = newValue;
        if (cell.cellIndex === 7) item.harga_1_ons = newValue;
        if (cell.cellIndex === 8) item.harga_1000_gram = newValue;
        if (cell.cellIndex === 9) item.harga_500_gram = newValue;
        if (cell.cellIndex === 10) item.harga_250_gram = newValue;

        const groupRef = doc(db, "Plastik", group.id);
        await updateDoc(groupRef, { items: group.items });
    } else {
        const groupIndex = Math.floor(itemIndex / kueData.Kue[0].items.length);
        const group = kueData.Kue[groupIndex];
        const item = group.items[itemIndex % group.items.length];

        if (cell.cellIndex === 4) item.harga_dus = newValue;
        if (cell.cellIndex === 5) item.harga_1000_gram = newValue;
        if (cell.cellIndex === 6) item.harga_500_gram = newValue;
        if (cell.cellIndex === 7) item.harga_250_gram = newValue;

        const groupRef = doc(db, "Kue", group.id);
        await updateDoc(groupRef, { items: group.items });
    }
}

// Initialize Application
fetchDataFromFirestore();
