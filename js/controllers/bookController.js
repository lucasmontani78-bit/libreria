export class BookController {
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
    // Navegación
    document.getElementById('btnNavHome').onclick = () => {
      this.updateDashboard();
      this.view.switchView('home');
    };
    this.view.navBtnHome.onclick = () => {
      this.updateDashboard();
      this.view.switchView('home');
    };
    this.view.navBtnCatalog.onclick = () => {
      this.renderCatalog();
      this.view.switchView('catalog');
    };
    this.view.navBtnUpload.onclick = () => this.view.setupCreateForm();

    // Botones del Dashboard / Menú Principal
    document.getElementById('heroGoCatalog').onclick = () => {
      this.renderCatalog();
      this.view.switchView('catalog');
    };
    document.getElementById('heroGoUpload').onclick = () => this.view.setupCreateForm();
    document.getElementById('cardNavCatalog').onclick = () => {
      this.renderCatalog();
      this.view.switchView('catalog');
    };
    document.getElementById('cardNavUpload').onclick = () => this.view.setupCreateForm();
    document.getElementById('cardNavRecent').onclick = () => {
      const books = this.model.getAll();
      if (books.length > 0) {
        this.handleReadBook(books[books.length - 1].id);
      } else {
        this.view.setupCreateForm();
      }
    };
    document.getElementById('btnSeeAllRecent').onclick = () => {
      this.renderCatalog();
      this.view.switchView('catalog');
    };

    // Botones auxiliares
    document.getElementById('btnEmptyCreate').onclick = () => this.view.setupCreateForm();
    document.getElementById('btnCancelForm').onclick = () => {
      this.updateDashboard();
      this.view.switchView('home');
    };
    document.getElementById('btnBackToCatalog').onclick = () => {
      this.renderCatalog();
      this.view.switchView('catalog');
    };

    // Búsqueda
    document.getElementById('searchInput').oninput = (e) => {
      const filtered = this.model.filter(e.target.value);
      this.renderCatalog(filtered);
    };

    // Eventos del formulario
    this.view.uploadFile.onchange = (e) => this.handlePdfFileChange(e);
    this.view.bookForm.onsubmit = (e) => this.handleFormSubmit(e);
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
