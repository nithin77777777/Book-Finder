import { Search, BookOpen, Filter, X, Star, Calendar, User, Tag } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useQuery } from '@tanstack/react-query';

export default function BookFinderPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch books from Open Library API
  const { data: books, isLoading, error, refetch } = useQuery({
    queryKey: ['books', debouncedQuery, searchType],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return { docs: [] };
      
      const baseUrl = 'https://openlibrary.org/search.json';
      let queryParam = '';
      
      switch (searchType) {
        case 'title':
          queryParam = `title=${encodeURIComponent(debouncedQuery)}`;
          break;
        case 'author':
          queryParam = `author=${encodeURIComponent(debouncedQuery)}`;
          break;
        case 'subject':
          queryParam = `subject=${encodeURIComponent(debouncedQuery)}`;
          break;
        default:
          queryParam = `q=${encodeURIComponent(debouncedQuery)}`;
      }
      
      const response = await fetch(`${baseUrl}?${queryParam}&limit=20`);
      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    },
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      refetch();
    }
  }, [searchQuery, refetch]);

  const getBookCover = (book) => {
    if (book.cover_i) {
      return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    }
    return null;
  };

  const formatYear = (year) => {
    if (Array.isArray(year)) {
      return year[0];
    }
    return year;
  };

  const getBookRating = (book) => {
    // Simulate rating based on ratings_count (if available)
    if (book.ratings_count && book.ratings_count > 100) {
      return 4.2;
    } else if (book.ratings_count && book.ratings_count > 50) {
      return 3.8;
    }
    return 4.0;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Rethink+Sans:wght@400;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300&display=swap');
        
        .font-rethink {
          font-family: 'Rethink Sans', sans-serif;
        }
        
        .font-urbanist {
          font-family: 'Urbanist', sans-serif;
        }
        
        .card-shadow {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }
        
        .card-shadow:hover {
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }
        
        .dark .card-shadow {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        }
        
        .dark .card-shadow:hover {
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
        }
        
        .search-button {
          transition: all 250ms ease;
        }
        
        .search-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .filter-button {
          transition: all 250ms ease;
        }
        
        .book-card {
          transition: all 300ms ease;
        }
        
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        
        .dark .skeleton {
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
        }
        
        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        
        .star-filled {
          color: #fbbf24;
        }
        
        .tag-pill {
          transition: all 200ms ease;
        }
        
        .tag-pill:hover {
          background-color: #f3f4f6;
          transform: scale(1.05);
        }
        
        .dark .tag-pill:hover {
          background-color: #374151;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-sm border-b border-[#E5E5E5] dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <div className="flex items-center space-x-3">
              <BookOpen size={28} className="text-black dark:text-white" />
              <div className="font-rethink font-bold text-[22px] text-black dark:text-white">
                BookFinder
              </div>
            </div>
            <div className="font-urbanist text-[14px] text-black/60 dark:text-white/80">
              for Alex, College Student
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-rethink font-bold text-[42px] md:text-[52px] leading-[0.95] text-black dark:text-white mb-4">
            Discover Your Next
            <br />
            Great Read
          </h1>
          <p className="font-urbanist text-[16px] text-black/80 dark:text-white/90 max-w-[520px] mx-auto mb-8 leading-relaxed">
            Search millions of books by title, author, or subject. Find textbooks, novels, research materials, and more for your studies.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex flex-col md:flex-row gap-4 md:gap-0">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/40 dark:text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search by ${searchType}...`}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-white/10 rounded-l-[8px] md:rounded-r-none rounded-r-[8px] text-black dark:text-white font-urbanist text-[16px] focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>

              {/* Filter Button */}
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`filter-button px-4 py-4 border border-l-0 md:border-l border-[#E5E5E5] dark:border-white/10 bg-white dark:bg-[#1E1E1E] text-black dark:text-white rounded-none md:rounded-none ${isFilterOpen ? 'bg-gray-50 dark:bg-[#2A2A2A]' : ''}`}
              >
                <Filter size={20} />
              </button>

              {/* Search Button */}
              <button
                type="submit"
                className="search-button px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-urbanist font-semibold text-[16px] rounded-r-[8px] md:rounded-l-none rounded-l-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!searchQuery.trim()}
              >
                Search
              </button>
            </div>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-white/10 rounded-[8px] card-shadow z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-urbanist font-semibold text-[14px] text-black dark:text-white">Search Type</span>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'title', label: 'Title', icon: BookOpen },
                    { value: 'author', label: 'Author', icon: User },
                    { value: 'subject', label: 'Subject', icon: Tag }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setSearchType(type.value);
                        setIsFilterOpen(false);
                      }}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-[6px] font-urbanist text-[14px] transition-colors ${
                        searchType === type.value
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : 'bg-gray-100 dark:bg-[#2A2A2A] text-black dark:text-white hover:bg-gray-200 dark:hover:bg-[#3A3A3A]'
                      }`}
                    >
                      <type.icon size={16} />
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Results Section */}
        <div>
          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="book-card card-shadow bg-white dark:bg-[#1E1E1E] rounded-[12px] border border-[#E5E5E5] dark:border-white/10 overflow-hidden">
                  <div className="aspect-[3/4] skeleton"></div>
                  <div className="p-4">
                    <div className="h-4 skeleton rounded mb-2"></div>
                    <div className="h-3 skeleton rounded mb-1 w-3/4"></div>
                    <div className="h-3 skeleton rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-[12px] p-6 max-w-md mx-auto">
                <h3 className="font-rethink font-semibold text-[18px] text-red-800 dark:text-red-200 mb-2">
                  Search Error
                </h3>
                <p className="font-urbanist text-[14px] text-red-600 dark:text-red-300">
                  {error.message || 'Failed to search books. Please try again.'}
                </p>
              </div>
            </div>
          )}

          {/* No Results */}
          {books && books.docs && books.docs.length === 0 && debouncedQuery && !isLoading && (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-black/20 dark:text-white/20 mb-4" />
              <h3 className="font-rethink font-semibold text-[20px] text-black dark:text-white mb-2">
                No books found
              </h3>
              <p className="font-urbanist text-[16px] text-black/60 dark:text-white/60">
                Try adjusting your search terms or search type
              </p>
            </div>
          )}

          {/* Books Grid */}
          {books && books.docs && books.docs.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-rethink font-semibold text-[24px] text-black dark:text-white">
                  Found {books.numFound?.toLocaleString() || books.docs.length} books
                </h2>
                <div className="font-urbanist text-[14px] text-black/60 dark:text-white/60">
                  Showing {books.docs.length} results
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.docs.map((book, index) => (
                  <div key={`${book.key}-${index}`} className="book-card card-shadow bg-white dark:bg-[#1E1E1E] rounded-[12px] border border-[#E5E5E5] dark:border-white/10 overflow-hidden">
                    {/* Book Cover */}
                    <div className="aspect-[3/4] relative bg-gray-100 dark:bg-[#2A2A2A]">
                      {getBookCover(book) ? (
                        <img
                          src={getBookCover(book)}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={48} className="text-black/20 dark:text-white/20" />
                        </div>
                      )}
                      
                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-[6px] px-2 py-1 flex items-center space-x-1">
                        <Star size={12} className="star-filled fill-current" />
                        <span className="font-urbanist text-[12px] font-medium text-black dark:text-white">
                          {getBookRating(book)}
                        </span>
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="p-4">
                      <h3 className="font-urbanist font-semibold text-[16px] text-black dark:text-white mb-2 line-clamp-2 leading-tight">
                        {book.title}
                      </h3>
                      
                      {book.author_name && (
                        <p className="font-urbanist text-[14px] text-black/70 dark:text-white/70 mb-1">
                          by {book.author_name[0]}
                          {book.author_name.length > 1 && ` +${book.author_name.length - 1} more`}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mb-3">
                        {book.first_publish_year && (
                          <div className="flex items-center space-x-1 text-black/50 dark:text-white/50">
                            <Calendar size={12} />
                            <span className="font-urbanist text-[12px]">
                              {formatYear(book.first_publish_year)}
                            </span>
                          </div>
                        )}
                        
                        {book.language && (
                          <span className="font-urbanist text-[12px] text-black/50 dark:text-white/50 uppercase">
                            {book.language[0]}
                          </span>
                        )}
                      </div>

                      {/* Subjects */}
                      {book.subject && book.subject.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {book.subject.slice(0, 2).map((subject, idx) => (
                            <span
                              key={idx}
                              className="tag-pill font-urbanist text-[11px] px-2 py-1 bg-gray-100 dark:bg-[#2A2A2A] text-black/70 dark:text-white/70 rounded-[4px]"
                            >
                              {subject.length > 15 ? `${subject.substring(0, 15)}...` : subject}
                            </span>
                          ))}
                          {book.subject.length > 2 && (
                            <span className="font-urbanist text-[11px] px-2 py-1 text-black/50 dark:text-white/50">
                              +{book.subject.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}