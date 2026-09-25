export class LibraryView {
  constructor() {
    // Vistas
    this.viewCatalog = document.getElementById('viewCatalog');
    this.viewUpload = document.getElementById('viewUpload');
    this.viewReader = document.getElementById('viewReader');

    // Navegación
    this.navBtnCatalog = document.getElementById('navBtnCatalog');
    this.navBtnUpload = document.getElementById('navBtnUpload');

    // Catálogo
    this.booksGrid = document.getElementById('booksGrid');
    this.emptyState = document.getElementById('emptyCatalogState');

    // Formulario
    this.bookForm = document.getElementById('bookForm');
    this.editingBookId = document.getElementById('editingBookId');
    this.pdfDataUrl = document.getElementById('pdfDataUrl');
    this.uploadTitle = document.getElementById('uploadTitle');
    this.uploadAuthor = document.getElementById('uploadAuthor');
    this.uploadGenre = document.getElementById('uploadGenre');
    this.uploadCover = document.getElementById('uploadCover');
    this.uploadFile = document.getElementById('uploadFile');
    this.pdfStatusText = document.getElementById('pdfStatusText');

    // Lector
    this.readerTitle = document.getElementById('readerTitle');
    this.readerAuthor = document.getElementById('readerAuthor');
    this.readerDownloadBtn = document.getElementById('readerDownloadBtn');
    this.pdfViewer = document.getElementById('pdfViewer');
  }

  switchView(viewName) {
    this.viewCatalog.classList.add('hidden');
    this.viewUpload.classList.add('hidden');
    this.viewReader.classList.add('hidden');

    this.navBtnCatalog.className = "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:bg-slate-100";
    this.navBtnUpload.className = "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:bg-slate-100";

    if (viewName === 'catalog') {
      this.viewCatalog.classList.remove('hidden');
      this.navBtnCatalog.className = "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-indigo-50 text-indigo-700";
    } else if (viewName === 'upload') {
      this.viewUpload.classList.remove('hidden');
      this.navBtnUpload.className = "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-indigo-50 text-indigo-700";
    } else if (viewName === 'reader') {
      this.viewReader.classList.remove('hidden');
    }

    if (window.lucide) window.lucide.createIcons();
  }

  renderBooks(books, onRead, onEdit, onDelete) {
    this.booksGrid.innerHTML = '';

    if (books.length === 0) {
      this.emptyState.classList.remove('hidden');
      this.emptyState.classList.add('flex');
      return;
    }

    this.emptyState.classList.add('hidden');
    this.emptyState.classList.remove('flex');

    books.forEach(book => {
      const card = document.createElement('div');
      card.className = "bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group cursor-pointer";
      card.onclick = () => onRead(book.id);

      card.innerHTML = `
        <div>
          <div class="h-48 w-full bg-slate-100 overflow-hidden relative">
            <img src="${book.cover}" alt="${book.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80'">
            <span class="absolute top-2 right-2 bg-slate-900/70 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
              ${book.genre || 'PDF'}
            </span>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-slate-800 text-base line-clamp-1">${book.title}</h3>
            <p class="text-xs text-slate-500 mb-2">${book.author}</p>
            <span class="inline-flex items-center space-x-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              <i data-lucide="file" class="w-3 h-3"></i>
              <span>Documento PDF</span>
            </span>
          </div>
        </div>

        <div class="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between" onclick="event.stopPropagation()">
          <button class="btn-read text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1">
            <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
            <span>Leer PDF</span>
          </button>
          <div class="flex items-center space-x-1">
            <button class="btn-edit p-1 text-slate-400 hover:text-indigo-600 rounded" title="Editar">
              <i data-lucide="edit-2" class="w-4 h-4"></i>
            </button>
            <button class="btn-delete p-1 text-slate-400 hover:text-red-600 rounded" title="Eliminar">
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
    this.pdfStatusText.className = 'text-xs text-slate-500 mt-1';
    
    document.getElementById('formHeaderTitle').innerHTML = `
      <i data-lucide="upload-cloud" class="w-6 h-6 text-indigo-600"></i>
      <h2 class="text-xl font-bold text-slate-900">Cargar Nuevo Libro PDF</h2>
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
    this.pdfStatusText.className = 'text-xs text-emerald-600 font-medium mt-1';

    document.getElementById('formHeaderTitle').innerHTML = `
      <i data-lucide="edit-3" class="w-6 h-6 text-indigo-600"></i>
      <h2 class="text-xl font-bold text-slate-900">Editar Libro</h2>
    `;
    document.getElementById('formHeaderSubtitle').innerText = 'Modifica los datos o sube un nuevo PDF.';
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
