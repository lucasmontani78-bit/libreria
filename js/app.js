import { BookModel } from './models/bookModel.js';
import { LibraryView } from './views/libraryView.js';
import { BookController } from './controllers/bookController.js';

document.addEventListener('DOMContentLoaded', () => {
  const model = new BookModel();
  const view = new LibraryView();
  new BookController(model, view);
});
