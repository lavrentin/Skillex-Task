import React, { useState } from 'react';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';
import Filter from '../container/filter/Filter';
import ProductList from '../container/component/ProductList';

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled.div`
    display: flex;
    justify-content: center;
    margin: 20px;
    font-family: sans-serif;
    color: #5e5bff;
`;

const FilterContainer = styled.div`
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const Products = () => {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noProducts, setNoProducts] = useState(false);

    return (
        <Container data-testid="productsContainer">
            <Title>
                <h1>Product List</h1>
            </Title>

            <FilterContainer>
                <Filter setFilteredProducts={setFilteredProducts} setLoading={setLoading} setNoProducts={setNoProducts} />
                {loading ? (
                    <ClipLoader size={150} />
                ) : noProducts ? (
                    <div>No products found</div>
                ) : (
                    <ProductList filteredProducts={filteredProducts} />
                )}
            </FilterContainer>
        </Container>
    );
};

export default Products;