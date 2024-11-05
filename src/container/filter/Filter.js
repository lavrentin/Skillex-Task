import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import useDebounce from '../../hook/useDebounce';
import mockData from '../../data/mockData';

const Filters = styled.div`
    margin: 10px;
    border-radius: 4px;
    background-color: #f9f9f9;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-wrap: wrap;
    padding: 20px;

    @media (max-width: 768px) {
        display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
        flex-direction: column;
        align-items: center;
    }
`;

const Choice = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 auto;

    .custom-control {
        background-color: #f0f0f0;
        border-radius: 5px;
        border: 1px solid #5e5bff;
        width: 125px;
    }

    .custom-menu {
        background-color: #fff;
        border: 1px solid #ddd;
        max-height: 205px;

        .is-selected {
            background-color: #8a87dc;
        }
    }

    .custom-arrow {
        border-color: #333 transparent transparent transparent;
    }

    label {
        margin-bottom: 5px;
        font-size: 1.2em;
    }

    input {
        padding: 10px 7px;
        background-color: #f0f0f0;
        border-radius: 5px;
        border: 1px solid #5e5bff;
        width: 100px;
    }
    @media (max-width: 768px) {
        input {
            padding: 10px 12px;
        }
    }

    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    input[type=number] {
        -moz-appearance: textfield;
    }
`;

const ChoiceSort = styled(Choice)`
    display: flex;
    flex-direction: column;
    margin: 0 auto;

    @media (max-width: 768px) {
            margin: 0 0 0 25px;
    }
    `;

const RangeFilter = styled.div`
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        input {
            &:last-child {
                margin-top: 1.2em;
            }
        }
        span{
            display: none;
        }
    }
`;

const ToggleButton = styled.button`
    display: none;
    @media (max-width: 768px) {
        display: block;
        margin: 10px auto;
        padding: 10px;
        background-color: #5e5bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
`;

const ArrowButton = styled.button`
    margin-left: 5px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1em;
    color: #5e5bff;
    font-weight: bold;
    font-family: system-ui;    
    
    &:hover {
        color: #3e3bff;
    }
`;

const Filter = ({ setFilteredProducts, setLoading, setNoProducts }) => {
    const [filters, setFilters] = useState(() => {
        const savedFilters = localStorage.getItem('filters');
        return savedFilters ? JSON.parse(savedFilters) : {
            category: 'All',
            brand: 'All',
            minPrice: '',
            maxPrice: '',
            rating: '',
            sortBy: '',
            sortOrder: 'asc'
        };
    });

    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const debouncedFilters = useDebounce(filters, 300);

    useEffect(() => {
        localStorage.setItem('filters', JSON.stringify(filters));
    }, [filters]);

    useEffect(() => {
        setLoading(true);
        const timeoutId = setTimeout(() => {
            let products = mockData;

            if (filters.sortBy) {
                products = products.sort((a, b) => {
                    let comparison = 0;
                    if (filters.sortBy === 'price') {
                        comparison = a.price - b.price;
                    } else if (filters.sortBy === 'rating') {
                        comparison = b.rating - a.rating;
                    } else if (filters.sortBy === 'popularity') {
                        comparison = b.popularity - a.popularity;
                    }
                    return filters.sortOrder === 'asc' ? comparison : -comparison;
                });
            }

            setFilteredProducts(products);
            setLoading(false);
            setNoProducts(products.length === 0);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [debouncedFilters, setFilteredProducts, setLoading, setNoProducts]);

    const handleChange = (name, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const toggleSortOrder = () => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            sortOrder: prevFilters.sortOrder === 'asc' ? 'desc' : 'asc',
        }));
    };

    const categories = ["All", "Electronics", "Footwear", "Clothing"];
    const brands = ["All", "Brand A", "Brand B", "Brand C", "Brand D", "Brand E"];
    const sortOptions = ["", "price", "rating", "popularity"];

    return (
        <div>
            <ToggleButton onClick={() => setIsFilterVisible(!isFilterVisible)}>
                {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
            </ToggleButton>
            <Filters isVisible={isFilterVisible} data-testid='filter-component'>
                <Choice>
                    <label htmlFor="category">Category:</label>
                    <Dropdown
                        id="category"
                        aria-labelledby="category-label"
                        options={categories}
                        onChange={(option) => handleChange('category', option.value)}
                        value={filters.category}
                        placeholder="Select a category"
                        controlClassName="custom-control"
                        menuClassName="custom-menu"
                        arrowClassName="custom-arrow"
                    />
                </Choice>
                <Choice>
                    <label>Brand:</label>
                    <Dropdown
                        options={brands}
                        onChange={(option) => handleChange('brand', option.value)}
                        value={filters.brand}
                        placeholder="Select a brand"
                        controlClassName="custom-control"
                        menuClassName="custom-menu"
                        arrowClassName="custom-arrow"
                    />
                </Choice>
                <Choice>
                    <label>Price Range:</label>
                    <RangeFilter>
                        <input type="number" name="minPrice" placeholder="Min"
                               onChange={(e) => handleChange(e.target.name, e.target.value)}/>
                        <span>-</span>
                        <input type="number" name="maxPrice" placeholder="Max"
                               onChange={(e) => handleChange(e.target.name, e.target.value)}/>
                    </RangeFilter>
                </Choice>
                <Choice>
                    <label htmlFor="rating">Rating:</label>
                    <input id="rating" type="number" name="rating" placeholder="Rating"
                           onChange={(e) => handleChange(e.target.name, e.target.value)}/>
                </Choice>
                <ChoiceSort>
                    <label>Sort By:</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Dropdown
                            options={sortOptions}
                            onChange={(option) => handleChange('sortBy', option.value)}
                            value={filters.sortBy}
                            placeholder="Sort by"
                            controlClassName="custom-control"
                            menuClassName="custom-menu"
                            arrowClassName="custom-arrow"
                        />
                        <ArrowButton onClick={toggleSortOrder}>
                            {filters.sortOrder === 'asc' ? '↑' : '↓'}
                        </ArrowButton>
                    </div>
                </ChoiceSort>
            </Filters>
        </div>
    );
};

export default Filter;
