import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBookOpen, FaCalendarAlt, FaCheckCircle, FaFilter, FaLayerGroup, FaTimesCircle, FaUser } from 'react-icons/fa';
import { useBooks } from '../context/BookContext';
import './Books.css';

const Books = () => {
  const { books, loading, error, refreshBooks } = useBooks();
  const navigate = useNavigate();

  useEffect(() => {
    refreshBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [filterCategory, setFilterCategory] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  const categories = Array.from(new Set(books.map((b) => b.category))).sort();
  const authors = Array.from(new Set(books.map((b) => b.author))).sort();

  const filteredBooks = books.filter(
    (book) =>
      (filterCategory === '' || book.category === filterCategory) &&
      (filterAuthor === '' || book.author === filterAuthor) &&
      (filterStatus === '' || (filterStatus === 'AVAILABLE' ? book.status === 'AVAILABLE' : book.status !== 'AVAILABLE')) &&
      (search === '' || book.title.toLowerCase().includes(search.toLowerCase()))
  );

  const uniqueBooks = filteredBooks.filter((book, idx, arr) => arr.findIndex((b) => b.title === book.title) === idx);

  const handleBorrow = (title: string) => {
    alert(`Please visit the circulation desk to borrow "${title}". Remember to bring your library ID.`);
  };

  const handleReadEbook = (id: number) => {
    navigate(`/reader/books/${id}?tab=read`);
  };

  if (loading) return <p className="books-empty">Loading books…</p>;
  if (error) return <p className="books-empty">Something went wrong: {error}</p>;
  if (!books.length) return <p className="books-empty">No books available at the moment.</p>;

  const resetFilters = () => {
    setFilterCategory('');
    setFilterAuthor('');
    setFilterStatus('');
    setSearch('');
  };

  return (
    <div className="books">
      <header className="books__header">
        <div>
          <p className="landing__eyebrow">Catalogue</p>
          <h2>Discover titles across every discipline</h2>
          <p>Use search and filters to narrow down exactly what you feel like reading.</p>
        </div>
        <button type="button" className="btn-muted" onClick={() => refreshBooks()}>
          Refresh
        </button>
      </header>

      <div className="books__toolbar">
        <div className="field field--icon">
          <FaFilter />
          <input type="text" placeholder="Search by title" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="toolbar__filters">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select value={filterAuthor} onChange={(e) => setFilterAuthor(e.target.value)}>
            <option value="">Author</option>
            {authors.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="UNAVAILABLE">Checked out</option>
          </select>
          {(filterCategory || filterAuthor || filterStatus || search) && (
            <button type="button" className="btn-muted" onClick={resetFilters}>
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="books__grid">
        {uniqueBooks.length === 0 && <p className="books-empty">No titles match your filters.</p>}
        {uniqueBooks.map((book) => (
          <article key={book.id} className="book-card" onClick={() => navigate(`/reader/books/${book.id}`)}>
            <div className="book-card__cover">
              {book.coverPhotoUrl ? <img src={book.coverPhotoUrl} alt={book.title} loading="lazy" /> : <span>{book.title.charAt(0)}</span>}
            </div>
            <div className="book-card__body">
              <div className="book-card__meta">
                <span className={`status-pill ${book.status === 'AVAILABLE' ? 'is-available' : 'is-unavailable'}`}>
                  {book.status === 'AVAILABLE' ? (
                    <>
                      <FaCheckCircle /> In stock
                    </>
                  ) : (
                    <>
                      <FaTimesCircle /> Wait list
                    </>
                  )}
                </span>
                <span className="quantity">Qty: {book.quantity ?? 0}</span>
              </div>
              <h3>{book.title}</h3>
              <p className="book-card__subtitle">{book.subTitle || 'Printed edition'}</p>
              <div className="book-card__details">
                <span>
                  <FaUser /> {book.author}
                </span>
                <span>
                  <FaLayerGroup /> {book.category}
                </span>
                <span>
                  <FaCalendarAlt /> {book.publishYear || '—'}
                </span>
              </div>
              <div className="book-card__actions">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBorrow(book.title);
                  }}
                >
                  Place hold
                </button>
                <button
                  type="button"
                  className="btn-muted"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReadEbook(book.id);
                  }}
                >
                  <FaBookOpen /> Read online
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Books;
