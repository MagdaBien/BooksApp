{

  ('use strict');

  const templates = {
    tplBook: Handlebars.compile(document.querySelector('#template-book').innerHTML)
  };

  class BooksList {
    constructor() {
      const thisBooksList = this;

      thisBooksList.favoriteBooks = [];
      thisBooksList.filters = [];
      thisBooksList.getElements();
    }

    getElements() {
      const thisBooksList = this;
      thisBooksList.bookListView = document.querySelector('.books-list');
      thisBooksList.bookListSelector = document.querySelector('.books-list');
      thisBooksList.formSelector = document.querySelector('.filters');
    }

    initData() {
      const thisBooksList = this;
      thisBooksList.books = dataSource.books;

      for (let book of thisBooksList.books) {
        const renderedBook = thisBooksList.renderBook(book);
        thisBooksList.bookListView.appendChild(renderedBook);
      }
      thisBooksList.initActions();
    }

    initActions() {
      const thisBooksList = this;
      thisBooksList.bookListSelector.addEventListener(
        'dblclick',
        function (event) {
          event.preventDefault();
          const clickedElement = event.target.offsetParent;

          if (clickedElement.classList.contains('book__image')) {
            const bookId = clickedElement.getAttribute('data-id');
            if (thisBooksList.favoriteBooks.includes(bookId)) {
              clickedElement.classList.remove('favorite');
              const indexBookId = thisBooksList.favoriteBooks.indexOf(bookId);
              thisBooksList.favoriteBooks.splice(indexBookId, 1);
            } else {
              clickedElement.classList.add('favorite');
              thisBooksList.favoriteBooks.push(bookId);
            }
            //console.log("favorite: ", thisBooksList.favoriteBooks);
          }
        }
      );

      thisBooksList.formSelector.addEventListener('change', function (event) {
        event.preventDefault();
        const changedElement = event.target;
        if (
          changedElement.tagName == 'INPUT' &&
          changedElement.type == 'checkbox' &&
          changedElement.name == 'filter'
        ) {
          if (changedElement.checked) {
            thisBooksList.filters.push(changedElement.value);
          } else {
            const indexFilterId = thisBooksList.filters.indexOf(
              changedElement.value
            );
            thisBooksList.filters.splice(indexFilterId, 1);
          }
          //console.log("filters: ", thisBooksList.filters);
          thisBooksList.hideBooks();
        }
      });
    }

    // return element dom for one book using templete
    renderBook(book) {
      const thisBooksList = this;
      thisBooksList.book = book;

      thisBooksList.book.ratingBgc = thisBooksList.determineRatingBgc(
        thisBooksList.book.rating
      );
      thisBooksList.book.ratingWidth =
        (parseInt(thisBooksList.book.rating) / 10) * 100;
      const tplBook = templates.tplBook;
      const generatedHTML = tplBook(thisBooksList.book);
      const domBook = utils.createDOMFromHTML(generatedHTML);
      return domBook;
    }

    hideBooks() {
      const thisBooksList = this;
      // check each book ...
      for (let book of thisBooksList.books) {
        let hiddenBook = false;

        // ... according the filter
        for (const filter of thisBooksList.filters) {
          if (!book.details[filter]) {
            hiddenBook = true;
            break;
          }
        }

        // hide or show the book
        const bookToHideSelector = document.querySelector(
          '.book__image[data-id="' + book.id + '"]'
        );
        bookToHideSelector.classList.remove('hidden');
        if (hiddenBook) {
          bookToHideSelector.classList.add('hidden');
        }
      }
    }

    determineRatingBgc(rating) {
      let background = '';
      if (rating < 6) {
        background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if (rating > 6 && rating <= 8) {
        background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if (rating > 8 && rating <= 9) {
        background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else {
        background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
      return background;
    }
  }

  const app = new BooksList();
  app.initData();
}
