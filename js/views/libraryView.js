export class LibraryView {
  constructor() {
    // Vistas principales
    this.viewHome = document.getElementById('viewHome');
    this.viewCatalog = document.getElementById('viewCatalog');
    this.viewUpload = document.getElementById('viewUpload');
    this.viewReader = document.getElementById('viewReader');

    // Botones de navegación del Header
    this.navBtnHome = document.getElementById('navBtnHome');
    this.navBtnCatalog = document.getElementById('navBtnCatalog');
    this.navBtnUpload = document.getElementById('navBtnUpload');

    // Componentes del Menú Principal (Dashboard)
    this.statTotalBooks = document.getElementById('statTotalBooks');
    this.recentBooksGrid = document.getElementById('recentBooksGrid');
    this.recentBookSubtext = document.getElementById('recentBookSubtext');

    // Componentes del Catálogo
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

    // Visor PDF
    this.readerTitle = document.getElementById('readerTitle');
    this.readerAuthor = document.getElementById('readerAuthor');
    this.readerDownloadBtn = document.getElementById('readerDownloadBtn');
    this.pdfViewer = document.getElementById('pdfViewer');
  }

  switchView(viewName) {
    this.viewHome.classList.add('hidden');
    this.viewCatalog.classList.add('hidden');
    this.viewUpload.classList.add('hidden');
    this.viewReader.classList.add('hidden');

    const defaultBtnClass = "px-4 py-2.5 rounded-xl text-sm font-medium text-[#706E6B] hover:text-[#1A1918] hover:bg-[#E8E3DA]/40 transition-all flex items-center space-x-2";
    const activeBtnClass = "px-4 py-2.5 rounded-xl text-sm font-medium text-[#1A1918] bg-[#E8E3DA]/60 transition-all flex items-center space-x-2";

    this.navBtnHome.className = defaultBtnClass;
    this.navBtnCatalog.className = defaultBtnClass;

    if (viewName === 'home') {
      this.viewHome.classList.remove('hidden');
      this.navBtnHome.className = activeBtnClass;
    } else if (viewName === 'catalog') {
      this.viewCatalog.classList.remove('hidden');
      this.navBtnCatalog.className = activeBtnClass;
    } else if (viewName === 'upload') {
      this.viewUpload.classList.remove('hidden');
    } else if (viewName === 'reader') {
      this.viewReader.classList.remove('hidden');
    }

    if (window.lucide) window.lucide.createIcons();
  }

  renderDashboard(books, onRead) {
    this.statTotalBooks.innerText = books.length;

    if (books.length > 0) {
      const lastBook = books[books.length - 1];
      this.recentBookSubtext.innerText = `Continuar leyendo "${lastBook.title}"`;
    } else {
      this.recentBookSubtext.innerText = "Aún no tienes libros en tu colección.";
    }

    // Mostrar los últimos 4 libros añadidos
    const recent = [...books].reverse().slice(0, 4);
    this.recentBooksGrid.innerHTML = '';

    if (recent.length === 0) {
      this.recentBooksGrid.innerHTML = `
        <p class="text-xs text-[#706E6B] col-span-full py-4 text-center">No hay libros añadidos recientemente.</p>
      `;
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
