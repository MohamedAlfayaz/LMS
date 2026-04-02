import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
import { setSearch, setCategory, setPage } from "../store/highlightSlice";

export const useTable = (
  data = [],
  searchKey = "title",
  filterKey = "category"
) => {
  const dispatch = useDispatch();

  const { search, category, page, perPage } = useSelector(
    (state) => state.highlight
  );

  // 🔥 SAFE + OPTIMIZED FILTER
  const filtered = useMemo(() => {
    return data.filter((item) => {
      const value = item?.[searchKey] || "";

      const matchSearch = value
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        category === "All"
          ? true
          : String(item?.[filterKey]).toLowerCase() ===
            category.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [data, search, category, searchKey, filterKey]);

  // 🔥 PAGINATION (MEMO)
  const totalPages = useMemo(() => {
    return Math.ceil(filtered.length / perPage) || 1;
  }, [filtered.length, perPage]);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage]);

  // 🔥 SAFE PAGE HANDLING (edge case fix)
  const safePage = page > totalPages ? totalPages : page;

  return {
    search,
    category,
    page: safePage,
    totalPages,
    filtered,
    paginated,

    // 🔥 ACTIONS
    setSearch: (val) => dispatch(setSearch(val)),
    setCategory: (val) => dispatch(setCategory(val)),
    setPage: (val) => dispatch(setPage(val)),
  };
};