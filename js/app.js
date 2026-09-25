// ==========================================
// 1. MODELO (BookModel)
// ==========================================
class BookModel {
  constructor() {
    this.storageKey = 'interactive_library_books';
    this.books = this.loadFromStorage();
  }

  loadFromStorage() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { return []; }
    }
    return [];
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.books));
      return true;
    } catch (e) {
      alert('El archivo PDF supera el espacio permitido por el navegador.');
      return false;
    }
  }

  getAll() { return this.books; }
  getById(id) { return this.books.find(b => b.id === id); }

  add(bookData) {
    const newBook = {
      id: Date.now().toString(),
      title: bookData.title,
      author: bookData.author,
      genre: bookData.genre || 'General',
      cover: bookData.cover || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80',
      pdfUrl: bookData.pdfUrl
    };
    this.books.push(newBook);
    this.saveToStorage();
    return newBook;
  }

  update(id, updatedData) {
    const index = this.books.findIndex(b => b.id === id);
    if (index !== -1) {
      this.books[index] = { ...this.books[index], ...updatedData };
      this.saveToStorage();
      return true;
    }
    return false;
  }

  delete(id) {
    this.books = this.books.filter(b => b.id !== id);
    this.saveToStorage();
  }

  filter(query) {
    const q = query.toLowerCase();
    return this.books.filter(b => 
      b.title.toLowerCase().includes(q) || 
      b.author.toLowerCase().includes(q)
    );
  }
}

// ==========================================
// 2. VISTA (LibraryView)
// ==========================================
class LibraryView {
  constructor() {
    this.viewHome = document.getElementById('viewHome');
    this.viewCatalog = document.getElementById('viewCatalog');
    this.viewUpload = document.getElementById('viewUpload');
    this.viewReader = document.getElementById('viewReader');

    this.navBtnHome = document.getElementById('navBtnHome');
    this.navBtnCatalog = document.getElementById('navBtnCatalog');
    this.navBtnUpload = document.getElementById('navBtnUpload');

    this.statTotalBooks = document.getElementById('statTotalBooks');
    this.recentBooksGrid = document.getElementById('recentBooksGrid');
    this.recentBookSubtext = document.getElementById('recentBookSubtext');

    this.booksGrid = document.getElementById('booksGrid');
    this.emptyState = document.getElementById('emptyCatalogState');

    this.bookForm = document.getElementById('bookForm');
    this.editingBookId = document.getElementById('editingBookId');
    this.pdfDataUrl = document.getElementById('pdfDataUrl');
    this.uploadTitle = document.getElementById('uploadTitle');
    this.uploadAuthor = document.getElementById('uploadAuthor');
    this.uploadGenre = document.getElementById('uploadGenre');
    this.uploadCover = document.getElementById('uploadCover');
    this.uploadFile = document.getElementById('uploadFile');
    this.pdfStatusText = document.getElementById('pdfStatusText');

    this.readerTitle = document.getElementById('readerTitle');
    this.readerAuthor = document.getElementById('readerAuthor');
    this.readerDownloadBtn = document.getElementById('readerDownloadBtn');
    this.pdfViewer = document.getElementById('pdfViewer');
  }

  switchView(viewName) {
    if(this.viewHome) this.viewHome.classList.add('hidden');
    if(this.viewCatalog) this.viewCatalog.classList.add('hidden');
    if(this.viewUpload) this.viewUpload.classList.add('hidden');
    if(this.viewReader) this.viewReader.classList.add('hidden');

    const defaultBtnClass = "px-4 py-2.5 rounded-xl text-sm font-medium text-[#706E6B] hover:text-[#1A1918] hover:bg-[#E8E3DA]/40 transition-all flex items-center space-x-2";
    const activeBtnClass = "px-4 py-2.5 rounded-xl text-sm font-medium text-[#1A1918] bg-[#E8E3DA]/60 transition-all flex items-center space-x-2";

    if(this.navBtnHome) this.navBtnHome.className = defaultBtnClass;
    if(this.navBtnCatalog) this.navBtnCatalog.className = defaultBtnClass;

    if (viewName === 'home' && this.viewHome) {
      this.viewHome.classList.remove('hidden');
      if(this.navBtnHome) this.navBtnHome.className = activeBtnClass;
    } else if (viewName === 'catalog' && this.viewCatalog) {
      this.viewCatalog.classList.remove('hidden');
      if(this.navBtnCatalog) this.navBtnCatalog.className = activeBtnClass;
    } else if (viewName === 'upload' && this.viewUpload) {
      this.viewUpload.classList.remove('hidden');
    } else if (viewName === 'reader' && this.viewReader) {
      this.viewReader.classList.remove('hidden');
    }

    if (window.lucide) window.lucide.createIcons();
  }

