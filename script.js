// ===== CONFIG =====
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbys2-iz83tM8n4ct1dtbbKpRboB6aiEFFycTfAJrWh1tvf9K9a405-IVfWhGrzscbVv/exec';

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    navbar.style.boxShadow = window.scrollY > 50
        ? '0 4px 20px rgba(0,0,0,0.12)'
        : '0 2px 20px rgba(0,0,0,0.08)';
});

// ===== HAMBURGER MENU =====
document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
});

// Tutup nav saat klik link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('open');
    });
});

// ===== MENU FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        document.querySelectorAll('.menu-card').forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ===== ORDER MODAL =====
let currentProduct = '';
let currentPrice = '';
let qty = 1;

function openOrder(name, price) {
    currentProduct = name;
    currentPrice = price;
    qty = 1;
    document.getElementById('qtyDisplay').textContent = 1;
    document.getElementById('modalProduct').textContent = price ? `${name} - ${price}` : name;

    // Tampilkan pilihan varian hanya untuk Dessert Box
    const isBox = name.toLowerCase().includes('dessert box');
    document.getElementById('variantRow').style.display = isBox ? 'block' : 'none';
    document.getElementById('custVariant').required = isBox;

    document.getElementById('orderModal').classList.add('active');
    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('orderModal').classList.remove('active');
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('orderForm').reset();
}

function changeQty(delta) {
    qty = Math.max(1, qty + delta);
    document.getElementById('qtyDisplay').textContent = qty;
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', closeModal);

// ===== ORDER FORM SUBMIT =====
document.getElementById('orderForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const address = document.getElementById('custAddress').value;
    const notes = document.getElementById('custNotes').value;
    const variant = document.getElementById('custVariant').value;

    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled = true;

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
                timestamp: new Date().toLocaleString('id-ID'),
                productName: currentProduct,
                productPrice: currentPrice || 'Hubungi Kami',
                variant: variant || '-',
                customerName: name,
                phone: phone,
                address: address,
                quantity: qty,
                notes: notes || '-'
            })
        });

        submitBtn.textContent = '✓ Pesanan Terkirim!';
        submitBtn.style.background = '#27ae60';

        setTimeout(() => {
            closeModal();
            submitBtn.textContent = 'Pesan via WhatsApp 💬';
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 1500);

    } catch (err) {
        submitBtn.textContent = '✗ Gagal, coba lagi';
        submitBtn.style.background = '#e74c3c';
        submitBtn.disabled = false;
        setTimeout(() => {
            submitBtn.textContent = 'Pesan Sekarang 📋';
            submitBtn.style.background = '';
        }, 2000);
    }
});

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const inputs = this.querySelectorAll('input, select, textarea');
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled = true;

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
                timestamp: new Date().toLocaleString('id-ID'),
                productName: inputs[2].value || '-',
                productPrice: '-',
                variant: '-',
                customerName: inputs[0].value,
                phone: inputs[1].value,
                address: '-',
                quantity: '-',
                notes: inputs[3].value || '-'
            })
        });

        submitBtn.textContent = '✓ Pesan Terkirim!';
        submitBtn.style.background = '#27ae60';
        this.reset();

        setTimeout(() => {
            submitBtn.textContent = 'Kirim Pesan';
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 2000);

    } catch (err) {
        submitBtn.textContent = '✗ Gagal, coba lagi';
        submitBtn.style.background = '#e74c3c';
        submitBtn.disabled = false;
        setTimeout(() => {
            submitBtn.textContent = 'Kirim Pesan';
            submitBtn.style.background = '';
        }, 2000);
    }
});
