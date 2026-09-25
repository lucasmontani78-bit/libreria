export class BookModel {
  constructor() {
    this.storageKey = 'interactive_library_books';
    this.books = this.loadFromStorage();
  }

  loadFromStorage() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.books));
      return true;
    } catch (e) {
      alert('El archivo PDF supera el espacio permitido por el almacenamiento local del navegador.');
      return false;
    }
  }

  getAll() {
    return this.books;
  }

  getById(id) {
    return this.books.find(b => b.id === id);
  }

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