  renderDashboard(books, onRead) {
    if(this.statTotalBooks) this.statTotalBooks.innerText = books.length;

    if (books.length > 0) {
      const lastBook = books[books.length - 1];
      if(this.recentBookSubtext) this.recentBookSubtext.innerText = `Continuar leyendo "${lastBook.title}"`;
    } else {
      if(this.recentBookSubtext) this.recentBookSubtext.innerText = "Aún no tienes libros en tu colección.";
    }

    const recent = [...books].reverse().slice(0, 4);
    if(this.recentBooksGrid) {
      this.recentBooksGrid.innerHTML = '';
      if (recent.length === 0) {
        this.recentBooksGrid.innerHTML = `<p class="text-xs text-[#706E6B] col-span-full py-4 text-center">No hay libros añadidos recientemente.</p>`;
        return;
      }

      recent.forEach(book => {
        const card = document.createElement('div');
        card.className = "bg-white rounded-2xl p-3.5 book-card-shadow hover:border-[#2D4B3E]/40 transition-all cursor-pointer border border-[#E8E3DA]/70 flex space-x-3 items-center";
        card.onclick = () => onRead(book.id);

        card.innerHTML = `
          <img src="${book.cover}" alt="${book.title}" class="w-12 h-16 object-cover rounded-lg shadow-sm bg-[#F3EFE6]" onerror="this.src='https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80'">
          <div class="overflow-hidden">
            <h4 class="font-serif-book font-semibold text-[#1A1918] text-sm line-clamp-1">${book.title}</h4>
            <p class="text-xs text-[#706E6B] mt-0.5 line-clamp-1">${book.author}</p>
          </div>
        `;
        this.recentBooksGrid.appendChild(card);
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }

  renderBooks(books, onRead, onEdit, onDelete) {
    if(!this.booksGrid) return;
    this.booksGrid.innerHTML = '';

    if (books.length === 0) {
      if(this.emptyState) {
        this.emptyState.classList.remove('hidden');
        this.emptyState.classList.add('flex');
      }
      return;
    }

    if(this.emptyState) {
      this.emptyState.classList.add('hidden');
      this.emptyState.classList.remove('flex');
    }

    books.forEach(book => {
      const card = document.createElement('div');
      card.className = "bg-white rounded-2xl p-4 book-card-shadow transition-all duration-300 flex flex-col justify-between group cursor-pointer border border-[#E8E3DA]/70";
      card.onclick = () => onRead(book.id);

      card.innerHTML = `
        <div>
          <div class="h-56 w-full rounded-xl overflow-hidden relative shadow-inner bg-[#F3EFE6]">
            <img src="${book.cover}" alt="${book.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80'">
            <span class="absolute top-3 right-3 bg-[#1A1918]/80 text-[#FBF9F5] text-[10px] font-medium px-2.5 py-1 rounded-full backdrop-blur-md tracking-wider">
              ${book.genre || 'PDF'}
            </span>
          </div>

          <div class="pt-4 px-1">
            <h3 class="font-serif-book font-semibold text-[#1A1918] text-lg leading-snug line-clamp-1">${book.title}</h3>
            <p class="text-xs text-[#706E6B] mt-1 font-medium">${book.author}</p>
          </div>
        </div>

        <div class="pt-4 mt-3 border-t border-[#F0ECE1] flex items-center justify-between" onclick="event.stopPropagation()">
          <button class="btn-read text-xs font-semibold text-[#2D4B3E] hover:text-[#1F352B] flex items-center space-x-1.5 transition-colors">
            <i data-lucide="book-open" class="w-4 h-4"></i>
            <span>Leer PDF</span>
          </button>
          <div class="flex items-center space-x-1">
            <button class="btn-edit p-1.5 text-[#706E6B] hover:text-[#2D4B3E] rounded-lg hover:bg-[#F3EFE6] transition-colors" title="Editar">
              <i data-lucide="edit-3" class="w-4 h-4"></i>
            </button>
            <button class="btn-delete p-1.5 text-[#706E6B] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Eliminar">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `;

      card.querySelector('.btn-read').onclick = (e) => { e.stopPropagation(); onRead(book.id); };
      card.querySelector('.btn-edit').onclick = (e) => { e.stopPropagation(); onEdit(book.id); };
      card.querySelector('.btn-delete').onclick = (e) => { e.stopPropagation(); onDelete(book.id); };

      this.booksGrid.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  setupCreateForm() {
    this.editingBookId.value = '';
    this.pdfDataUrl.value = '';
    this.bookForm.reset();
    this.pdfStatusText.innerText = 'Ningún archivo PDF seleccionado aún.';
    this.pdfStatusText.className = 'text-xs text-[#706E6B] mt-2';
    
    document.getElementById('formHeaderTitle').innerHTML = `
      <i data-lucide="file-plus-2" class="w-6 h-6 text-[#2D4B3E]"></i>
      <h2 class="font-serif-book text-2xl font-semibold text-[#1A1918]">Cargar Nuevo Libro PDF</h2>
    `;
    document.getElementById('formHeaderSubtitle').innerText = 'Selecciona un archivo PDF de tu equipo e ingresa sus detalles.';
    document.getElementById('formSubmitBtn').innerHTML = `<i data-lucide="check" class="w-4 h-4"></i><span>Guardar Libro</span>`;
    
    this.switchView('upload');
  }

  setupEditForm(book) {
    this.editingBookId.value = book.id;
    this.uploadTitle.value = book.title;
    this.uploadAuthor.value = book.author;
    this.uploadGenre.value = book.genre || '';
    this.uploadCover.value = book.cover || '';
    this.pdfDataUrl.value = book.pdfUrl || '';
    this.uploadFile.value = '';

    this.pdfStatusText.innerText = '✓ Documento PDF actual cargado. (Selecciona uno nuevo si deseas reemplazarlo)';
    this.pdfStatusText.className = 'text-xs text-emerald-700 font-medium mt-2';

    document.getElementById('formHeaderTitle').innerHTML = `
      <i data-lucide="edit-3" class="w-6 h-6 text-[#2D4B3E]"></i>
      <h2 class="font-serif-book text-2xl font-semibold text-[#1A1918]">Editar Libro</h2>
    `;
    document.getElementById('formHeaderSubtitle').innerText = 'Modifica los datos o sube un nuevo archivo PDF.';
    document.getElementById('formSubmitBtn').innerHTML = `<i data-lucide="save" class="w-4 h-4"></i><span>Actualizar Cambios</span>`;

    this.switchView('upload');
  }

  openReader(book) {
    this.readerTitle.innerText = book.title;
    this.readerAuthor.innerText = book.author;
    this.readerDownloadBtn.href = book.pdfUrl;
    this.readerDownloadBtn.download = `${book.title}.pdf`;
    this.pdfViewer.src = book.pdfUrl;

    this.switchView('reader');
  }
}

// ==========================================
// 3. CONTROLADOR (BookController)
// ==========================================
class BookController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.init();
  }

  init() {
    this.updateDashboard();
    this.renderCatalog();
    this.bindEvents();
    this.view.switchView('home');
  }

  updateDashboard() {
    const books = this.model.getAll();
    this.view.renderDashboard(books, (id) => this.handleReadBook(id));
  }

  renderCatalog(booksToRender = null) {
    const list = booksToRender || this.model.getAll();
    this.view.renderBooks(
      list,
      (id) => this.handleReadBook(id),
      (id) => this.handleEditBook(id),
      (id) => this.handleDeleteBook(id)
    );
  }

  bindEvents() {
    const btnNavHome = document.getElementById('btnNavHome');
    if(btnNavHome) {
      btnNavHome.onclick = () => {
        this.updateDashboard();
        this.view.switchView('home');
      };
    }

    if(this.view.navBtnHome) {
      this.view.navBtnHome.onclick = () => {
        this.updateDashboard();
        this.view.switchView('home');
      };
    }

    if(this.view.navBtnCatalog) {
      this.view.navBtnCatalog.onclick = () => {
        this.renderCatalog();
        this.view.switchView('catalog');
      };
    }

    if(this.view.navBtnUpload) {
      this.view.navBtnUpload.onclick = () => this.view.setupCreateForm();
    }

    const heroGoCatalog = document.getElementById('heroGoCatalog');
    if(heroGoCatalog) heroGoCatalog.onclick = () => { this.renderCatalog(); this.view.switchView('catalog'); };

    const heroGoUpload = document.getElementById('heroGoUpload');
    if(heroGoUpload) heroGoUpload.onclick = () => this.view.setupCreateForm();

    const cardNavCatalog = document.getElementById('cardNavCatalog');
    if(cardNavCatalog) cardNavCatalog.onclick = () => { this.renderCatalog(); this.view.switchView('catalog'); };

    const cardNavUpload = document.getElementById('cardNavUpload');
    if(cardNavUpload) cardNavUpload.onclick = () => this.view.setupCreateForm();

    const cardNavRecent = document.getElementById('cardNavRecent');
    if(cardNavRecent) {
      cardNavRecent.onclick = () => {
        const books = this.model.getAll();
        if (books.length > 0) {
          this.handleReadBook(books[books.length - 1].id);
        } else {
          this.view.setupCreateForm();
        }
      };
    }

    const btnSeeAllRecent = document.getElementById('btnSeeAllRecent');
    if(btnSeeAllRecent) btnSeeAllRecent.onclick = () => { this.renderCatalog(); this.view.switchView('catalog'); };

    const btnEmptyCreate = document.getElementById('btnEmptyCreate');
    if(btnEmptyCreate) btnEmptyCreate.onclick = () => this.view.setupCreateForm();

    const btnCancelForm = document.getElementById('btnCancelForm');
    if(btnCancelForm) btnCancelForm.onclick = () => { this.updateDashboard(); this.view.switchView('home'); };

    const btnBackToCatalog = document.getElementById('btnBackToCatalog');
    if(btnBackToCatalog) btnBackToCatalog.onclick = () => { this.renderCatalog(); this.view.switchView('catalog'); };

    const searchInput = document.getElementById('searchInput');
    if(searchInput) {
      searchInput.oninput = (e) => {
        const filtered = this.model.filter(e.target.value);
        this.renderCatalog(filtered);
      };
    }

    if(this.view.uploadFile) this.view.uploadFile.onchange = (e) => this.handlePdfFileChange(e);
    if(this.view.bookForm) this.view.bookForm.onsubmit = (e) => this.handleFormSubmit(e);
  }

  handlePdfFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Selecciona un archivo PDF válido.');
      e.target.value = '';
      return;
    }

    this.view.pdfStatusText.innerText = 'Cargando y procesando archivo PDF...';
    this.view.pdfStatusText.className = 'text-xs text-[#2D4B3E] font-medium mt-2';

    const reader = new FileReader();
    reader.onload = (event) => {
      this.view.pdfDataUrl.value = event.target.result;
      this.view.pdfStatusText.innerText = `✓ PDF cargado correctamente (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
      this.view.pdfStatusText.className = 'text-xs text-emerald-700 font-medium mt-2';
    };
    reader.readAsDataURL(file);
  }

  handleFormSubmit(e) {
    e.preventDefault();

    const id = this.view.editingBookId.value;
    const title = this.view.uploadTitle.value.trim();
    const author = this.view.uploadAuthor.value.trim();
    const genre = this.view.uploadGenre.value.trim();
    const cover = this.view.uploadCover.value.trim();
    const pdfUrl = this.view.pdfDataUrl.value;

    if (!pdfUrl) {
      alert('Debes adjuntar un archivo PDF.');
      return;
    }

    if (id) {
      this.model.update(id, { title, author, genre, cover, pdfUrl });
    } else {
      this.model.add({ title, author, genre, cover, pdfUrl });
    }

    this.updateDashboard();
    this.renderCatalog();
    this.view.switchView('catalog');
  }

  handleReadBook(id) {
    const book = this.model.getById(id);
    if (book) this.view.openReader(book);
  }

  handleEditBook(id) {
    const book = this.model.getById(id);
    if (book) this.view.setupEditForm(book);
  }

  handleDeleteBook(id) {
    if (confirm('¿Deseas eliminar este libro de la colección?')) {
      this.model.delete(id);
      this.updateDashboard();
      this.renderCatalog();
    }
  }
}

// ==========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const model = new BookModel();
  const view = new LibraryView();
  new BookController(model, view);
});
