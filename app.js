let esAdmin = false;
const API_URL = window.location.origin.startsWith('http') 
    ? '/api/productos' 
    : 'http://localhost:5000/api/productos';

const productosIniciales = [
    { 
        id: 1, 
        nombre: "Torta especial", 
        categoria: "Tortas mixtas", 
        precio: 65000, 
        desc: "Disponible en 3 sabores: 1. Vainilla con Arequipe, 2. Chocolate Fudgy, 3. Fresas con Crema." 
    },
    { 
        id: 2, 
        nombre: "Cheesecake", 
        categoria: "Cheesecakes", 
        precio: 52000, 
        desc: "Disponible en 3 sabores: 1. Maracuyá, 2. Frutos Rojos, 3. Galleta Oreo." 
    },
    { 
        id: 3, 
        nombre: "Caja de Cupcakes x6", 
        categoria: "Cupcakes", 
        precio: 28000, 
        desc: "Disponible en 3 sabores: 1. Red Velvet, 2. Chocolate & Avellana, 3. Zanahoria con Crema." 
    },
    { 
        id: 4, 
        nombre: "Caja de Alfajores x8", 
        categoria: "Alfajores", 
        precio: 22000, 
        desc: "Disponible en 3 sabores: 1. Tradicional de Arequipe, 2. Bañados en Chocolate Negro, 3. Coco y Limón." 
    },
    { 
        id: 5, 
        nombre: "Combo Galletas & Palitos", 
        categoria: "Galletas y Palitos", 
        precio: 18000, 
        desc: "Disponible en 3 opciones: 1. Chispas de Chocolate, 2. Avena y Miel, 3. Palitos Crunch de Canela." 
    }
];

async function renderProductos() {
    const grid = document.getElementById('grid-productos');
    if (!grid) return;

    let productos = [];

    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            productos = await response.json();
        }
    } catch (e) {
        console.warn("Servidor backend no detectado, cargando datos iniciales:", e);
    }

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
        productos = productosIniciales;
    }

    grid.innerHTML = '';
    productos.forEach(p => {
        grid.innerHTML += `
            <div class="card">
                <span class="categoria">${p.categoria}</span>
                <h3>${p.nombre}</h3>
                <p>${p.desc}</p>
                <p class="precio">$${Number(p.precio).toLocaleString('es-CO')} COP</p>
                ${esAdmin ? `<button onclick="eliminarProducto(${p.id})" class="btn-secondary" style="margin-top: 10px; background-color: #c62828;">Eliminar</button>` : ''}
            </div>
        `;
    });
}

async function eliminarProducto(id) {
    if (!esAdmin) return;
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    } catch (e) {
        console.error("Error al eliminar producto:", e);
    }
    renderProductos();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderProductos);
} else {
    renderProductos();
}

document.getElementById('form-contacto')?.addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('mensaje-exito').classList.remove('hidden');
    this.reset();
});

document.getElementById('btn-send')?.addEventListener('click', consultarIA);
document.getElementById('user-input')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') consultarIA();
});

function consultarIA() {
    const input = document.getElementById('user-input');
    const consulta = input.value.trim().toLowerCase();
    if (!consulta) return;

    const chat = document.getElementById('chat-messages');

    chat.innerHTML += `<div class="msg user">${input.value}</div>`;
    input.value = '';

    let respuesta = "Para cualquier ocasión te sugiero nuestra **Torta de Cumpleaños Especial** o una **Caja de Alfajores** para compartir.";

    if (consulta.includes('cumpleaños') || consulta.includes('fiesta') || consulta.includes('celebrar')) {
        respuesta = "🎉 ¡Para una celebración especial nada le gana a nuestra **Torta de Cumpleaños**! Te recomiendo probar el sabor de *Chocolate Fudgy* o *Frutos Rojos*.";
    } else if (consulta.includes('regalo') || consulta.includes('detalle') || consulta.includes('amigo') || consulta.includes('novio')) {
        respuesta = "🎁 Para un lindo regalo te sugiero nuestra **Caja de Cupcakes x6** (el sabor *Red Velvet* es el favorito) o unos **Alfajores tradicionales**.";
    } else if (consulta.includes('frío') || consulta.includes('refrescante') || consulta.includes('queso') || consulta.includes('ácido')) {
        respuesta = "🍰 Si te gustan las texturas cremosas y frescas, te recomiendo a ojos cerrados el **Cheesecake de Maracuyá** o *Frutos Rojos*.";
    } else if (consulta.includes('café') || consulta.includes('tarde') || consulta.includes('antojo') || consulta.includes('crujiente')) {
        respuesta = "☕ Para acompañar el café de la tarde, lo ideal es nuestro **Combo de Galletas con Chispas** o los **Palitos Crunch de Canela**.";
    } else if (consulta.includes('chocolate')) {
        respuesta = "🍫 ¡Si eres amante del chocolate, debes probar los **Alfajores bañados en Chocolate Negro** o la **Torta Chocolate Fudgy**!";
    }

    setTimeout(() => {
        chat.innerHTML += `<div class="msg bot">${respuesta}</div>`;
        chat.scrollTop = chat.scrollHeight;
    }, 400);
}

document.getElementById('form-login')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;

    if (user === 'KeyDona4545' && pass === '05042009MATP') {
        esAdmin = true;
        renderProductos();
        document.getElementById('admin-login-box').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('hidden');
        document.getElementById('login-error').classList.add('hidden');
    } else {
        document.getElementById('login-error').classList.remove('hidden');
    }
});

document.getElementById('btn-logout')?.addEventListener('click', function() {
    esAdmin = false;
    renderProductos();
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('admin-login-box').classList.remove('hidden');
    document.getElementById('form-login').reset();
});

document.getElementById('form-nuevo-producto')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const nombre = document.getElementById('prod-nombre').value;
    const categoria = document.getElementById('prod-categoria').value;
    const precio = Number(document.getElementById('prod-precio').value);
    const desc = document.getElementById('prod-desc').value;

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, categoria, precio, desc })
        });

        if (res.ok) {
            alert('¡Nuevo postre guardado con éxito en el catálogo!');
            this.reset();
        } else {
            const errData = await res.json();
            alert('Error al guardar en Supabase: ' + (errData.error || 'Verifica los permisos RLS'));
        }
    } catch (e) {
        console.error("Error al registrar producto:", e);
        alert('Error de conexión: asegura haber ejecutado "npm start" en tu terminal.');
    }

    renderProductos();
});
