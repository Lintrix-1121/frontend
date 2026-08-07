// src/components/HorizontalNav.jsx
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/HorizontalNav.css";
import categoryApi from "../services/admin/CategoriesApi"; // Use your category API

export default function HorizontalNav() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await categoryApi.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    } 
  };

  // Flatten categories for navigation (show all levels)
  const flattenCategories = (cats, level = 0) => {
    let result = [];
    cats.forEach(cat => {
      result.push({
        ...cat,
        level,
        name: ' '.repeat(level * 2) + cat.name // Indentation for hierarchy
      });
      if (cat.children && cat.children.length > 0) {
        result = [...result, ...flattenCategories(cat.children, level + 1)];
      }
    });
    return result;
  };

  const flattenedCategories = flattenCategories(categories);

  // Check if a nav link is active
  const isActive = (categorySlug) => {
    const currentPath = location.pathname;
    if (categorySlug === '/products') {
      return currentPath === '/products' || currentPath === '/';
    }
    return currentPath === `/category/${categorySlug}`;
  };

  if (loading) {
    return (
      <div className="bg-success">
        <div className="container position-relative">
          <div className="nav-scroll d-flex align-items-center py-2">
            <div className="spinner-border spinner-border-sm text-white me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="text-white">Loading categories...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-success">
      <div className="container position-relative">
        <div className="nav-scroll d-flex align-items-center py-2">
          {/* "All Products" link */}
          <NavLink
            to="/products"
            className={`nav-link text-white px-3 ${isActive('/products') ? 'active' : ''}`}
            end
          >
            All
          </NavLink>
          
          {/* Real categories from backend */}
          {flattenedCategories.map((category) => (
            <NavLink
              key={category.categoryId || category.id}
              to={`/category/${category.slug}`}
              className={`nav-link text-white px-3 ${isActive(category.slug) ? 'active' : ''}`}
              style={{ marginLeft: category.level * 10 }}
            >
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}


