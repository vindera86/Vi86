import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useDeferredValue,
  lazy,
  Suspense,
} from 'react';
import carsUrl from './data/cars.json?url';

import Header from './components/Header';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import CarCard from './components/CarCard';
import CompareDrawer from './components/CompareDrawer';
import TableView from './components/TableView';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import QuickResultBanner from './components/QuickResultBanner';
import VinDecodeBanner from './components/VinDecodeBanner';
import {
  isValidVinFormat,
  isVinOrFrameFormat,
  decodeVinLocal,
  decodeFrameNumber,
  decodeVinWithNhtsa,
  carMatchesYear,
} from './utils/vinDecoder';

// The detail modal + blueprint diagrams are by far the heaviest part of the app
// and are only needed once a card is opened, so they load in their own chunk.
const CarDetailModal = lazy(() => import('./components/CarDetailModal'));
const SparkPlugGuideModal = lazy(() => import('./components/SparkPlugGuideModal'));

const CARS_PER_PAGE = 24;

export default function App() {
  // The catalogue (420 kB) is served as a static JSON asset instead of being
  // bundled into JS: it no longer bloats the main chunk and the browser caches
  // + parses it as data, not as script.
  const [carsData, setCarsData] = useState([]);
  const [dataState, setDataState] = useState('loading'); // 'loading' | 'ready' | 'error'

  useEffect(() => {
    let cancelled = false;
    fetch(carsUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setCarsData(Array.isArray(data) ? data : []);
        setDataState('ready');
      })
      .catch(() => {
        if (!cancelled) setDataState('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('nv86-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      /* localStorage unavailable */
    }
    return 'dark';
  });
  const initialParams = useMemo(() => new URLSearchParams(window.location.search), []);

  const [winterMode, setWinterMode] = useState(() => {
    try {
      const saved = localStorage.getItem('nv86-winter');
      if (saved === 'false') return false;
      if (saved === 'true') return true;
    } catch (e) {
      /* localStorage unavailable */
    }
    return true;
  });

  const [selectedBrand, setSelectedBrand] = useState(() => initialParams.get('brand') || '');
  const [selectedFamily, setSelectedFamily] = useState(() => initialParams.get('family') || '');
  const [selectedEngine, setSelectedEngine] = useState(() => initialParams.get('engine') || '');
  const [searchQuery, setSearchQuery] = useState(() => initialParams.get('q') || '');
  const deferredQuery = useDeferredValue(searchQuery);
  const [activeQuickFilter, setActiveQuickFilter] = useState(() => {
    const f = initialParams.get('filter');
    return f === 'chain' || f === 'iridium' || f === 'vin' ? f : 'all';
  }); // 'all' | 'chain' | 'iridium' | 'vin'
  const [viewMode, setViewMode] = useState(() => (initialParams.get('view') === 'table' ? 'table' : 'grid')); // 'grid' | 'table'
  
  const [selectedCar, setSelectedCar] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, dir: 'asc' });
  const [vinInfo, setVinInfo] = useState(null);
  const [vinLoading, setVinLoading] = useState(false);

  const isVinSearch = useMemo(() => isVinOrFrameFormat(deferredQuery), [deferredQuery]);

  // Decode VIN or Japanese Frame number locally + enrich global VINs via NHTSA vPIC API
  useEffect(() => {
    const frame = decodeFrameNumber(deferredQuery);
    if (frame) {
      setVinInfo(frame);
      setVinLoading(false);
      return;
    }

    if (!isValidVinFormat(deferredQuery)) {
      setVinInfo(null);
      setVinLoading(false);
      return;
    }

    const local = decodeVinLocal(deferredQuery);
    setVinInfo(local);
    setVinLoading(true);

    const controller = new AbortController();
    decodeVinWithNhtsa(deferredQuery, controller.signal)
      .then((enriched) => {
        if (!controller.signal.aborted && enriched) {
          setVinInfo(enriched);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setVinLoading(false);
        }
      });

    return () => controller.abort();
  }, [deferredQuery]);

  // Progressive loading limit for buttery smooth 60fps scrolling
  const [visibleCount, setVisibleCount] = useState(CARS_PER_PAGE);

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    // Suppress transitions for the swap itself: animating colour across the
    // whole document was the main cost of the light/dark toggle.
    root.classList.add('theme-switching');
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
    const release = () => {
      requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
    };
    release();
    try {
      localStorage.setItem('nv86-theme', theme);
    } catch (e) {
      /* localStorage unavailable */
    }
  }, [theme]);

  // Warm the modal chunk while the browser is idle so the first open is instant
  useEffect(() => {
    const idle =
      window.requestIdleCallback ||
      ((cb) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 1200));
    const id = idle(() => {
      import('./components/CarDetailModal').catch(() => {});
    });
    return () => {
      if (window.cancelIdleCallback && typeof id === 'number') window.cancelIdleCallback(id);
    };
  }, []);

  // Persist winterMode
  useEffect(() => {
    try {
      localStorage.setItem('nv86-winter', String(winterMode));
    } catch (e) {
      /* localStorage unavailable */
    }
  }, [winterMode]);

  // Sync filters and view mode with URL query parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedBrand) params.set('brand', selectedBrand);
    if (selectedFamily) params.set('family', selectedFamily);
    if (selectedEngine) params.set('engine', selectedEngine);
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (activeQuickFilter !== 'all') params.set('filter', activeQuickFilter);
    if (viewMode !== 'grid') params.set('view', viewMode);
    const qs = params.toString();
    const nextUrl = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', nextUrl);
  }, [selectedBrand, selectedFamily, selectedEngine, searchQuery, activeQuickFilter, viewMode]);

  // Reset pagination when search or filters change
  useEffect(() => {
    setVisibleCount(CARS_PER_PAGE);
  }, [selectedBrand, selectedFamily, selectedEngine, searchQuery, activeQuickFilter]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 2200);
  }, []);

  const copyToClipboard = useCallback((text, successMsg = 'Скопировано в буфер!') => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => {
      showToast('Скопировано');
    });
  }, [showToast]);

  // Unique Brands
  const brands = useMemo(() => {
    const set = new Set(carsData.map((c) => c.brand).filter(Boolean));
    return Array.from(set).sort();
  }, [carsData]);

  // Unique Families for selected Brand
  const families = useMemo(() => {
    if (!selectedBrand) return [];
    const list = carsData
      .filter((c) => c.brand === selectedBrand)
      .map((c) => c.family || c.model)
      .filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [carsData, selectedBrand]);

  // Unique Engines for selected Brand & Family
  const engines = useMemo(() => {
    let list = carsData;
    if (selectedBrand) {
      list = list.filter((c) => c.brand === selectedBrand);
    }
    if (selectedFamily) {
      list = list.filter((c) => (c.family || c.model) === selectedFamily);
    }
    const engSet = new Set(list.map((c) => c.engine).filter(Boolean));
    return Array.from(engSet).sort();
  }, [selectedBrand, selectedFamily]);

  // Filtered cars logic.
  // The query is deferred: the input stays instant while the 275-item grid
  // re-renders at a lower priority, so typing never drops frames.
  const filteredCars = useMemo(() => {
    const q = deferredQuery.toLowerCase().trim();

    let list = carsData.filter((car) => {
      if (selectedBrand && car.brand !== selectedBrand) return false;
      if (selectedFamily && (car.family || car.model) !== selectedFamily) return false;
      if (selectedEngine && car.engine !== selectedEngine) return false;

      // Smart technical filters
      if (activeQuickFilter === 'chain') {
        if (!car.timing.toLowerCase().includes('цепь')) return false;
      } else if (activeQuickFilter === 'iridium') {
        const fullPlugs = (car.ngk + car.denso + car.bosch + car.oem).toLowerCase();
        if (!fullPlugs.includes('иридий') && !fullPlugs.includes('платина') && !fullPlugs.includes('iridium')) {
          return false;
        }
      } else if (activeQuickFilter === 'vin') {
        if (!car.oem.includes('VIN')) return false;
      }

      // VIN-based filtering when 17-char VIN is entered
      if (isVinSearch && vinInfo) {
        if (vinInfo.brands.length > 0 && !vinInfo.brands.includes(car.brand)) {
          return false;
        }
        return true;
      }

      // Regular text search query across all technical attributes
      if (q) {
        const fullText = `
          ${car.brand} 
          ${car.family} 
          ${car.model} 
          ${car.engine} 
          ${car.years} 
          ${car.oem} 
          ${car.ngk} 
          ${car.denso} 
          ${car.bosch} 
          ${car.timing} 
          ${car.belts} 
          ${car.wipers}
        `.toLowerCase();

        if (!fullText.includes(q)) return false;
      }

      return true;
    });

    // Narrow VIN matches by modelHint, excludeHint, and year when available (with safe fallback)
    if (isVinSearch && vinInfo && list.length > 0) {
      if (vinInfo.modelHint) {
        const hint = vinInfo.modelHint.toLowerCase();
        const modelMatches = list.filter((c) =>
          `${c.family} ${c.model}`.toLowerCase().includes(hint)
        );
        if (modelMatches.length > 0) list = modelMatches;
      }
      if (vinInfo.excludeHint) {
        const excl = vinInfo.excludeHint.toLowerCase();
        const nonExcluded = list.filter((c) =>
          !`${c.family} ${c.model}`.toLowerCase().includes(excl)
        );
        if (nonExcluded.length > 0) list = nonExcluded;
      }
      if (vinInfo.year) {
        const yearMatches = list.filter((c) => carMatchesYear(c.years, vinInfo.year));
        if (yearMatches.length > 0) list = yearMatches;
      }
    }

    return list;
  }, [carsData, selectedBrand, selectedFamily, selectedEngine, deferredQuery, activeQuickFilter, isVinSearch, vinInfo]);

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return { key: null, dir: 'asc' };
    });
  }, []);

  const sortedCars = useMemo(() => {
    if (!sortConfig.key) return filteredCars;
    const { key, dir } = sortConfig;
    const mult = dir === 'asc' ? 1 : -1;
    return [...filteredCars].sort((a, b) => {
      if (key === 'model') {
        const aName = `${a.brand} ${a.family || ''} ${a.model}`.toLowerCase();
        const bName = `${b.brand} ${b.family || ''} ${b.model}`.toLowerCase();
        return aName.localeCompare(bName, 'ru') * mult;
      }
      if (key === 'years') {
        const aYear = parseInt(a.years?.match(/\d{4}/)?.[0] || '0', 10);
        const bYear = parseInt(b.years?.match(/\d{4}/)?.[0] || '0', 10);
        return (aYear - bYear) * mult;
      }
      if (key === 'timing') {
        const aChain = a.timing.toLowerCase().includes('цепь') ? 1 : 0;
        const bChain = b.timing.toLowerCase().includes('цепь') ? 1 : 0;
        return (aChain - bChain) * mult;
      }
      return 0;
    });
  }, [filteredCars, sortConfig]);

  // Sliced cars for progressive rendering (the table gets the same cap: 275
  // rows would mean ~14k DOM nodes and a ~400ms freeze when switching view)
  const displayedCars = useMemo(() => {
    return sortedCars.slice(0, visibleCount);
  }, [sortedCars, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + CARS_PER_PAGE, filteredCars.length));
  };

  const resetFilters = () => {
    setSelectedBrand('');
    setSelectedFamily('');
    setSelectedEngine('');
    setSearchQuery('');
    setActiveQuickFilter('all');
    showToast('Фильтры сброшены');
  };

  const handleToggleCompare = useCallback((car) => {
    setCompareList((prev) => {
      const exists = prev.some((c) => c.id === car.id);
      if (exists) {
        showToast(`Удалено из сравнения: ${car.model}`);
        return prev.filter((c) => c.id !== car.id);
      } else {
        if (prev.length >= 3) {
          showToast('Максимум 3 авто для сравнения!');
          return prev;
        }
        showToast(`Добавлено к сравнению: ${car.model}`);
        return [...prev, car];
      }
    });
  }, [showToast]);

  // Set lookup instead of compareList.some() per card on every render
  const comparedIds = useMemo(() => new Set(compareList.map((c) => c.id)), [compareList]);

  const handleRemoveFromCompare = (id) => {
    setCompareList((prev) => prev.filter((c) => c.id !== id));
  };

  const handleClearCompare = () => {
    setCompareList([]);
    showToast('Список сравнения очищен');
  };

  const hasActiveFilters = Boolean(
    selectedBrand || selectedFamily || selectedEngine || searchQuery || activeQuickFilter !== 'all'
  );

  return (
    <div className="relative flex flex-col min-h-screen font-sans selection:bg-amberGold-500/30">
      
      {/* Hardware-accelerated ambient background */}
      <div className="ambient-bg" />

      {/* Toast popup */}
      <Toast message={toastMessage} visible={isToastVisible} />

      {/* Global Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        compareList={compareList}
        setIsCompareOpen={setIsCompareOpen}
        onOpenGuide={() => setIsGuideOpen(true)}
        theme={theme}
        setTheme={setTheme}
        winterMode={winterMode}
        setWinterMode={setWinterMode}
        totalCars={carsData.length}
        filteredCount={filteredCars.length}
      />

      {/* Hero with Search and Highlights */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        brands={brands}
        totalCars={carsData.length}
        filteredCount={filteredCars.length}
      />

      {/* Main Catalog Workspace */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step-by-step cascading filters */}
        <FilterBar
          brands={brands}
          families={families}
          engines={engines}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedFamily={selectedFamily}
          setSelectedFamily={setSelectedFamily}
          selectedEngine={selectedEngine}
          setSelectedEngine={setSelectedEngine}
          activeQuickFilter={activeQuickFilter}
          setActiveQuickFilter={setActiveQuickFilter}
          resetFilters={resetFilters}
          filteredCount={filteredCars.length}
          totalCars={carsData.length}
          hasActiveFilters={hasActiveFilters}
        />

        {/* VIN Decoder Result Banner */}
        {isVinSearch && vinInfo && (
          <VinDecodeBanner
            vinInfo={vinInfo}
            loading={vinLoading}
            onClear={() => setSearchQuery('')}
          />
        )}

        {/* Quick Result Summary when narrowed down to 1 exact car */}
        {dataState === 'ready' && filteredCars.length === 1 && (
          <QuickResultBanner
            car={filteredCars[0]}
            winterMode={winterMode}
            onOpenModal={setSelectedCar}
            onCopyClient={copyToClipboard}
          />
        )}

        {/* Results Container */}
        {dataState === 'error' ? (
          <div className="py-20 glass-card rounded-2xl p-8 text-center border border-white/10 flex flex-col items-center justify-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amberGold-500/10 text-amberGold-400">
              ⚠️
            </div>
            <h3 className="text-xl font-bold">Не удалось загрузить каталог</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
              Проверьте подключение к сети и обновите страницу — база версий загружается отдельным файлом.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-amberGold-500 hover:bg-amberGold-400 text-slate-950 transition-colors cursor-pointer"
            >
              Обновить страницу
            </button>
          </div>
        ) : dataState === 'loading' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-5 h-[390px] animate-pulse border border-slate-200 dark:border-white/10"
              >
                <div className="flex gap-2 mb-4">
                  <div className="h-5 w-16 rounded-md bg-slate-200 dark:bg-white/10" />
                  <div className="h-5 w-20 rounded-md bg-slate-200 dark:bg-white/10" />
                </div>
                <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-white/10 mb-4" />
                <div className="h-9 w-full rounded-lg bg-slate-200 dark:bg-white/10 mb-3" />
                <div className="h-9 w-full rounded-lg bg-slate-200 dark:bg-white/10 mb-3" />
                <div className="h-9 w-full rounded-lg bg-slate-200 dark:bg-white/10" />
              </div>
            ))}
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="py-20 glass-card rounded-2xl p-8 text-center border border-white/10 flex flex-col items-center justify-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amberGold-500/10 text-amberGold-400">
              🔍
            </div>
            <h3 className="text-xl font-bold">
              По вашему запросу модификаций не найдено
            </h3>
            <p className="text-sm text-slate-400 max-w-md">
              Попробуйте изменить запрос или сбросить фильтры марки и двигателя.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-amberGold-500 hover:bg-amberGold-400 text-slate-950 transition-colors cursor-pointer"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onSelectCar={setSelectedCar}
                  onToggleCompare={handleToggleCompare}
                  isCompared={comparedIds.has(car.id)}
                  winterMode={winterMode}
                  searchQuery={isVinSearch ? '' : deferredQuery}
                  onCopyText={copyToClipboard}
                />
              ))}
            </div>

            {/* Load more progressive button */}
            {visibleCount < filteredCars.length && (
              <div className="flex flex-col items-center justify-center gap-2 py-4">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-amberGold-500 hover:text-slate-950 text-white border border-white/15 hover:border-amberGold-400 shadow-lg transition-all cursor-pointer"
                >
                  Показать еще ({filteredCars.length - visibleCount} осталось)
                </button>
                <span className="text-xs text-slate-400 font-mono">
                  Отображено {displayedCars.length} из {filteredCars.length} версий
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <TableView
              cars={displayedCars}
              onSelectCar={setSelectedCar}
              onToggleCompare={handleToggleCompare}
              compareList={compareList}
              onCopyText={copyToClipboard}
              winterMode={winterMode}
              searchQuery={isVinSearch ? '' : deferredQuery}
              sortConfig={sortConfig}
              onSort={handleSort}
            />

            {/* Same progressive loading as the card grid */}
            {visibleCount < filteredCars.length && (
              <div className="flex flex-col items-center justify-center gap-2 pb-4">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-amberGold-500 hover:text-slate-950 text-white border border-white/15 hover:border-amberGold-400 shadow-lg transition-colors cursor-pointer"
                >
                  Показать еще ({filteredCars.length - visibleCount} осталось)
                </button>
                <span className="text-xs text-slate-500 font-mono">
                  Отображено {displayedCars.length} из {filteredCars.length} версий
                </span>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Floating Scroll to Top button with live percent */}
      <ScrollToTop />

      {/* Car Detail Modal (lazy chunk, prefetched while idle) */}
      <Suspense fallback={null}>
        <CarDetailModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          onCopyText={copyToClipboard}
          winterMode={winterMode}
        />
        <SparkPlugGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
        />
      </Suspense>

      {/* Side-by-side Compare Drawer */}
      <CompareDrawer
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        compareList={compareList}
        onRemoveFromCompare={handleRemoveFromCompare}
        onClearCompare={handleClearCompare}
        onSelectCar={(car) => {
          setIsCompareOpen(false);
          setSelectedCar(car);
        }}
      />

      {/* Footer */}
      <Footer totalCars={carsData.length} />

    </div>
  );
}
