// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDwrvHIIh4R0UEN_MKFuaWJkCFPnVtUovY",
    authDomain: "mira-plastik.firebaseapp.com",
    databaseURL: "https://mira-plastik-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mira-plastik",
    storageBucket: "mira-plastik.firebasestorage.app",
    messagingSenderId: "687440670790",
    appId: "1:687440670790:web:c6d571beaa1e47d0861a47",
    measurementId: "G-5SYRXTFSX9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

let kueData; // Data Kue
let plastikData; // Data Plastik

// Fetch data from Firestore
fetchDataFromFirestore();

async function fetchDataFromFirestore() {
    try {
        const kueCollection = collection(db, "Kue");
        const plastikCollection = collection(db, "Plastik");

        const kueSnapshot = await getDocs(kueCollection);
        const plastikSnapshot = await getDocs(plastikCollection);

        kueData = { Kue: kueSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) };
        plastikData = { Plastik: plastikSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) };

        generateItemRows(kueData.Kue, "kueBody");
        generateItemRows(plastikData.Plastik, "plastikBody");
        enableEditing();
    } catch (error) {
        console.error("Error fetching data from Firestore:", error);
        alert("Gagal memuat data. Silakan coba lagi nanti.");
    }
}

// Generate table rows
function generateItemRows(data, tableId) {
    const tbody = document.getElementById(tableId);
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

// Enable editing for editable cells
function enableEditing() {
    document.querySelectorAll(".editable").forEach(cell => {
        cell.addEventListener("click", function () {
            const newValue = prompt("Edit Value:", cell.innerText);
            if (newValue !== null) {
                cell.innerText = newValue;
                updateDataInFirestore(cell, newValue); // Update changes in Firestore
            }
        });
    });
}

// Update data in Firestore
async function updateDataInFirestore(cell, newValue) {
    try {
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
    } catch (error) {
        console.error("Error updating data in Firestore:", error);
        alert("Gagal memperbarui data. Silakan coba lagi.");
    }
}
