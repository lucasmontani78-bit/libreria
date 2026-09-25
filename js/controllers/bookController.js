export class BookController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.init();
  }

  init() {
    this.renderCatalog();
    this.bindEvents();
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
    document.getElementById('btnNavHome').onclick = () => this.view.switchView('catalog');
    this.view.navBtnCatalog.onclick = () => {
      this.renderCatalog();
      this.view.switchView('catalog');
    };
    this.view.navBtnUpload.onclick = () => this.view.setupCreateForm();
    document.getElementById('btnEmptyCreate').onclick = () => this.view.setupCreateForm();
    document.getElementById('btnCancelForm').onclick = () => this.view.switchView('catalog');
    document.getElementById('btnBackToCatalog').onclick = () => this.view.switchView('catalog');

    // Buscador
    document.getElementById('searchInput').oninput = (e) => {
      const filtered = this.model.filter(e.target.value);
      this.renderCatalog(filtered);
    };

    // Procesamiento de archivo PDF a Base64
    this.view.uploadFile.onchange = (e) => this.handlePdfFileChange(e);

    // Guardar / Actualizar
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
    this.view.pdfStatusText.className = 'text-xs text-indigo-600 font-medium mt-1';

    const reader = new FileReader();
    reader.onload = (event) => {
      this.view.pdfDataUrl.value = event.target.result;
      this.view.pdfStatusText.innerText = `✓ PDF cargado correctamente (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
      this.view.pdfStatusText.className = 'text-xs text-emerald-600 font-medium mt-1';
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
    if (confirm('¿Deseas eliminar este libro?')) {
      this.model.delete(id);
      this.renderCatalog();
    }
  }
}   
